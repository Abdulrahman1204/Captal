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
  role: "admin" | "contractor" | "recourse" | "intering";

  // معلومات المورد
  supplierNumber?: string;
  supplierName?: string;
  entityType?: "company" | "person"; // فرد / شركة
  legalEntity?: string;
  commercialRegistrationNumber?: string;
  taxNumber?: string;
  registrationDate?: Date;
  resourceStatus?: Date;
  typeOfTransaction?: "cash" | "deferred";
  exemptionOption?: string;
  internationalResource?: boolean;
  freezeTheAccount?: boolean;
  currency?: string;
  bankAccountNumber?: string;
  bankName?: string;
  taxDiscountRate?: number;
  paymentTerms?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;

  // العنوان
  address1?: string;
  address2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;

  // الهوية
  identityNumber?: string;
  nationality?: string;
  issuingAuthority?: string;

  // الاتصالات
  mobile1?: string;
  mobile2?: string;
  mobile3?: string;
  fax?: string;
  emailOfficial?: string;

  // المسؤول
  supplierRepresentative?: string;

  // إضافات
  contact1?: string;
  contact2?: string;
  classification1?: string;
  classification2?: string;
  location?: string;
  notes?: string;
  attachments?: {
    publicId: string;
    url: string;
  }[];
}

// Otp Interface
export interface IOtp extends Document {
  otp: string;
}
