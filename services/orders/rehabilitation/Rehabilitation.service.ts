import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IQualification } from "../../../models/orders/dtos";
import {
  Qualification,
  validaionCreateQualification,
  validaionUpdateStatusQualification,
} from "../../../models/orders/rehabilitation/Rehabilitation.Model";
import { User } from "../../../models/users/User.model";
import { ICloudinaryFile } from "../../../utils/types";
import { NotificationService } from "../../notification/Notification.service";

class RehabilitationService {
  // ~ Post => /api/captal/orderQualification ~ Create New Order Qualification
  static async createQualificationOrder(
    qualifiData: IQualification,
    file?: ICloudinaryFile
  ): Promise<IQualification> {
    const { error } = validaionCreateQualification(qualifiData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: qualifiData.phone });

    const statusUser = existingUser ? "eligible" : "visited";
    const userId = existingUser ? existingUser._id : null;

    const uploadedFile = file
      ? {
          url: file.secure_url || file.path,
          publicId: file.public_id || file.filename,
        }
      : { url: "", publicId: null };

    const newQualification = await Qualification.create({
      firstName: qualifiData.firstName,
      lastName: qualifiData.lastName,
      phone: qualifiData.phone,
      email: qualifiData.email,
      companyName: qualifiData.companyName,
      dateOfCompany: qualifiData.dateOfCompany,
      requiredAmount: qualifiData.requiredAmount,
      lastYearRevenue: qualifiData.lastYearRevenue,
      description: qualifiData.description,
      attachedFile: uploadedFile,
      statusUser,
      userId,
    });

    const text = "تم إنشاء طلب بالتأهيل جديد";

    await NotificationService.createNotification(text);

    return newQualification;
  }

  // ~ Get => /api/captal/orderQualification ~ Get Orders Qualification all
  static async getQualifications(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const filter: any = {};
    if (search) {
      filter.firstName = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.statusOrder = status;
    }

    const qualifications = await Qualification.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await Qualification.countDocuments();

    return {
      qualifications,
      total,
      filterNum: qualifications.length,
    };
  }

  // ~ Get => /api/captal/orderQualification/contractor/:id ~ Get Orders Qualification By Contractor`s Id
  static async getQualificationsContractorId(
    id: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IQualification[]> {
    const filter: any = { userId: id };
    if (search) {
      filter.firstName = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.statusOrder = status;
    }
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("المقاول غير موجود");
    }

    const qualifications = await Qualification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(limit * (page - 1))
      .limit(limit);

    return qualifications;
  }

  // ~ Put => /api/captal/orderQualification/status/:id ~ Update Qualification
  static async updateStatusQualification(
    qualifiData: IQualification,
    id: string
  ): Promise<IQualification> {
    const { error } = validaionUpdateStatusQualification(qualifiData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updateStatus = await Qualification.findByIdAndUpdate(
      id,
      {
        $set: { statusOrder: qualifiData.statusOrder },
      },
      { new: true }
    );

    return qualification;
  }
}

export { RehabilitationService };
