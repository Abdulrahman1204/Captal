import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ClassFatherService } from "../../../services/classifications/father/ClassFather.service";

class ClassFatherController {
  // ~ POST => /api/captal/ClassFather ~ Create New Classification Father
  createNewClassFatherCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassFatherService.createNewClassFather(req.body);
      res.status(201).json({
        message: "تم إنشاء التصنيف الرئيسي بنجاح",
      });
    }
  );

  // ~ PUT => /api/captal/ClassFather/:id ~ Update Classification Father
  updateClassFatherCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassFatherService.updateClassFather(req.body, req.params.id);

      res.status(200).json({
        message: "تم تحديث التصنيف الرئيسي بنجاح",
      });
    }
  );

  // ~ DELETE => /api/captal/ClassFather/:id ~ Delete Classification Father
  deleteClassFatherCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassFatherService.deleteClassFather(req.params.id);

      res.status(200).json({
        message: "تم حذف التصنيف الرئيسي بنجاح",
      });
    }
  );

  // ~ GET => /api/captal/ClassFather ~ Get All Classification Father
  getClassFatherCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const classesFather = await ClassFatherService.getClassFather(
        search,
        page,
        limit
      );

      res.status(200).json(classesFather);
    }
  );
}

export default new ClassFatherController();
