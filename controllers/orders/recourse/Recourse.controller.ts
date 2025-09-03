import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RecourseOrderService } from "../../../services/orders/recourse/Recourse.service";
import { ICloudinaryFile } from "../../../utils/types";

class RecourseOrderController {
  // ~ Post => /api/captal/recourseUserOrder ~ Create New Order Recourse
  createRecourseOrderCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await RecourseOrderService.createRecourseOrder(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json({
        message: "تم إضافة المادة بنجاح",
      });
    }
  );

  // ~ Get => /api/captal/recourseUserOrder ~ Get Orders Recourse all
  getRecourseCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const recourses = await RecourseOrderService.getRecourse(
        search,
        page,
        limit
      );

      res.status(200).json(recourses);
    }
  );

  // ~ Get => /api/captal/recourseUserOrder/:id ~ Get Orders Recourse By Recourse`s Id
  getRecourseByRecourseIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const recourses = await RecourseOrderService.getRecourseByRecourseId(
        req.params.id,
        search,
        page,
        limit
      );

      res.status(200).json(recourses);
    }
  );

  // ~ Put => /api/captal/recourseUserOrder/status/:id ~ Update Order Recourse
  updateStatusRecourseCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await RecourseOrderService.updateStatusRecourse(req.body, req.params.id);

      res.status(201).json({
        message: "تم تحديث الطلب بنجاح",
      });
    }
  );
}

export default new RecourseOrderController();
