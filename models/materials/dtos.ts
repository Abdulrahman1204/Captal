import { Document, Types } from "mongoose";

// Material Interface
export interface IMaterial extends Document {
  materialName: string;
  serialNumber: string;
  classification: Types.ObjectId;
  classificationSon: Types.ObjectId;
  attachedFile: {
    publicId: string | null;
    url: string;
  };
}
