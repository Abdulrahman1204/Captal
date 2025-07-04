import { Router } from "express";
import upload from "../../../middlewares/cloudinary";
import MaterialOrderController from "../../../controllers/orders/material/MaterialOrder.controller";
import checkRole from "../../../middlewares/checkRole";
import verifyToken from "../../../middlewares/verifyToken";

const router: Router = Router();

// ~ Post => /api/captal/orderMaterial ~ Create New Order Material +   // ~ Get => /api/captal/orderMaterial ~ Get Orders Material all
router
  .route("")
  .post(upload, MaterialOrderController.createMaterialOrderCtrl)
  .get(
    verifyToken,
    checkRole(["admin"]),
    MaterialOrderController.getMaterialsCtrl
  );

// ~ Put => /api/captal/orderMaterial/status/:id ~ Update Status Of Material Order
router
  .route("/status/:id")
  .patch(
    verifyToken,
    checkRole(["admin"]),
    MaterialOrderController.updateStatusMaterialCtrl
  );

// ~ Get => /api/captal/orderMaterial/contractor/:id ~ Get Orders Material By Contractor`s Id +
router
  .route("/contractor/:id")
  .get(
    verifyToken,
    checkRole(["contractor"]),
    MaterialOrderController.getMaterialContractorIdCtrl
  );

export default router;
