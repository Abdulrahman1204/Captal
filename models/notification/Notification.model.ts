import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { INotification } from "./dtos";

// Notification Schema
const NotificationSchema = new Schema<INotification>(
  {
    text: {
      type: String,
      required: [true, "نص الإشعار مطلوب"],
      trim: true,
      maxlength: [1000, "نص الإشعار يجب ألا يتجاوز 1000 حرف"],
    },
  },
  {
    timestamps: true,
  }
);

// Notification Model
const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

// Notification Indexes
NotificationSchema.index({ createdAt: -1 });

// Validation: Create Notification
const validateCreateNotification = (obj: INotification): joi.ValidationResult => {
  const schema = joi.object({
    text: joi.string().max(1000).required().messages({
      "string.empty": "نص الإشعار مطلوب",
      "string.max": "نص الإشعار يجب ألا يتجاوز 1000 حرف",
      "any.required": "نص الإشعار مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Notification
const validateUpdateNotification = (
  obj: Partial<INotification>
): joi.ValidationResult => {
  const schema = joi.object({
    text: joi.string().max(1000).messages({
      "string.empty": "نص الإشعار مطلوب",
      "string.max": "نص الإشعار يجب ألا يتجاوز 1000 حرف",
    }),
  });

  return schema.validate(obj);
};

export {
  Notification,
  validateCreateNotification,
  validateUpdateNotification,
};