import { Router } from "express";
import upload from "../../../middlewares/cloudinary";
import RecourseController from "../../../controllers/orders/recourse/Recourse.controller";
import checkRole from "../../../middlewares/checkRole";
import verifyToken from "../../../middlewares/verifyToken";

const router: Router = Router();

// ~ Post => /api/captal/recourseUserOrder ~ Create New Order Recourse +   // ~ Get => /api/captal/recourseUserOrder ~ Get Orders Recourse all
router
  .route("")
  .post(
    verifyToken,
    checkRole(["admin", "intering"]),
    upload,
    RecourseController.createRecourseOrderCtrl
  )
  .get(
    verifyToken,
    checkRole(["recourse", "admin"]),
    RecourseController.getRecourseCtrl
  );

// ~ Put => /api/captal/recourseUserOrder/:id/status ~ Update Order Recourse
router
  .route("/:id/status")
  .patch(
    verifyToken,
    checkRole(["recourse", "admin"]),
    RecourseController.updateStatusRecourseCtrl
  );

// ~ Put => /api/captal/recourseUserOrder/bill/:id ~ Update Attached File
router
  .route("/bill/:id")
  .put(
    verifyToken,
    checkRole(["admin"]),
    upload,
    RecourseController.updateAttachedFileCtrl
  );

// ~ Get => /api/captal/recourseUserOrder/:id ~ Get Orders Recourse By Recourse`s Id
// router.route("/:id").get(RecourseController.getRecourseByRecourseIdCtrl);

export default router;
