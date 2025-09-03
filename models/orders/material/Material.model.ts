import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IMaterial } from "../dtos";

// Material Schema
const MaterialSchema = new Schema(
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
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Matrials",
      },
    ],
    projectName: {
      type: String,
      trim: true,
    },
    noteForQuantity: {
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// Material Model
const MaterialOrder: Model<IMaterial> = mongoose.model<IMaterial>(
  "MaterialOrder",
  MaterialSchema
);

// Material Order Indexes
MaterialSchema.index({ createdAt: -1 });

// Validation Create Material
const validationCreateMaterialOrder = (
  obj: IMaterial
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
    email: joi.string().trim().email().allow(""),
    companyName: joi.string().trim().allow(""),
    dateOfCompany: joi.string().trim().allow(""),
    materials: joi.array().items(joi.string().trim()),
    projectName: joi.string().trim().allow(""),
    noteForQuantity: joi.string().trim().allow(""),
    description: joi.string().trim().allow(""),
  });

  return schema.validate(obj);
};

// Validation Update Status
const validaionUpdateStatusMaterial = (
  obj: IMaterial
): joi.ValidationResult => {
  const schema = joi.object({
    statusOrder: joi
      .string()
      .trim()
      .valid(
        "accepted",
        "an invoice has been issued",
        "shipped",
        "delivered",
        "pending",
        "not accepted"
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
  MaterialOrder,
  validationCreateMaterialOrder,
  validaionUpdateStatusMaterial,
};
