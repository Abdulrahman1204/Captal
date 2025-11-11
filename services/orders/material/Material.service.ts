import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IMaterial } from "../../../models/orders/dtos";
import {
  MaterialOrder,
  validationCreateMaterialOrder,
  validaionUpdateStatusMaterial,
} from "../../../models/orders/material/Material.model";
import { User } from "../../../models/users/User.model";
import { ICloudinaryFile } from "../../../utils/types";
import { MsegatService } from "../../mssgaty.service";
import { NotificationService } from "../../notification/Notification.service";
import jwt from "jsonwebtoken";

class MaterialOrderService {
  // ~ Post => /api/captal/orderMaterial ~ Create New Order Material
  static async createMaterialOrder(
    materialData: IMaterial,
    file?: ICloudinaryFile,
    token?: string
  ): Promise<IMaterial> {
    const { error } = validationCreateMaterialOrder(materialData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: materialData.phone });

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

    const newMaterial = await MaterialOrder.create({
      firstName: materialData.firstName,
      lastName: materialData.lastName,
      phone: materialData.phone,
      email: materialData.email,
      companyName: materialData.companyName,
      dateOfCompany: materialData.dateOfCompany,
      projectName: materialData.projectName,
      materials: materialData.materials,
      noteForQuantity: materialData.noteForQuantity,
      description: materialData.description,
      attachedFile: uploadedFile,
      statusUser,
      userId,
    });

    const text = "تم إنشاء طلب للمواد جديد";

    await NotificationService.createNotification(text);

    await MsegatService.sendOrderConfirmation(materialData.phone);

    return newMaterial;
  }

  // ~ Get => /api/captal/orderMaterial ~ Get Orders Material all
  static async getMaterials(
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

    const materials = await MaterialOrder.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "materials",
        model: "Material",
      })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await MaterialOrder.countDocuments();

    return {
      materials,
      total,
      filterNum: materials.length,
    };
  }

  // ~ Get => /api/captal/orderMaterial/contractor/:id ~ Get Orders Material By Contractor`s Id
  static async getMaterialContractorId(
    id: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IMaterial[]> {
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

    const materials = await MaterialOrder.find(filter)
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "materials",
        model: "Material",
      })
      .skip(limit * (page - 1))
      .limit(limit);
    return materials;
  }

  // ~ Put => /api/captal/orderMaterial/status/:id ~ Update Status Of Material Order
  static async updateStatusMaterial(
    materialData: IMaterial,
    id: string
  ): Promise<IMaterial> {
    const { error } = validaionUpdateStatusMaterial(materialData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const material = await MaterialOrder.findById(id);
    if (!material) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updateStatus = await MaterialOrder.findByIdAndUpdate(
      id,
      {
        $set: { statusOrder: materialData.statusOrder },
      },
      { new: true }
    );

    await MsegatService.sendStatusUpdate(material.phone);

    return material;
  }

  // ~ Get => /api/captal/orderMaterial/:id ~ Get Single Material Order By Id
  static async getMaterialById(id: string): Promise<IMaterial> {
    const material = await MaterialOrder.findById(id).populate({
      path: "materials",
      model: "Material",
    });

    if (!material) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return material;
  }
}

export { MaterialOrderService };
