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
    expiresAt: { type: Date },
    otp: { type: String, length: 6 },
    role: {
      type: String,
      enum: {
        values: ["admin", "contractor", "recourse", "intering"],
        message: "الدور يجب أن يكون أحد: admin, contractor, recourse, intering",
      },
    },

    // معلومات المورد
    supplierNumber: { type: String, trim: true },
    supplierName: { type: String, trim: true },
    entityType: {
      type: String,
      enum: ["company", "person"],
      trim: true,
      required: false,
    },
    legalEntity: { type: String, trim: true },
    commercialRegistrationNumber: { type: String, trim: true },
    taxNumber: { type: String, trim: true },
    registrationDate: { type: Date },
    resourceStatus: { type: String },
    typeOfTransaction: { type: Date },
    exemptionOption: { type: String, trim: true },
    internationalResource: { type: Boolean },
    freezeTheAccount: { type: Boolean },
    currency: { type: String, trim: true },
    bankAccountNumber: { type: String, trim: true },
    bankName: { type: String, trim: true },
    taxDiscountRate: { type: Number },
    paymentTerms: { type: String, trim: true },
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },

    // العنوان
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true },
    region: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
    countryCode: { type: String, trim: true },

    // الهوية
    identityNumber: { type: String, trim: true },
    nationality: { type: String, trim: true },
    issuingAuthority: { type: String, trim: true },

    // الاتصالات
    mobile1: { type: String, trim: true },
    mobile2: { type: String, trim: true },
    mobile3: { type: String, trim: true },
    fax: { type: String, trim: true },
    emailOfficial: { type: String, trim: true },

    // المسؤول
    supplierRepresentative: { type: String, trim: true },

    // إضافات
    contact1: { type: String, trim: true },
    contact2: { type: String, trim: true },
    classification1: { type: String, trim: true },
    classification2: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    attachments: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

// User Model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

// User Indexes
UserSchema.index({ createdAt: -1 });

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
    email: joi.string().trim().min(3).max(100).required().email().messages({
      "string.empty": "البريد الإلكتروني لا يمكن أن يكون فارغاً",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "string.email": "البريد الإلكتروني يجب أن يكون صالحاً",
      "any.required": "البريد الإلكتروني مطلوب",
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
    role: joi
      .string()
      .valid("admin", "contractor", "recourse", "intering")
      .required()
      .messages({
        "string.empty": "الدور لا يمكن أن يكون فارغاً",
        "any.only":
          "الدور يجب أن يكون أحد: admin, contractor, recourse, intering",
        "any.required": "الدور مطلوب",
      }),
    // Optional fields with appropriate validation
    supplierNumber: joi.string().trim().allow(""),
    supplierName: joi.string().trim().allow(""),
    entityType: joi.string().valid("company", "person").trim().allow("", null),
    legalEntity: joi.string().trim().allow(""),
    commercialRegistrationNumber: joi.string().trim().allow(""),
    taxNumber: joi.string().trim().allow(""),
    registrationDate: joi.date().allow(null),
    resourceStatus: joi.string().allow(null),
    typeOfTransaction: joi.date().allow(null),
    exemptionOption: joi.string().trim().allow(""),
    internationalResource: joi.boolean(),
    freezeTheAccount: joi.boolean(),
    currency: joi.string().trim().allow(""),
    bankAccountNumber: joi.string().trim().allow(""),
    bankName: joi.string().trim().allow(""),
    taxDiscountRate: joi.number().allow(null),
    paymentTerms: joi.string().trim().allow(""),
    contractStartDate: joi.date().allow(null),
    contractEndDate: joi.date().allow(null),
    address1: joi.string().trim().allow(""),
    address2: joi.string().trim().allow(""),
    city: joi.string().trim().allow(""),
    region: joi.string().trim().allow(""),
    postalCode: joi.string().trim().allow(""),
    country: joi.string().trim().allow(""),
    countryCode: joi.string().trim().allow(""),
    identityNumber: joi.string().trim().allow(""),
    nationality: joi.string().trim().allow(""),
    issuingAuthority: joi.string().trim().allow(""),
    mobile1: joi.string().trim().allow(""),
    mobile2: joi.string().trim().allow(""),
    mobile3: joi.string().trim().allow(""),
    fax: joi.string().trim().allow(""),
    emailOfficial: joi.string().trim().email().allow("").messages({
      "string.email": "البريد الإلكتروني الرسمي يجب أن يكون صالحاً",
    }),
    supplierRepresentative: joi.string().trim().allow(""),
    contact1: joi.string().trim().allow(""),
    contact2: joi.string().trim().allow(""),
    classification1: joi.string().trim().allow(""),
    classification2: joi.string().trim().allow(""),
    location: joi.string().trim().allow(""),
    notes: joi.string().trim().allow(""),
    attachments: joi.array().items(joi.object()),
  });
  return schema.validate(obj, { abortEarly: false });
};

