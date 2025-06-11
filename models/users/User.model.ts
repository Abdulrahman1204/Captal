import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IOtp, IUser } from "./dtos";

// User Schema
const UserSchema = new Schema(
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
      required: [true, "البريد الإلكتروني مطلوب"],
      trim: true,
      minlength: [3, "البريد الإلكتروني يجب أن يكون على الأقل حرفين"],
      maxlength: [100, "البريد الإلكتروني يجب ألا يتجاوز 100 حرف"],
    },
    companyName: {
      type: String,
      required: [true, "اسم الشركة مطلوب"],
      trim: true,
      maxlength: [100, "اسم الشركة يجب ألا يتجاوز 100 حرف"],
    },
    DateOfCompany: {
      type: Date,
      required: [true, "تاريخ تأسيس الشركة مطلوب"],
    },
    otp: {
      type: String,
      length: 6,
    },
    expiresAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "contractor", "recourse"],
        message: "الدور يجب أن يكون أحد: admin, contractor, recourse",
      },
    },
  },
  {
    timestamps: true,
  }
);

// User Model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

// User Indexes
UserSchema.index({ createdAt: -1 })

// Validation Create User
const validationCreateUser = (obj: IUser): joi.ValidationResult => {
  const schema = joi.object({
    firstName: joi.string().trim().max(100).required().messages({
      "string.empty": "الاسم الأول لا يمكن أن يكون فارغاً",
      "string.max": "الاسم الأول يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم الأول مطلوب",
    }),
    lastName: joi.string().trim().max(100).required().messages({
      "string.empty": "الاسم العائلة لا يمكن أن يكون فارغاً",
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
    companyName: joi.string().trim().max(100).required().messages({
      "string.empty": "اسم الشركة لا يمكن أن يكون فارغاً",
      "string.max": "اسم الشركة يجب ألا يتجاوز 100 حرف",
      "any.required": "اسم الشركة مطلوب",
    }),
    DateOfCompany: joi.date().required().messages({
      "date.base": "تاريخ الشركة يجب أن يكون تاريخاً صالحاً",
      "any.required": "تاريخ تأسيس الشركة مطلوب",
    }),
    email: joi.string().trim().min(3).max(100).required().email().messages({
      "string.empty": "البريد الإلكتروني لا يمكن أن يكون فارغاً",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "string.email": "البريد الإلكتروني يجب أن يكون صالحاً",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
    role: joi
      .string()
      .valid("contractor", "recourse", "admin")
      .required()
      .messages({
        "string.empty": "الدور لا يمكن أن يكون فارغاً",
        "any.only": "الدور يجب أن يكون أحد: contractor, recourse, admin",
        "any.required": "الدور مطلوب",
      }),
  });
  return schema.validate(obj);
};

// Validation Check Otp
const validationOtp = (obj: IOtp): joi.ValidationResult => {
  const schema = joi.object({
    otp: joi
      .string()
      .required()
      .messages({
        "string.empty": "لا يمكن أن يكون فارغاً",
        "any.required": "مطلوب",
      }),
  });
  return schema.validate(obj);
};

// Validation send otp
const validationSendOtp = (obj: IUser): joi.ValidationResult => {
  const schema = joi.object({
    phone: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "رقم الهاتف لا يمكن أن يكون فارغاً",
        "string.pattern.base": "رقم الهاتف يجب أن يتكون من 10 أرقام فقط",
        "any.required": "رقم الهاتف مطلوب",
      }),
  });
  return schema.validate(obj);
};

// Validation Update User
const validationUpdateUser = (obj: IUser): joi.ValidationResult => {
  const schema = joi.object({
    firstName: joi.string().trim().max(100).messages({
      "string.empty": "الاسم الأول لا يمكن أن يكون فارغاً",
      "string.min": "الاسم الأول يجب أن يكون على الأقل 3 أحرف",
      "string.max": "الاسم الأول يجب ألا يتجاوز 100 حرف",
    }),
    lastName: joi.string().trim().max(100).messages({
      "string.empty": "الاسم الأخير لا يمكن أن يكون فارغاً",
      "string.min": "الاسم الأخير يجب أن يكون على الأقل 3 أحرف",
      "string.max": "الاسم الأخير يجب ألا يتجاوز 100 حرف",
    }),
    phone: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.empty": "رقم الهاتف لا يمكن أن يكون فارغاً",
        "string.pattern.base": "رقم الهاتف يجب أن يتكون من 10 أرقام فقط",
      }),
    companyName: joi.string().trim().max(100).messages({
      "string.empty": "اسم الشركة لا يمكن أن يكون فارغاً",
      "string.min": "اسم الشركة يجب أن يكون على الأقل 3 أحرف",
      "string.max": "اسم الشركة يجب ألا يتجاوز 100 حرف",
    }),
    DateOfCompany: joi.date().messages({
      "date.base": "تاريخ الشركة يجب أن يكون تاريخاً صالحاً",
    }),
    email: joi.string().trim().min(3).max(100).email().messages({
      "string.empty": "البريد الإلكتروني لا يمكن أن يكون فارغاً",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "string.email": "البريد الإلكتروني يجب أن يكون صالحاً",
    }),
    role: joi.string().valid("contractor", "recourse", "admin").messages({
      "string.empty": "الدور لا يمكن أن يكون فارغاً",
      "any.only": "الدور يجب أن يكون أحد: contractor, recourse, admin",
    }),
  });
  return schema.validate(obj);
};

export { User, validationCreateUser, validationSendOtp, validationUpdateUser, validationOtp };
