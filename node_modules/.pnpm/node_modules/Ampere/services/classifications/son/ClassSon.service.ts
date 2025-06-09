import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IClassSon } from "../../../models/classifications/dtos";
import {
  ClassSon,
  validationCreateClassSon,
  validationUpdateClassSon,
} from "../../../models/classifications/son/ClassSon.model";

class ClassSonService {
  // ~ POST => /api/captal/ClassSon ~ Create New Classification Son
  static async createNewClassSon(classData: IClassSon): Promise<IClassSon> {
    const { error } = validationCreateClassSon(classData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingClassSon = await ClassSon.findOne({
      sonName: classData.sonName,
      fatherName: classData.fatherName,
    });
    if (existingClassSon) {
      throw new BadRequestError("التصنيفات موجودة مسبقا");
    }

    const newClassSon = await ClassSon.create({
      fatherName: classData.fatherName,
      sonName: classData.sonName,
    });

    if (!newClassSon) {
      throw new BadRequestError("فشل في إضافة التصنيف الفرعي");
    }

    return newClassSon;
  }

  // ~ PUT => /api/captal/ClassSon/:id ~ Update Classification Son
  static async updateClassSon(
    classData: IClassSon,
    id: string
  ): Promise<IClassSon> {
    const { error } = validationUpdateClassSon(classData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const classSon = await ClassSon.findById(id);
    if (!classSon) {
      throw new NotFoundError("التصنيف الفرعي غير موجود");
    }

    const updatedClassSon = await ClassSon.findByIdAndUpdate(
      id,
      {
        $set: {
          fatherName: classData.fatherName,
          sonName: classData.sonName,
        },
      },
      { new: true }
    );

    if (!updatedClassSon) {
      throw new BadRequestError("فشل في إضافة التصنيف الفرعي");
    }

    return classSon;
  }

  // ~ DELETE => /api/captal/ClassSon/:id ~ Delete Classification Son
  static async deleteClassSon(id: string): Promise<IClassSon> {
    const classSon = await ClassSon.findById(id);
    if (!classSon) {
      throw new NotFoundError("التصنيف الفرعي غير موجود");
    }

    const deletedClassSon = await ClassSon.findByIdAndDelete(id);

    if (!deletedClassSon) {
      throw new BadRequestError("فشل في إضافة التصنيف الفرعي");
    }

    return classSon;
  }

  // ~ GET => /api/captal/ClassSon ~ Get All Classification Son
  static async getClassSon(): Promise<IClassSon[]> {
    const classesSon = await ClassSon.find().sort({ createdAt: -1 });

    return classesSon;
  }
}

export { ClassSonService };
