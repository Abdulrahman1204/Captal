import { Router } from "express";
import { notificationController } from "../../controllers/notification/Notification.controller";
import verifyToken from "../../middlewares/verifyToken";
import checkRole from "../../middlewares/checkRole";

const router: Router = Router();

// ~ POST => /api/univers/notifications ~ Create New Notification (Admin only)
router
  .route("/")
  .get(

    notificationController.getAllNotifications
  );

// ~ GET/PUT/DELETE => /api/univers/notifications/:id ~ Notification by ID operations
router
  .route("/:id")
  .delete(
    verifyToken,
    checkRole(["admin"]),
    notificationController.deleteNotification
  );

// ~ PUT => /api/univers/notifications/show ~ Show All Notifications (Admin only)
router
  .route("/show")
  .put(

    notificationController.showAllNotifications
  );

export default router;
