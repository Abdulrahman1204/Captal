import mongoose, { Schema, Model } from "mongoose";

// Minimal Visit schema - store only timestamps (pageviews)
const VisitSchema = new Schema({}, { timestamps: true });

VisitSchema.index({ createdAt: -1 });

const Visit: Model<any> = mongoose.model("Visit", VisitSchema);

export { Visit };
