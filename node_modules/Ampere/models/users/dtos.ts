import { Document, Types } from "mongoose";

// User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  DateOfCompany: Date;
  expiresAt: Date;
  otp: string;
  role: "admin" | "contractor" | "recourse";
} 

// Otp Interface
export interface IOtp extends Document {
  otp: string;
}