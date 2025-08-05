import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IMaterial } from "./dtos";

// Material Schema
const MaterialSchema = new Schema(
  {
    materialName: {
      type: String,
      required: [true, "الاسم المادة مطلوب"],
      trim: true,
      maxlength: [100, "الاسم المادة يجب ألا يتجاوز 100 حرف"],
    },
    serialNumber: {
      type: String,
      required: [true, "الرقم التسلسلي مطلوب"],
      trim: true,
      maxlength: [100, "الرقم التسلسلي يجب ألا يتجاوز 100 حرف"],
    },
    classification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassFather",
      required: true,
    },
    attachedFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Material Model
const Material: Model<IMaterial> = mongoose.model<IMaterial>(
  "Material",
  MaterialSchema
);

// Material Indexes
MaterialSchema.index({ createdAt: -1 });

// Validation Create Material
const validationCreateMaterial = (obj: IMaterial): joi.ValidationResult => {
  const schema = joi.object({
    materialName: joi.string().trim().required().messages({
      "string.empty": "المادة لا يمكن أن نكون فارغة",
      "string.max": "المادة يجب ألا تتجاوز 100 حرف",
      "any.required": "المادة مطلوبة",
    }),
    serialNumber: joi.string().trim().max(100).required().messages({
      "string.empty": "الرقم التسلسلي لا يمكن أن يكون فارغاً",
      "string.max": "الرقم التسلسلي يجب ألا يتجاوز 100 حرف",
      "any.required": "الرقم التسلسلي مطلوب",
    }),
    classification: joi.string().trim().required().messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation Update Material
const validationUpdateMaterial = (obj: IMaterial): joi.ValidationResult => {
  const schema = joi.object({
    materialName: joi.string().trim().messages({
      "string.empty": "المادة لا يمكن أن نكون فارغة",
      "string.max": "المادة يجب ألا تتجاوز 100 حرف",
      "any.required": "المادة مطلوبة",
    }),
    serialNumber: joi.string().trim().max(100).messages({
      "string.empty": "الرقم التسلسلي لا يمكن أن يكون فارغاً",
      "string.max": "الرقم التسلسلي يجب ألا يتجاوز 100 حرف",
      "any.required": "الرقم التسلسلي مطلوب",
    }),
    classification: joi.string().trim().messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
  });

  return schema.validate(obj);
};

export { Material, validationCreateMaterial, validationUpdateMaterial };
