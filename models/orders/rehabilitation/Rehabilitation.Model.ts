import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IQualification } from "../dtos";

// Qualification Schema
const QualificationSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "الاسم الأول مطلوب"],
      trim: true,
      maxlength: [100, "الاسم الأول يجب ألا يتجاوز 100 حرف"],
    },
    lastName: {
      type: String,
      required: [true, "الاسم العائلة مطلوب"],
      trim: true,
      maxlength: [100, "الاسم العائلة يجب ألا يتجاوز 100 حرف"],
    },
    phone: {
      type: String,
      required: [true, "رقم الهاتف مطلوب"],
      trim: true,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: (props) =>
          `${props.value} ليس رقم هاتف صالح! يجب أن يتكون من 10 أرقام`,
      },
    },
    email: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    dateOfCompany: {
      type: Date,
      trim: true,
    },
    lastYearRevenue: {
      type: String,
      trim: true,
    },
    requiredAmount: {
      type: String,
      trim: true,
    },
    attachedFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
    statusOrder: {
      type: String,
      enum: {
        values: [
          "accepted",
          "an invoice has been issued",
          "shipped",
          "delivered",
          "pending",
          "not accepted",
        ],
        message: "يجب أن يكون احد الحالات المتوفرة",
      },
      default: "pending",
    },
    statusUser: {
      type: String,
      enum: {
        values: ["visited", "eligible"],
        message: "يجب أن يكون احد الحالات المتوفرة",
      },
      default: "visited",
    },
    description: {
      type: String,
      trim: true,
      default: "Write Notes",
    },
  },
  {
    timestamps: true,
  }
);

// Qualification Model
const Qualification: Model<IQualification> = mongoose.model<IQualification>(
  "Qualification",
  QualificationSchema
);

// Qualification Indexes
QualificationSchema.index({ createdAt: -1 });

// Validation Create Qualification
const validaionCreateQualification = (
  obj: IQualification
): joi.ValidationResult => {
  const schema = joi.object({
    firstName: joi.string().trim().required().max(100).messages({
      "string.empty": "الاسم لا يمكن أن يكون فارغ",
      "string.max": "الاسم يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم مطلوب",
    }),
    lastName: joi.string().trim().required().messages({
      "string.empty": "الاسم العائلة لا يمكن أن يكون فارغ",
      "string.max": "الاسم العائلة يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم العائلة مطلوب",
    }),
    phone: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "رقم الهاتف لا يمكن أن يكون فارغاً",
        "string.pattern.base": "رقم الهاتف يجب أن يتكون من 10 أرقام فقط",
        "any.required": "رقم الهاتف مطلوب",
      }),
    email: joi.string().email().allow(""),
    companyName: joi.string().trim().allow(""),
    dateOfCompany: joi.date().allow(""),
    lastYearRevenue: joi.string().allow(""),
    requiredAmount: joi.string().allow(""),
    description: joi.string().optional(),
  });

  return schema.validate(obj);
};

// Validation Update Status
const validaionUpdateStatusQualification = (
  obj: IQualification
): joi.ValidationResult => {
  const schema = joi.object({
    statusOrder: joi
      .string()
      .trim()
      .valid(
        "accepted",
        "not accepted",
        "an invoice has been issued",
        "shipped",
        "delivered",
        "pending"
      )
      .required()
      .max(100)
      .messages({
        "string.empty": "الحالة لا يمكن أن تكون فارغة",
        "any.only": "الحالة ليست موجودة",
        "any.required": "الحالة مطلوبة",
      }),
  });

  return schema.validate(obj);
};

export {
  Qualification,
  validaionCreateQualification,
  validaionUpdateStatusQualification,
};
