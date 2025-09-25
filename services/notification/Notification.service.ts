import mongoose from "mongoose";
import { INotification } from "../../models/notification/dtos";
import {
  Notification,
  validateCreateNotification,
} from "../../models/notification/Notification.model";
import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";

class NotificationService {
  // ~ Post => /api/univers/notifications ~ Create New Notification
  static async createNotification(text: string) {
    const notification = await Notification.create({text});

    return {
      message: "تم إنشاء الإشعار بنجاح",
      notification,
    };
  }

  // ~ Get => /api/univers/notifications/:id ~ Get Notification by ID
  static async getNotificationById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الإشعار غير صالح");
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      throw new NotFoundError("الإشعار غير موجود");
    }

    return notification;
  }

  // ~ Get => /api/univers/notifications ~ Get All Notifications
  static async getAllNotifications() {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    return {
      notifications,
    };
  }

  // ~ Delete => /api/univers/notifications/:id ~ Delete Notification
  static async deleteNotification(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الإشعار غير صالح");
    }

    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      throw new NotFoundError("الإشعار غير موجود");
    }

    return { message: "تم حذف الإشعار بنجاح" };
  }
}

export { NotificationService };
