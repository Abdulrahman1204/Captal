import { Router } from "express";
import AnalyticsController from "../../controllers/analytics/Analytics.controller";

const router = Router();

// Public: record anonymous visit
router.route("/visit").post(AnalyticsController.recordVisit);

// Admin: get weekly unique visitors
router.route("/unique-weekly").get(AnalyticsController.getWeeklyUniqueVisitors);

export default router;
