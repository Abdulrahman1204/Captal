import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ClassSonService } from "../../../services/classifications/son/ClassSon.service";

class ClassSonController {
  // ~ POST => /api/captal/ClassSon ~ Create New Classification Son
  createNewClassSonCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassSonService.createNewClassSon(req.body);
      res.status(201).json({
        message: "تم إنشاء التصنيف الفرعي بنجاح",
      });
    }
  );

  // ~ PUT => /api/captal/ClassSon/:id ~ Update Classification Son
  updateClassSonCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassSonService.updateClassSon(req.body, req.params.id);

      res.status(200).json({
        message: "تم تحديث التصنيف الفرعي بنجاح",
      });
    }
  );

  // ~ DELETE => /api/captal/ClassSon/:id ~ Delete Classification Son
  deleteClassSonCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await ClassSonService.deleteClassSon(req.params.id);

      res.status(200).json({
        message: "تم حذف التصنيف الفرعي بنجاح",
      });
    }
  );

  // ~ GET => /api/captal/ClassSon ~ Get All Classification Son
 getClassSon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const classesSon = await ClassSonService.getClassSon(search, page, limit);

      res.status(200).json(classesSon);
    }
  );
}

export default new ClassSonController();
