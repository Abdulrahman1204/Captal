import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import { ClassFather } from "../../models/classifications/father/ClassFather.model";
import { IMaterial } from "../../models/materials/dtos";
import {
  Material,
  validationCreateMaterial,
  validationUpdateMaterial,
} from "../../models/materials/Material.model";
import { ICloudinaryFile } from "../../utils/types";

class MaterialService {
  // ~ POST => /api/captal/material ~ Create New Material
  static async createNewMaterial(
    materialData: IMaterial,
    file?: ICloudinaryFile
  ): Promise<IMaterial> {
    const { error } = validationCreateMaterial(materialData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingMaterial = await Material.findOne({
      materialName: materialData.materialName,
    });
    if (existingMaterial) {
      throw new BadRequestError("المادة موجودة مسبقاً");
    }

    const existingserialNumberl = await Material.findOne({
      serialNumber: materialData.serialNumber,
    });
    if (existingserialNumberl) {
      throw new BadRequestError("الرقم التسلسلي موجود مسبقاً");
    }

    const existingClassification = await ClassFather.findById(
      materialData.classification
    );
    if (!existingClassification) {
      throw new BadRequestError("التصنيف الرئيسي غير موجود");
    }

    const uploadedFile = file
      ? {
          url: file.secure_url || file.path,
          publicId: file.public_id || file.filename,
        }
      : { url: "", publicId: null };

    const newMaterial = await Material.create({
      materialName: materialData.materialName,
      serialNumber: materialData.serialNumber,
      classification: materialData.classification,
      attachedFile: uploadedFile,
    });

    if (!newMaterial) {
      throw new BadRequestError("فشل في إضافة المادة");
    }

    return newMaterial;
  }

  // ~ PUT => /api/captal/material/:id ~ Update Material
  static async updateMaterial(
    materialData: IMaterial,
    id: string,
    file?: ICloudinaryFile
  ): Promise<IMaterial> {
    const { error } = validationUpdateMaterial(materialData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const material = await Material.findById(id);
    if (!material) {
      throw new NotFoundError("المادة غير موجودة");
    }

    const updateData: any = {
      materialName: materialData.materialName,
      serialNumber: materialData.serialNumber,
      classification: materialData.classification,
    };

    if (file) {
      updateData.attachedFile = {
        url: file.secure_url || file.path,
        publicId: file.public_id || file.filename,
      };
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedMaterial) {
      throw new BadRequestError("فشل في إضافة المادة");
    }

    return material;
  }

  // ~ DELETE => /api/captal/material/:id ~ Delete Material
  static async deleteMaterial(id: string): Promise<IMaterial> {
    const material = await Material.findById(id);
    if (!material) {
      throw new NotFoundError("المادة غير موجودة");
    }

    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (!deletedMaterial) {
      throw new BadRequestError("فشل في حذف المادة");
    }

    return material;
  }

  // ~ GET => /api/captal/material ~ Get Material
  static async getMaterials(): Promise<IMaterial[]> {
    const materials = await Material.find().sort({
      createdAt: -1,
    });
    return materials;
  }
}

export { MaterialService };
