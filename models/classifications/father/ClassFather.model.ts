import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IClassFather } from "../dtos";

// Classification Father Schema
const ClassFatherSchema = new Schema(
  {
    fatherName: {
      type: String,
      required: [true, "التصنيف الرئيسي مطلوب"],
      trim: true,
      maxlength: [100, "التصنيف الرئيسي يجب ألا يتجاوز 100 حرف"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  }
);

// Show SonName
ClassFatherSchema.virtual("sonNames", {
  ref: "ClassSon",
  foreignField: "fatherName",
  localField: "_id",
});

// Show Materials
ClassFatherSchema.virtual("materialss", {
  ref: "Matrials", 
  foreignField: "classification",
  localField: "_id",
});

// Classification Father Indexes
ClassFatherSchema.index({ createdAt: -1 });

// Classification Father Model
const ClassFather: Model<IClassFather> = mongoose.model<IClassFather>(
  "ClassFather",
  ClassFatherSchema
);

// Validation Create Classification Father
const validationCreateClassFather = (
  obj: IClassFather
): joi.ValidationResult => {
  const schema = joi.object({
    fatherName: joi.string().trim().max(100).required().messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "string.max": "التصنيف الرئيسي يجب ألا يتجاوز 100 حرف",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation Update Classification Father
const validationUpdateClassFather = (
  obj: IClassFather
): joi.ValidationResult => {
  const schema = joi.object({
    fatherName: joi.string().trim().max(100).messages({
      "string.empty": "التصنيف الرئيسي لا يمكن أن يكون فارغاً",
      "string.max": "التصنيف الرئيسي يجب ألا يتجاوز 100 حرف",
      "any.required": "التصنيف الرئيسي مطلوب",
    }),
  });

  return schema.validate(obj);
};

export {
  ClassFather,
  validationCreateClassFather,
  validationUpdateClassFather,
};
