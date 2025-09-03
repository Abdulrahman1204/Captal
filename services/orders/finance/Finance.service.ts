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

class FinanceService {
  // ~ Post => /api/captal/orderFinance ~ Create New Order Finance
  static async createFinance(
    financeData: IFinance,
    file?: ICloudinaryFile
  ): Promise<IFinance> {
    const { error } = validaionCreateFinance(financeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: financeData.phone });

    const statusUser = existingUser ? "eligible" : "visited";
    const userId = existingUser ? existingUser._id : null;

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

    return newFinance;
  }

  // ~ Get > /api/captal/orderFinance ~ Get Orders Finance All
  static async getFinances(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IFinance[]> {
    const filter: any = {};
    if (search) {
      filter.firstName = { $regex: search, $options: "i" };
    }

    const finances = await Finance.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    return finances;
  }

  // ~ Get > /api/captal/orderFinance/contractor/:id ~ Get Orders Finance By Contractor`s Id
  static async getFinanceContractorId(
    id: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IFinance[]> {
    const filter: any = { userId: id };
    if (search) {
      filter.firstName = { $regex: search, $options: "i" };
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
}

export { FinanceService };
