import { Router } from "express";
import upload from "../../../middlewares/cloudinary";
import RehabilitationController from "../../../controllers/orders/rehabilitation/Rehabilitation.controller";
import checkRole from "../../../middlewares/checkRole";
import verifyToken from "../../../middlewares/verifyToken";

const router: Router = Router();

// ~ Post => /api/captal/orderQualification ~ Create New Order Qualification + // ~ Get => /api/captal/orderQualification ~ Get Orders Qualification all
router
  .route("")
  .post(upload, RehabilitationController.createQualificationOrderCtrl)
  .get(
    verifyToken,
    checkRole(["admin"]),
    RehabilitationController.getQualificationsCtrl
  );

// ~ Put => /api/captal/orderQualification/status/:id ~ Update Qualification
router
  .route("/status/:id")
  .patch(
    verifyToken,
    checkRole(["admin"]),
    RehabilitationController.updateStatusQualification
  );

// ~ Get => /api/captal/orderQualification/contractor/:id ~ Get Orders Qualification By Contractor`s Id +
router
  .route("/contractor/:id")
  .get(
    verifyToken,
    checkRole(["contractor"]),
    RehabilitationController.getQualificationsContractorIdCtrl
  );

export default router;
