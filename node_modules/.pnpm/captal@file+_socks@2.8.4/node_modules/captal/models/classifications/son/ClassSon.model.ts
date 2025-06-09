import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IClassSon } from "../dtos";

// Classification Son Schema
const ClassSonSchema = new Schema(
  {
    fatherName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassFather",
    },
    sonName: {
      type: String,
      required: [true, "التصنيف الفرعي مطلوب"],
      trim: true,
      maxlength: [100, "التصنيف الفرعي يجب ألا يتجاوز 100 حرف"],
    },
  },
  {
    timestamps: true,
  }
);

// Classification Son Model
const ClassSon: Model<IClassSon> = mongoose.model<IClassSon>(
  "ClassSon",
  ClassSonSchema
);

// Classification Son Indexes
ClassSonSchema.index({ createdAt: -1 })

// Validation Create Classification Son
const validationCreateClassSon = (obj: IClassSon): joi.ValidationResult => {
  const schema = joi.object({
    fatherName: joi.string().trim().required().messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
    sonName: joi.string().trim().max(100).required().messages({
      "string.empty": "التصنيف الفرعي لا يمكن أن يكون فارغاً",
      "string.max": "التصنيف الفرعي يجب ألا يتجاوز 100 حرف",
      "any.required": "التصنيف الفرعي مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation Update Classification Son
const validationUpdateClassSon = (obj: IClassSon): joi.ValidationResult => {
  const schema = joi.object({
    fatherName: joi.string().trim().messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
    sonName: joi.string().trim().max(100).messages({
      "string.empty": "التصنيف الفرعي لا يمكن أن يكون فارغاً",
      "string.max": "التصنيف الفرعي يجب ألا يتجاوز 100 حرف",
      "any.required": "التصنيف الفرعي مطلوب",
    }),
  });

  return schema.validate(obj);
};

export { ClassSon, validationCreateClassSon, validationUpdateClassSon };
