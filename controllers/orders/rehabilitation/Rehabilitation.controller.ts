import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RehabilitationService } from "../../../services/orders/rehabilitation/Rehabilitation.service";
import { ICloudinaryFile } from "../../../utils/types";

class RehabilitationController {
  // ~ Post => /api/captal/orderQualification ~ Create New Order Qualification
  createQualificationOrderCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await RehabilitationService.createQualificationOrder(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json({
        message: "تم إضافة الطلب بنجاح",
      });
    }
  );

  // ~ Get => /api/captal/orderQualification ~ Get Orders Qualification all
  getQualificationsCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const qualifications = await RehabilitationService.getQualifications(
        search,
        page,
        limit
      );

      res.status(200).json(qualifications);
    }
  );

  // ~ Get => /api/captal/orderQualification/contractor/:id ~ Get Orders Qualification By Contractor`s Id
  getQualificationsContractorIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const qualifications =
        await RehabilitationService.getQualificationsContractorId(
          req.params.id,
          search,
          page,
          limit
        );

      res.status(200).json(qualifications);
    }
  );

  // ~ Put => /api/captal/orderQualification/status/:id ~ Update Qualification
  updateStatusQualification = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await RehabilitationService.updateStatusQualification(
        req.body,
        req.params.id
      );

      res.status(201).json({
        message: "تم تحديث الطلب بنجاح",
      });
    }
  );
}

export default new RehabilitationController();
