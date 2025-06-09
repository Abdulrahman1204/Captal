import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IClassFather } from "../../../models/classifications/dtos";
import {
  ClassFather,
  validationCreateClassFather,
  validationUpdateClassFather,
} from "../../../models/classifications/father/ClassFather.model";

class ClassFatherService {
  // ~ POST => /api/captal/ClassFather ~ Create New Classification Father
  static async createNewClassFather(
    classData: IClassFather
  ): Promise<IClassFather> {
    const { error } = validationCreateClassFather(classData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingClassFather = await ClassFather.findOne({
      fatherName: classData.fatherName,
    });
    if (existingClassFather) {
      throw new BadRequestError("التصنيف الرئيسي موجود مسبقا");
    }

    const newClassFather = await ClassFather.create({
      fatherName: classData.fatherName,
    });

    if (!newClassFather) {
      throw new BadRequestError("فشل في إضافة التصنيف الرئيسي");
    }

    return newClassFather;
  }

  // ~ PUT => /api/captal/ClassFather/:id ~ Update Classification Father
  static async updateClassFather(
    classData: IClassFather,
    id: string
  ): Promise<IClassFather> {
    const { error } = validationUpdateClassFather(classData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const classFather = await ClassFather.findById(id);
    if (!classFather) {
      throw new NotFoundError("التصنيف الرئيسي غير موجود");
    }

    const updatedClassFather = await ClassFather.findByIdAndUpdate(
      id,
      {
        $set: {
          fatherName: classData.fatherName,
        },
      },
      { new: true }
    );

    if (!updatedClassFather) {
      throw new BadRequestError("فشل في إضافة التصنيف الرئيسي");
    }

    return classFather;
  }

  // ~ DELETE => /api/captal/ClassFather/:id ~ Delete Classification Father
  static async deleteClassFather(id: string): Promise<IClassFather> {
    const classFather = await ClassFather.findById(id);
    if (!classFather) {
      throw new NotFoundError("التصنيف الرئيسي غير موجود");
    }

    const deletedClassFather = await ClassFather.findByIdAndDelete(id);

    if (!deletedClassFather) {
      throw new BadRequestError("فشل في حذف المادة");
    }

    return classFather;
  }

  // ~ GET => /api/captal/ClassFather ~ Get All Classification Father
  static async getClassFather(): Promise<IClassFather[]> {
    const classesFather = await ClassFather.find().sort({ createdAt: -1 }).populate(
      "sonNames",
      "sonName -fatherName"
    );
    return classesFather;
  }
}

export { ClassFatherService };
