import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { NotificationService } from "../../services/notification/Notification.service";

class NotificationController {
  // ~ GET => /api/univers/notifications ~ Get All Notifications
  getAllNotifications = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const result = await NotificationService.getAllNotifications();
      res.status(200).json(result);
    }
  );

  // ~ DELETE => /api/univers/notifications/:id ~ Delete Notification
  deleteNotification = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await NotificationService.deleteNotification(
        req.params.id
      );
      res.status(200).json(result);
    }
  );
}

export const notificationController = new NotificationController();
