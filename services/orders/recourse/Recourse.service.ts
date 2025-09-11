import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IRecourse } from "../../../models/orders/dtos";
import {
  RecourseOrder,
  validaionUpdateStatusRecourse,
  validationCreateRecourseOrder,
} from "../../../models/orders/recourse/Recourse.model";
import { User } from "../../../models/users/User.model";
import { ICloudinaryFile } from "../../../utils/types";

class RecourseOrderService {
  // ~ Post => /api/captal/recourseUserOrder ~ Create New Order Recourse
  static async createRecourseOrder(
    recourseData: IRecourse,
    file?: ICloudinaryFile
  ) {
    const { error } = validationCreateRecourseOrder(recourseData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const advance = parseFloat(recourseData.advance.replace("%", "")) || 0;
    const uponDelivry =
      parseFloat(recourseData.uponDelivry.replace("%", "")) || 0;
    const afterDelivry =
      parseFloat(recourseData.afterDelivry.replace("%", "")) || 0;

    const total = advance + uponDelivry + afterDelivry;

    if (total !== 100) {
      throw new BadRequestError("مجموع الدفعات يجب أن يكون 100%");
    }

    const existingUser = await User.findOne({
      phone: recourseData.recoursePhone,
      role: "recourse",
    });

    if (!existingUser) {
      throw new NotFoundError("المورد غير موجود في النظام");
    }

    const userId = existingUser ? existingUser?._id : null;

    const uploadedFile = file
      ? {
          url: file.secure_url || file.path,
          publicId: file.public_id || file.filename,
        }
      : { url: "", publicId: null };

    const newRecourse = await RecourseOrder.create({
      recourseName: recourseData.recourseName,
      recoursePhone: recourseData.recoursePhone,
      clientName: recourseData.clientName,
      clientPhone: recourseData.clientPhone,
      serialNumber: recourseData.serialNumber,
      projectName: recourseData.projectName,
      dateOfproject: recourseData.dateOfproject || new Date(),
      attachedFile: uploadedFile || { publicId: null, url: "" },
      materials: recourseData.materials || [],
      paymentCheck: recourseData.paymentCheck,
      advance: recourseData.advance,
      uponDelivry: recourseData.uponDelivry,
      afterDelivry: recourseData.afterDelivry,
      countryName: recourseData.countryName,
      location: {
        type: "Point",
        coordinates: recourseData.location?.coordinates || [0, 0],
      },
      userId: userId,
    });

    return newRecourse;
  }

  // ~ Get => /api/captal/recourseUserOrder ~ Get Orders Recourse all
  static async getRecourse(
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const filter: any = {};
    if (search) {
      filter.recourseName = { $regex: search, $options: "i" };
    }

    const recourses = await RecourseOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await RecourseOrder.countDocuments();

    return {
      recourses,
      total,
      filterNum: recourses.length,
    };
  }

  // ~ Get => /api/captal/recourseUserOrder/:id ~ Get Orders Recourse By Recourse`s Id
  static async getRecourseByRecourseId(
    id: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IRecourse[]> {
    const filter: any = { userId: id };
    if (search) {
      filter.recourseName = { $regex: search, $options: "i" };
    }

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("المقاول غير موجود");
    }

    const recourses = await RecourseOrder.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(limit * (page - 1))
      .limit(limit);

    return recourses;
  }

  // ~ Put => /api/captal/recourseUserOrder/status/:id ~ Update Order Recourse
  static async updateStatusRecourse(
    recourseData: IRecourse,
    id: String
  ): Promise<IRecourse> {
    const { error } = validaionUpdateStatusRecourse(recourseData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const recourse = await RecourseOrder.findById(id);

    if (!recourse) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updateStatus = await RecourseOrder.findByIdAndUpdate(
      id,
      {
        $set: { statusOrder: recourseData.statusOrder },
      },
      { new: true }
    );

    return recourse;
  }
}

export { RecourseOrderService };
