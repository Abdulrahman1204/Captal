import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IRecourse } from "../dtos";
import { getAddressFromCoords } from "../../../utils/location";

// Recourse Schema
const RecourseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recourseName: {
      type: String,
      required: true,
    },
    recoursePhone: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    dateOfproject: {
      type: Date,
      default: Date.now,
    },
    attachedFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
    billFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Matrials",
        default: null,
      },
    ],
    paymentCheck: {
      type: String,
      enum: ["cash", "delayed"],
    },
    advance: {
      type: String,
      required: true,
    },
    uponDelivry: {
      type: String,
      required: true,
    },
    afterDelivry: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    statusOrder: {
      type: String,
      enum: [
        "accepted",
        "an invoice has been issued",
        "shipped",
        "delivered",
        "pending",
        "not accepted",
      ],
      default: "pending",
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

// Recourse Order Model
const RecourseOrder: Model<IRecourse> = mongoose.model<IRecourse>(
  "RecourseOrder",
  RecourseSchema
);

// Create index for geospatial search
RecourseSchema.index({ location: "2dsphere", createdAt: -1 });

// Middleware to automatically calculate address before saving
RecourseSchema.pre<IRecourse>("save", async function (next) {
  if (
    this.isModified("location") &&
    this.location.coordinates[0] !== 0 &&
    this.location.coordinates[1] !== 0
  ) {
    try {
      const [longitude, latitude] = this.location.coordinates;
      const address = await getAddressFromCoords(latitude, longitude);

      if (address) {
        if (address.street) this.street = address.street;
        if (address.country) {
          this.country = address.country;
          this.countryName = address.country;
        }
        if (address.fullAddress) this.postAddress = address.fullAddress;
      }
    } catch (error) {
      console.error("Error setting address from coordinates:", error);
    }
  }
  next();
});

// Validation Create Recourse
const validationCreateRecourseOrder = (
  obj: IRecourse
): joi.ValidationResult => {
  const schema = joi.object({
    userId: joi.string(),
    recourseName: joi.string().required(),
    recoursePhone: joi.string().required(),
    clientName: joi.string().required(),
    clientPhone: joi.string().required(),
    serialNumber: joi.number().required(),
    projectName: joi.string().required(),
    dateOfproject: joi.date(),
    attachedFile: joi.object({
      publicId: joi.string(),
      url: joi.string(),
    }),
    materials: joi
      .array()
      .items(joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional(),
    paymentCheck: joi.string().valid("cash", "delayed"),
    advance: joi.string().required(),
    uponDelivry: joi.string().required(),
    afterDelivry: joi.string().required(),
    countryName: joi.string().required(),
    location: joi
      .object({
        type: joi.string().valid("Point").default("Point"),
        coordinates: joi.array().items(joi.number()).length(2).required(),
      })
      .optional(),
  });

  return schema.validate(obj);
};

// Validation Update Status
const validaionUpdateStatusRecourse = (
  obj: IRecourse
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


const validationUpdateAttachedFile = (
  obj: Partial<IRecourse>
): joi.ValidationResult => {
  const schema = joi.object({
    attachedFile: joi.object({
      publicId: joi.string().allow(null, ""),
      url: joi.string().uri().allow("")
    }).optional()
  });

  return schema.validate(obj);
};

export {
  RecourseOrder,
  validaionUpdateStatusRecourse,
  validationCreateRecourseOrder,
  validationUpdateAttachedFile
};
