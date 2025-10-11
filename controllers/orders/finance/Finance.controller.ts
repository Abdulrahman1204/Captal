import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { FinanceService } from "../../../services/orders/finance/Finance.service";
import { ICloudinaryFile } from "../../../utils/types";

class FinanceController {
  // ~ Post => /api/captal/orderFinance ~ Create New Order Finance
  createFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const token = req.headers.authorization?.split(" ")[1];

      await FinanceService.createFinance(req.body, req.file as ICloudinaryFile, token);

      console.log(token);

      res.status(201).json({
        message: "تم إضافة الطلب بنجاح",
      });
    }
  );

  // ~ Get > /api/captal/orderFinance ~ Get Orders Finance All
  getFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const Finances = await FinanceService.getFinances(
        status,
        search,
        page,
        limit
      );

      res.status(200).json(Finances);
    }
  );

  // ~ Get > /api/captal/orderFinance/contractor/:id ~ Get Orders Finance By Contractor`s Id
  getFinanceContractorIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const search = req.query.search as string;
      const status = req.query.status as string;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const Finances = await FinanceService.getFinanceContractorId(
        req.params.id,
        status,
        search,
        page,
        limit
      );

      res.status(200).json(Finances);
    }
  );

  // ~ Get > /api/captal/orderFinance/:id ~ Get Single Finance By Id
  getFinanceByIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const finance = await FinanceService.getFinanceById(req.params.id);

      res.status(200).json(finance);
    }
  );

  // ~ Put > /api/captal/orderFinance/status/:id ~ Update Status Of Finance Order
  updateStatusFinanceCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await FinanceService.updateStatusFinance(req.body, req.params.id);

      console.log(req.body);

      res.status(201).json({
        message: "تم تحديث الطلب بنجاح",
      });
    }
  );
}

export default new FinanceController();
