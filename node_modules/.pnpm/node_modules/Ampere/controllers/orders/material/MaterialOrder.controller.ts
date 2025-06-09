import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { MaterialOrderService } from "../../../services/orders/material/Material.service";
import { ICloudinaryFile } from "../../../utils/types";

class MaterialOrderController {
  // ~ Post => /api/captal/orderMaterial ~ Create New Order Material
  createMaterialOrderCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await MaterialOrderService.createMaterialOrder(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json({
        message: "تم إضافة الطلب بنجاح",
      });
    }
  );

  // ~ Get => /api/captal/orderMaterial ~ Get Orders Material all
  getMaterialsCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const materialOrders = await MaterialOrderService.getMaterials();

      res.status(200).json(materialOrders);
    }
  );

  // ~ Get => /api/captal/orderMaterial/contractor/:id ~ Get Orders Material By Contractor`s Id
  getMaterialContractorIdCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const materialOrders = await MaterialOrderService.getMaterialContractorId(
        req.params.id
      );

      res.status(200).json(materialOrders);
    }
  );

  // ~ Put => /api/captal/orderMaterial/status/:id ~ Update Status Of Material Order
  updateStatusMaterialCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await MaterialOrderService.updateStatusMaterial(req.body, req.params.id);

      res.status(201).json({
        message: "تم تحديث الطلب بنجاح",
      });
    }
  );
}

export default new MaterialOrderController();
