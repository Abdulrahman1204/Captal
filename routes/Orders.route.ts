import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import checkRole from "../middlewares/checkRole";
import OrdersController from "../controllers/orders/Orders.controller";

const router: Router = Router();

router
  .route("/")
  .get(verifyToken, checkRole(["admin"]), OrdersController.getTheCountOfOrder);

router.route("/chart/weekly").get(OrdersController.getWeeklyOrdersChart);

router
  .route("/chart/visits")
  .get(OrdersController.getVisitsChart);

export default router;
