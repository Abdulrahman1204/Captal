import { Router } from "express";
import upload from "../../../middlewares/cloudinary";
import FinanceController from "../../../controllers/orders/finance/Finance.controller";
import checkRole from "../../../middlewares/checkRole";
import verifyToken from "../../../middlewares/verifyToken";

const router: Router = Router();

// ~ Post => /api/captal/orderFinance ~ Create New Order Finance + // ~ Get > /api/captal/orderFinance ~ Get Orders Finance All
router
  .route("")
  .post(upload, FinanceController.createFinanceCtrl)
  .get(verifyToken, checkRole(["admin"]), FinanceController.getFinanceCtrl);

// ~ Put > /api/captal/orderFinance/status/:id ~ Update Status Of Finance Order
router
  .route("/status/:id")
  .put(
    verifyToken,
    checkRole(["admin"]),
    FinanceController.updateStatusFinanceCtrl
  );

// ~ Get > /api/captal/orderFinance/contractor/:id ~ Get Orders Finance By Contractor`s Id
router
  .route("/contractor/:id")
  .get(
    verifyToken,
    checkRole(["contractor"]),
    FinanceController.getFinanceContractorIdCtrl
  );

export default router;
