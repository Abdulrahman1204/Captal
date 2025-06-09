import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { FinanceService } from "../../../services/orders/finance/Finance.service";
import { ICloudinaryFile } from "../../../utils/types";

class FinanceController {
  // ~ Post => /api/captal/orderFinance ~ Create New Order Finance
  createFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await FinanceService.createFinance(req.body, req.file as ICloudinaryFile);

      res.status(201).json({
        message: "تم إضافة الطلب بنجاح",
      });
    }
  );

  // ~ Get > /api/captal/orderFinance ~ Get Orders Finance All
  getFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const Finances = await FinanceService.getFinances();

      res.status(200).json(Finances);
    }
  );

  // ~ Get > /api/captal/orderFinance/contractor/:id ~ Get Orders Finance By Contractor`s Id
  getFinanceContractorIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const Finances = await FinanceService.getFinanceContractorId(
        req.params.id
      );

      res.status(200).json(Finances);
    }
  );

  // ~ Put > /api/captal/orderFinance/status/:id ~ Update Status Of Finance Order
  updateStatusFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await FinanceService.updateStatusFinance(req.body, req.params.id);

      res.status(201).json({
        message: "تم تحديث الطلب بنجاح",
      });
    }
  );
}

export default new FinanceController();
