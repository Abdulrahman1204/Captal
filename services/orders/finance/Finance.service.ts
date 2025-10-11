import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IFinance } from "../../../models/orders/dtos";
import {
  Finance,
  validaionCreateFinance,
  validaionUpdateStatusFinance,
} from "../../../models/orders/finance/Finance.model";
import { User } from "../../../models/users/User.model";
import { ICloudinaryFile } from "../../../utils/types";
import { NotificationService } from "../../notification/Notification.service";
import jwt from "jsonwebtoken";

class FinanceService {
  // ~ Post => /api/captal/orderFinance ~ Create New Order Finance
  static async createFinance(
    financeData: IFinance,
    file?: ICloudinaryFile,
    token?: string
  ): Promise<IFinance> {
    const { error } = validaionCreateFinance(financeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: financeData.phone });
    let statusUser = existingUser ? "eligible" : "visited";

    // Default userId based on phone match
    let userId = existingUser ? existingUser._id : null;

    // If a token is provided, try to decode it and prefer the user id from token when valid
    if (token && userId === null) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as { id?: string };

      if (decoded && decoded.id) {
        const userByToken = await User.findById(decoded.id);
        if (userByToken) {
          userId = userByToken._id;
          statusUser = "eligible";
        }
      }
    }

    const uploadedFile = file
      ? {
          url: file.secure_url || file.path,
          publicId: file.public_id || file.filename,
        }
      : { url: "", publicId: null };

    const newFinance = await Finance.create({
      firstName: financeData.firstName,
      lastName: financeData.lastName,
      phone: financeData.phone,
      email: financeData.email,
      companyName: financeData.companyName,
      dateOfCompany: financeData.dateOfCompany,
      projectName: financeData.projectName,
      lastYearRevenue: financeData.lastYearRevenue,
      requiredAmount: financeData.requiredAmount,
      description: financeData.description,
      attachedFile: uploadedFile,
      statusUser,
      userId,
    });

    const text = "تم إنشاء طلب بالأجل جديد";

    await NotificationService.createNotification(text);

    return newFinance;
  }

  // ~ Get > /api/captal/orderFinance ~ Get Orders Finance All
  static async getFinances(
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

    const finances = await Finance.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await Finance.countDocuments();

    return {
      finances,
      total,
      filterNum: finances.length,
    };
  }

  // ~ Get > /api/captal/orderFinance/contractor/:id ~ Get Orders Finance By Contractor`s Id
  static async getFinanceContractorId(
    id: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IFinance[]> {
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

    const finances = await Finance.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    return finances;
  }

  // ~ Put > /api/captal/orderFinance/status/:id ~ Update Status Of Finance Order
  static async updateStatusFinance(
    financeData: IFinance,
    id: string
  ): Promise<IFinance> {
    const { error } = validaionUpdateStatusFinance(financeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updateStatus = await Finance.findByIdAndUpdate(
      id,
      {
        $set: { statusOrder: financeData.statusOrder },
      },
      { new: true }
    );

    return finance;
  }

  // ~ Get > /api/captal/orderFinance/:id ~ Get Single Finance By Id
  static async getFinanceById(id: string): Promise<IFinance> {
    // Validate mongoose ObjectId
    // Importing mongoose here would create an extra dependency; instead validate by checking id length and format using mongoose.Types if needed in other files. But to keep consistent with other services, use User.findById earlier which relies on mongoose; here we'll check via Finance.findById directly and let Mongoose handle invalid ids by returning null.

    const finance = await Finance.findById(id);
    if (!finance) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return finance;
  }
}

export { FinanceService };
