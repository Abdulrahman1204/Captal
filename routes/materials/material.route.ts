import { Router } from "express";
import MaterialController from "../../controllers/materials/Material.controller";
import upload from "../../middlewares/cloudinary";
import verifyToken from "../../middlewares/verifyToken";
import checkRole from "../../middlewares/checkRole";

const router: Router = Router();

// ~ Post => /api/captal/material ~ Create New Material + // ~ GET => /api/captal/material ~ Get Material
router
  .route("")
  .post(
    verifyToken,
    checkRole(["admin"]),
    upload,
    MaterialController.createNewMaterialCtrl
  )
  .get(MaterialController.getMaterialsCtrl);

// ~ PUT => /api/captal/material/:id ~ Update Material + // ~ DELETE => /api/captal/material/:id ~ Delete Material
router
  .route("/:id")
  .put(
    verifyToken,
    checkRole(["admin"]),
    upload,
    MaterialController.updateMaterialCtrl
  )
  .delete(
    verifyToken,
    checkRole(["admin"]),
    MaterialController.deleteMaterialCtrl
  );

export default router;
