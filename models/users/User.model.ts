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
      trim: true,
      maxlength: [100, "اسم الشركة يجب ألا يتجاوز 100 حرف"],
    },
    DateOfCompany: {
      type: Date,
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
    supplierNumber: {
      type: String,
      message: "رقم المورد يجب أن يكون بين 5-20 حرف/رقم",
    },
    supplierName: {
      type: String,
      maxlength: [100, "اسم المورد لا يجب أن يتجاوز 100 حرف"],
    },
    entityType: {
      type: String,
      enum: {
        values: ["company", "person"],
        message: "نوع الكيان يجب أن يكون: company أو person",
      },
    },
    legalEntity: {
      type: String,
      maxlength: [200, "الكيان القانوني لا يجب أن يتجاوز 200 حرف"],
    },
    commercialRegistrationNumber: {
      type: String,
      message: "رقم السجل التجاري يجب أن يتكون من 10 أرقام",
    },
    taxNumber: {
      type: String,
      message: "الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ بـ 3",
    },
    registrationDate: {
      type: Date,
      message: "تاريخ التسجيل لا يمكن أن يكون في المستقبل",
    },
    resourceStatus: {
      type: String,
      enum: {
        values: ["active", "suspended"],
        message: "حالة المورد يجب أن تكون: active, suspended",
      },
    },
    typeOfTransaction: {
      type: String,
      enum: {
        values: ["cash", "deferred"],
        message: "نوع التعامل يجب أن يكون: cash أو deferred",
      },
    },
    exemptionOption: {
      type: String,
      maxlength: [100, "خيار الإعفاء لا يجب أن يتجاوز 100 حرف"],
    },
    internationalResource: {
      type: Boolean,
      message: "مورد دولي يجب أن يكون true أو false",
    },
    freezeTheAccount: {
      type: Boolean,
      message: "تجميد الحساب يجب أن يكون true أو false",
    },
    currency: {
      type: String,
      default: "SAR",
    },
    bankAccountNumber: {
      type: String,
      message: "رقم الحساب البنكي يجب أن يكون بين 10-24 حرف/رقم",
    },
    bankName: {
      type: String,
      maxlength: [100, "اسم البنك لا يجب أن يتجاوز 100 حرف"],
    },
    taxDiscountRate: {
      type: Number,
      message: "نسبة الخصم الضريبي لا يمكن أن تكون أقل من 0",
    },
    paymentTerms: {
      type: String,
      maxlength: [500, "شروط الدفع لا يجب أن تتجاوز 500 حرف"],
    },
    contractStartDate: {
      type: Date,
      message: "تاريخ بدء العقد يجب أن يكون تاريخاً صالحاً",
    },
    contractEndDate: {
      type: Date,
      message: "تاريخ انتهاء العقد يجب أن يكون بعد تاريخ البدء",
    },
    address1: {
      type: String,
      maxlength: [200, "العنوان الأول لا يجب أن يتجاوز 200 حرف"],
    },
    address2: {
      type: String,
      maxlength: [200, "العنوان الثاني لا يجب أن يتجاوز 200 حرف"],
    },
    city: {
      type: String,
      maxlength: [50, "المدينة لا يجب أن تتجاوز 50 حرف"],
    },
    region: {
      type: String,
      maxlength: [50, "المنطقة لا يجب أن تتجاوز 50 حرف"],
    },
    postalCode: {
      type: String,
      message: "الرمز البريدي يجب أن يتكون من 5 أرقام",
    },
    country: {
      type: String,
      maxlength: [50, "البلد لا يجب أن يتجاوز 50 حرف"],
    },
    countryCode: {
      type: String,
      maxlength: [5, "رمز البلد لا يجب أن يتجاوز 5 أحرف"],
    },
    identityNumber: {
      type: String,
      message: "رقم الهوية يجب أن يتكون من 10 أرقام",
    },
    nationality: {
      type: String,
      maxlength: [50, "الجنسية لا يجب أن تتجاوز 50 حرف"],
    },
    issuingAuthority: {
      type: String,
      maxlength: [100, "جهة الإصدار لا يجب أن تتجاوز 100 حرف"],
    },
    mobile1: {
      type: String,
      message: "رقم الجوال 1 يجب أن يكون رقم سعودي صحيح",
    },
    mobile2: {
      type: String,
      message: "رقم الجوال 2 يجب أن يكون رقم سعودي صحيح",
    },
    mobile3: {
      type: String,
      message: "رقم الجوال 3 يجب أن يكون رقم سعودي صحيح",
    },
    fax: {
      type: String,
      message: "رقم الفاكس يجب أن يكون رقم صحيح",
    },
    emailOfficial: {
      type: String,
      message: "البريد الإلكتروني الرسمي يجب أن يكون صالحاً",
    },
    supplierRepresentative: {
      type: String,
      maxlength: [100, "ممثل المورد لا يجب أن يتجاوز 100 حرف"],
    },
    contact1: {
      type: String,
      maxlength: [100, "الاتصال 1 لا يجب أن يتجاوز 100 حرف"],
    },
    contact2: {
      type: String,
      maxlength: [100, "الاتصال 2 لا يجب أن يتجاوز 100 حرف"],
    },
    classification1: {
      type: String,
      maxlength: [100, "التصنيف 1 لا يجب أن يتجاوز 100 حرف"],
    },
    classification2: {
      type: String,
      maxlength: [100, "التصنيف 2 لا يجب أن يتجاوز 100 حرف"],
    },
    location: {
      type: String,
      maxlength: [200, "الموقع لا يجب أن يتجاوز 200 حرف"],
    },
    notes: {
      type: String,
      maxlength: [1000, "الملاحظات لا يجب أن تتجاوز 1000 حرف"],
    },
    attachments: {
      type: [Object],
      message: "المرفقات يجب أن تكون مصفوفة من الكائنات",
    },
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
    companyName: joi.string().trim().max(100).allow("").messages({
      "string.empty": "اسم الشركة لا يمكن أن يكون فارغاً",
      "string.max": "اسم الشركة يجب ألا يتجاوز 100 حرف",
      "any.required": "اسم الشركة مطلوب",
    }),
    DateOfCompany: joi.date().allow(null).messages({
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
    supplierNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم المورد يجب أن يكون بين 5-20 حرف/رقم",
    }),
    supplierName: joi.string().trim().max(100).allow("").messages({
      "string.max": "اسم المورد لا يجب أن يتجاوز 100 حرف",
    }),
    entityType: joi
      .string()
      .valid("company", "person")
      .allow("", null)
      .messages({
        "any.only": "نوع الكيان يجب أن يكون company أو person",
      }),
    legalEntity: joi.string().trim().max(200).allow("").messages({
      "string.max": "الكيان القانوني لا يجب أن يتجاوز 200 حرف",
    }),
    commercialRegistrationNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم السجل التجاري يجب أن يتكون من 10 أرقام",
    }),
    taxNumber: joi.string().trim().allow("").messages({
      "string.pattern.base":
        "الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ بـ 3",
    }),
    registrationDate: joi.date().allow(null).messages({
      "date.base": "تاريخ التسجيل يجب أن يكون تاريخاً صالحاً",
    }),
    resourceStatus: joi
      .string()
      .valid("active", "suspended")
      .allow("")
      .messages({
        "any.only": "حالة المورد يجب أن تكون: active, suspended",
      }),
    typeOfTransaction: joi
      .string()
      .valid("cash", "deferred")
      .allow("")
      .messages({
        "any.only": "نوع المعاملة يجب أن يكون: cash, deferred",
      }),
    exemptionOption: joi.string().trim().max(100).allow("").messages({
      "string.max": "خيار الإعفاء لا يجب أن يتجاوز 100 حرف",
    }),
    internationalResource: joi.boolean().messages({
      "boolean.base": "مورد دولي يجب أن يكون true أو false",
    }),
    freezeTheAccount: joi.boolean().messages({
      "boolean.base": "تجميد الحساب يجب أن يكون true أو false",
    }),
    currency: joi.string().default("SAR"),
    bankAccountNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الحساب البنكي يجب أن يكون بين 10-24 حرف/رقم",
    }),
    bankName: joi.string().trim().max(100).allow("").messages({
      "string.max": "اسم البنك لا يجب أن يتجاوز 100 حرف",
    }),
    taxDiscountRate: joi.number().min(0).allow(null).messages({
      "number.min": "نسبة الخصم الضريبي لا يمكن أن تكون أقل من 0",
    }),
    paymentTerms: joi.string().trim().max(500).allow("").messages({
      "string.max": "شروط الدفع لا يجب أن تتجاوز 500 حرف",
    }),
    contractStartDate: joi.date().allow(null).messages({
      "date.base": "تاريخ بدء العقد يجب أن يكون تاريخاً صالحاً",
    }),
    contractEndDate: joi.date().allow(null).messages({
      "date.base": "تاريخ انتهاء العقد يجب أن يكون تاريخاً صالحاً",
    }),
    address1: joi.string().trim().max(200).allow("").messages({
      "string.max": "العنوان الأول لا يجب أن يتجاوز 200 حرف",
    }),
    address2: joi.string().trim().max(200).allow("").messages({
      "string.max": "العنوان الثاني لا يجب أن يتجاوز 200 حرف",
    }),
    city: joi.string().trim().max(50).allow("").messages({
      "string.max": "المدينة لا يجب أن تتجاوز 50 حرف",
    }),
    region: joi.string().trim().max(50).allow("").messages({
      "string.max": "المنطقة لا يجب أن تتجاوز 50 حرف",
    }),
    postalCode: joi.string().trim().allow("").messages({
      "string.pattern.base": "الرمز البريدي يجب أن يتكون من 5 أرقام",
    }),
    country: joi.string().trim().max(50).allow("").messages({
      "string.max": "البلد لا يجب أن يتجاوز 50 حرف",
    }),
    countryCode: joi.string().trim().max(5).allow("").messages({
      "string.max": "رمز البلد لا يجب أن يتجاوز 5 أحرف",
    }),
    identityNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الهوية يجب أن يتكون من 10 أرقام",
    }),
    nationality: joi.string().trim().max(50).allow("").messages({
      "string.max": "الجنسية لا يجب أن تتجاوز 50 حرف",
    }),
    issuingAuthority: joi.string().trim().max(100).allow("").messages({
      "string.max": "جهة الإصدار لا يجب أن تتجاوز 100 حرف",
    }),
    mobile1: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 1 يجب أن يكون رقم سعودي صحيح",
    }),
    mobile2: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 2 يجب أن يكون رقم سعودي صحيح",
    }),
    mobile3: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 3 يجب أن يكون رقم سعودي صحيح",
    }),
    fax: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الفاكس يجب أن يكون رقم صحيح",
    }),
    emailOfficial: joi.string().trim().email().allow("").messages({
      "string.email": "البريد الإلكتروني الرسمي يجب أن يكون صالحاً",
    }),
    supplierRepresentative: joi.string().trim().max(100).allow("").messages({
      "string.max": "ممثل المورد لا يجب أن يتجاوز 100 حرف",
    }),
    contact1: joi.string().trim().max(100).allow("").messages({
      "string.max": "الاتصال 1 لا يجب أن يتجاوز 100 حرف",
    }),
    contact2: joi.string().trim().max(100).allow("").messages({
      "string.max": "الاتصال 2 لا يجب أن يتجاوز 100 حرف",
    }),
    classification1: joi.string().trim().max(100).allow("").messages({
      "string.max": "التصنيف 1 لا يجب أن يتجاوز 100 حرف",
    }),
    classification2: joi.string().trim().max(100).allow("").messages({
      "string.max": "التصنيف 2 لا يجب أن يتجاوز 100 حرف",
    }),
    location: joi.string().trim().max(200).allow("").messages({
      "string.max": "الموقع لا يجب أن يتجاوز 200 حرف",
    }),
    notes: joi.string().trim().max(1000).allow("").messages({
      "string.max": "الملاحظات لا يجب أن تتجاوز 1000 حرف",
    }),
    attachments: joi.array().items(joi.object()).messages({
      "array.base": "المرفقات يجب أن تكون مصفوفة من الكائنات",
    }),
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
    companyName: joi.string().trim().max(100).allow("").messages({
      "string.empty": "اسم الشركة لا يمكن أن يكون فارغاً",
      "string.max": "اسم الشركة يجب ألا يتجاوز 100 حرف",
      "any.required": "اسم الشركة مطلوب",
    }),
    DateOfCompany: joi.date().allow(null).messages({
      "date.base": "تاريخ الشركة يجب أن يكون تاريخاً صالحاً",
      "any.required": "تاريخ تأسيس الشركة مطلوب",
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
    supplierNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم المورد يجب أن يكون بين 5-20 حرف/رقم",
    }),
    supplierName: joi.string().trim().max(100).allow("").messages({
      "string.max": "اسم المورد لا يجب أن يتجاوز 100 حرف",
    }),
    entityType: joi
      .string()
      .valid("company", "person")
      .allow("", null)
      .messages({
        "any.only": "نوع الكيان يجب أن يكون company أو person",
      }),
    legalEntity: joi.string().trim().max(200).allow("").messages({
      "string.max": "الكيان القانوني لا يجب أن يتجاوز 200 حرف",
    }),
    commercialRegistrationNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم السجل التجاري يجب أن يتكون من 10 أرقام",
    }),
    taxNumber: joi.string().trim().allow("").messages({
      "string.pattern.base":
        "الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ بـ 3",
    }),
    registrationDate: joi.date().allow(null).messages({
      "date.base": "تاريخ التسجيل يجب أن يكون تاريخاً صالحاً",
    }),
    resourceStatus: joi
      .string()
      .valid("active", "suspended")
      .allow("")
      .messages({
        "any.only": "حالة المورد يجب أن تكون: active, suspended",
      }),
    typeOfTransaction: joi
      .string()
      .valid("cash", "deferred")
      .allow("")
      .messages({
        "any.only": "نوع المعاملة يجب أن يكون: cash, deferred",
      }),
    exemptionOption: joi.string().trim().max(100).allow("").messages({
      "string.max": "خيار الإعفاء لا يجب أن يتجاوز 100 حرف",
    }),
    internationalResource: joi.boolean().messages({
      "boolean.base": "مورد دولي يجب أن يكون true أو false",
    }),
    freezeTheAccount: joi.boolean().messages({
      "boolean.base": "تجميد الحساب يجب أن يكون true أو false",
    }),
    currency: joi.string().default("SAR"),
    bankAccountNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الحساب البنكي يجب أن يكون بين 10-24 حرف/رقم",
    }),
    bankName: joi.string().trim().max(100).allow("").messages({
      "string.max": "اسم البنك لا يجب أن يتجاوز 100 حرف",
    }),
    taxDiscountRate: joi.number().min(0).allow(null).messages({
      "number.min": "نسبة الخصم الضريبي لا يمكن أن تكون أقل من 0",
    }),
    paymentTerms: joi.string().trim().max(500).allow("").messages({
      "string.max": "شروط الدفع لا يجب أن تتجاوز 500 حرف",
    }),
    contractStartDate: joi.date().allow(null).messages({
      "date.base": "تاريخ بدء العقد يجب أن يكون تاريخاً صالحاً",
    }),
    contractEndDate: joi.date().allow(null).messages({
      "date.base": "تاريخ انتهاء العقد يجب أن يكون تاريخاً صالحاً",
    }),
    address1: joi.string().trim().max(200).allow("").messages({
      "string.max": "العنوان الأول لا يجب أن يتجاوز 200 حرف",
    }),
    address2: joi.string().trim().max(200).allow("").messages({
      "string.max": "العنوان الثاني لا يجب أن يتجاوز 200 حرف",
    }),
    city: joi.string().trim().max(50).allow("").messages({
      "string.max": "المدينة لا يجب أن تتجاوز 50 حرف",
    }),
    region: joi.string().trim().max(50).allow("").messages({
      "string.max": "المنطقة لا يجب أن تتجاوز 50 حرف",
    }),
    postalCode: joi.string().trim().allow("").messages({
      "string.pattern.base": "الرمز البريدي يجب أن يتكون من 5 أرقام",
    }),
    country: joi.string().trim().max(50).allow("").messages({
      "string.max": "البلد لا يجب أن يتجاوز 50 حرف",
    }),
    countryCode: joi.string().trim().max(5).allow("").messages({
      "string.max": "رمز البلد لا يجب أن يتجاوز 5 أحرف",
    }),
    identityNumber: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الهوية يجب أن يتكون من 10 أرقام",
    }),
    nationality: joi.string().trim().max(50).allow("").messages({
      "string.max": "الجنسية لا يجب أن تتجاوز 50 حرف",
    }),
    issuingAuthority: joi.string().trim().max(100).allow("").messages({
      "string.max": "جهة الإصدار لا يجب أن تتجاوز 100 حرف",
    }),
    mobile1: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 1 يجب أن يكون رقم سعودي صحيح",
    }),
    mobile2: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 2 يجب أن يكون رقم سعودي صحيح",
    }),
    mobile3: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الجوال 3 يجب أن يكون رقم سعودي صحيح",
    }),
    fax: joi.string().trim().allow("").messages({
      "string.pattern.base": "رقم الفاكس يجب أن يكون رقم صحيح",
    }),
    emailOfficial: joi.string().trim().email().allow("").messages({
      "string.email": "البريد الإلكتروني الرسمي يجب أن يكون صالحاً",
    }),
    supplierRepresentative: joi.string().trim().max(100).allow("").messages({
      "string.max": "ممثل المورد لا يجب أن يتجاوز 100 حرف",
    }),
    contact1: joi.string().trim().max(100).allow("").messages({
      "string.max": "الاتصال 1 لا يجب أن يتجاوز 100 حرف",
    }),
    contact2: joi.string().trim().max(100).allow("").messages({
      "string.max": "الاتصال 2 لا يجب أن يتجاوز 100 حرف",
    }),
    classification1: joi.string().trim().max(100).allow("").messages({
      "string.max": "التصنيف 1 لا يجب أن يتجاوز 100 حرف",
    }),
    classification2: joi.string().trim().max(100).allow("").messages({
      "string.max": "التصنيف 2 لا يجب أن يتجاوز 100 حرف",
    }),
    location: joi.string().trim().max(200).allow("").messages({
      "string.max": "الموقع لا يجب أن يتجاوز 200 حرف",
    }),
    notes: joi.string().trim().max(1000).allow("").messages({
      "string.max": "الملاحظات لا يجب أن تتجاوز 1000 حرف",
    }),
    attachments: joi.array().items(joi.object()).messages({
      "array.base": "المرفقات يجب أن تكون مصفوفة من الكائنات",
    }),
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
