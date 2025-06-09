import { Document, Types } from "mongoose";

// Qualification Interface
export interface IQualification extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  dateOfCompany: Date;
  requiredAmount: string;
  lastYearRevenue: string;
  attachedFile: {
    publicId: string | null;
    url: string;
  };
  statusOrder:
    | "accepted"
    | "an invoice has been issued"
    | "shipped"
    | "delivered"
    | "pending"
    | "not accepted";
  statusUser: "visited" | "eligible";
  description: string;
}

// Material Interface
export interface IMaterial extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  dateOfCompany: Date;
  materials: Types.ObjectId[];
  projectName: string;
  noteForQuantity: string;
  attachedFile: {
    publicId: string | null;
    url: string;
  };
  statusOrder:
    | "accepted"
    | "an invoice has been issued"
    | "shipped"
    | "delivered"
    | "pending"
    | "not accepted";
  statusUser: "visited" | "eligible";
  description: string;
  userId: Types.ObjectId;
}

// Finance Interface
export interface IFinance extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  dateOfCompany: Date;
  projectName: string;
  lastYearRevenue: string;
  requiredAmount: string;
  attachedFile: {
    publicId: string | null;
    url: string;
  };
  statusOrder:
    | "accepted"
    | "an invoice has been issued"
    | "shipped"
    | "delivered"
    | "pending"
    | "not accepted";
  statusUser: "visited" | "eligible";
  description: string;
  userId: Types.ObjectId;
}

export interface IRecourse extends Document {
  userId: Types.ObjectId;
  recourseName: string;
  recoursePhone: string;
  clientName: string;
  clientPhone: string;
  serialNumber: number;
  projectName: string;
  dateOfproject: Date;
  attachedFile: {
    publicId: string | null;
    url: string;
  };
  billFile: {
    publicId: string | null;
    url: string;
  };
  materials: Types.ObjectId[];
  paymentCheck: "cash" | "delayed";
  advance: string;
  uponDelivry: string;
  afterDelivry: string;
  countryName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  statusOrder:
    | "accepted"
    | "an invoice has been issued"
    | "shipped"
    | "delivered"
    | "pending"
    | "not accepted";
  street?: string;
  postAddress?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}