import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { MaterialService } from "../../services/materials/Material.service";
import { ICloudinaryFile } from "../../utils/types";

class MaterialController {
  // ~ Post => /api/captal/material ~ Create New Material
  createNewMaterialCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await MaterialService.createNewMaterial(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json({
        message: "تم إضافة المادة بنجاح",
      });
    }
  );

  // ~ PUT => /api/captal/material/:id ~ Update Material
  updateMaterialCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await MaterialService.updateMaterial(
        req.body,
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json({
        message: "تم تحديث المادة بنجاح",
      });
    }
  );

  // ~ DELETE => /api/captal/material/:id ~ Delete Material
  deleteMaterialCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await MaterialService.deleteMaterial(req.params.id);

      res.status(200).json({
        message: "تم حذف المادة بنجاح",
      });
    }
  );

  // ~ GET => /api/captal/material ~ Get Material
  getMaterialsCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const materials = await MaterialService.getMaterials();

      res.status(200).json(materials);
    }
  );
}

export default new MaterialController();
