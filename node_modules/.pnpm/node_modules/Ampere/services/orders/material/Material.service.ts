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

class MaterialOrderService {
  // ~ Post => /api/captal/orderMaterial ~ Create New Order Material
  static async createMaterialOrder(
    materialData: IMaterial,
    file?: ICloudinaryFile
  ): Promise<IMaterial> {
    const { error } = validationCreateMaterialOrder(materialData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: materialData.phone });

    const statusUser = existingUser ? "eligible" : "visited";
    const userId = existingUser ? existingUser._id : null;

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

    return newMaterial;
  }

  // ~ Get => /api/captal/orderMaterial ~ Get Orders Material all
  static async getMaterials(): Promise<IMaterial[]> {
    const materials = await MaterialOrder.find().sort({ createdAt: -1 });

    return materials;
  }

  // ~ Get => /api/captal/orderMaterial/contractor/:id ~ Get Orders Material By Contractor`s Id
  static async getMaterialContractorId(id: string): Promise<IMaterial[]> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("المقاول غير موجود");
    }

    const materials = await MaterialOrder.find({ userId: id }).sort({
      createdAt: -1,
    });
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

    return material;
  }
}

export { MaterialOrderService };