// Validation Check Otp
const validationOtp = (obj: IOtp): joi.ValidationResult => {
  const schema = joi.object({
    otp: joi.string().length(6).required().messages({
      "string.empty": "رمز التحقق لا يمكن أن يكون فارغاً",
      "string.length": "رمز التحقق يجب أن يتكون من 6 أرقام",
      "any.required": "رمز التحقق مطلوب",
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
  });
  return schema.validate(obj, { abortEarly: false });
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
  return schema.validate(obj, { abortEarly: false });
};

// Validation Update User
const validationUpdateUser = (obj: IUser): joi.ValidationResult => {
  const schema = joi.object({
    firstName: joi.string().trim().max(100).messages({
      "string.empty": "الاسم الأول لا يمكن أن يكون فارغاً",
      "string.max": "الاسم الأول يجب ألا يتجاوز 100 حرف",
    }),
    lastName: joi.string().trim().max(100).messages({
      "string.empty": "الاسم الأخير لا يمكن أن يكون فارغاً",
      "string.max": "الاسم الأخير يجب ألا يتجاوز 100 حرف",
    }),
    phone: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.empty": "رقم الهاتف لا يمكن أن يكون فارغاً",
        "string.pattern.base": "رقم الهاتف يجب أن يتكون من 10 أرقام فقط",
      }),
    email: joi.string().trim().min(3).max(100).email().messages({
      "string.empty": "البريد الإلكتروني لا يمكن أن يكون فارغاً",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "string.email": "البريد الإلكتروني يجب أن يكون صالحاً",
    }),
    companyName: joi.string().trim().max(100).messages({
      "string.empty": "اسم الشركة لا يمكن أن يكون فارغاً",
      "string.max": "اسم الشركة يجب ألا يتجاوز 100 حرف",
    }),
    DateOfCompany: joi.date().messages({
      "date.base": "تاريخ الشركة يجب أن يكون تاريخاً صالحاً",
    }),
    role: joi
      .string()
      .valid("admin", "contractor", "recourse", "intering")
      .messages({
        "string.empty": "الدور لا يمكن أن يكون فارغاً",
        "any.only":
          "الدور يجب أن يكون أحد: admin, contractor, recourse, intering",
      }),
    // All other fields with optional validation
    supplierNumber: joi.string().trim().allow(""),
    supplierName: joi.string().trim().allow(""),
    entityType: joi.string().valid("company", "person").trim().allow("", null),
    legalEntity: joi.string().trim().allow(""),
    commercialRegistrationNumber: joi.string().trim().allow(""),
    taxNumber: joi.string().trim().allow(""),
    registrationDate: joi.date().allow(null),
    resourceStatus: joi.string().allow(null),
    typeOfTransaction: joi.date().allow(null),
    exemptionOption: joi.string().trim().allow(""),
    internationalResource: joi.boolean(),
    freezeTheAccount: joi.boolean(),
    currency: joi.string().trim().allow(""),
    bankAccountNumber: joi.string().trim().allow(""),
    bankName: joi.string().trim().allow(""),
    taxDiscountRate: joi.number().allow(null),
    paymentTerms: joi.string().trim().allow(""),
    contractStartDate: joi.date().allow(null),
    contractEndDate: joi.date().allow(null),
    address1: joi.string().trim().allow(""),
    address2: joi.string().trim().allow(""),
    city: joi.string().trim().allow(""),
    region: joi.string().trim().allow(""),
    postalCode: joi.string().trim().allow(""),
    country: joi.string().trim().allow(""),
    countryCode: joi.string().trim().allow(""),
    identityNumber: joi.string().trim().allow(""),
    nationality: joi.string().trim().allow(""),
    issuingAuthority: joi.string().trim().allow(""),
    mobile1: joi.string().trim().allow(""),
    mobile2: joi.string().trim().allow(""),
    mobile3: joi.string().trim().allow(""),
    fax: joi.string().trim().allow(""),
    emailOfficial: joi.string().trim().email().allow("").messages({
      "string.email": "البريد الإلكتروني الرسمي يجب أن يكون صالحاً",
    }),
    supplierRepresentative: joi.string().trim().allow(""),
    contact1: joi.string().trim().allow(""),
    contact2: joi.string().trim().allow(""),
    classification1: joi.string().trim().allow(""),
    classification2: joi.string().trim().allow(""),
    location: joi.string().trim().allow(""),
    notes: joi.string().trim().allow(""),
    attachments: joi.array().items(joi.object()),
  });
  return schema.validate(obj, { abortEarly: false });
};

export {
  User,
  validationCreateUser,
  validationSendOtp,
  validationUpdateUser,
  validationOtp,
};
