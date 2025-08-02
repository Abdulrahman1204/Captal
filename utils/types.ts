import { Request } from "express";

export interface JWTPayload {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface CloudinaryFile {
  originalname: string;
}

export interface CloudinaryFiles {
  public_id?: string;
  secure_url?: string;
  filename?: string;
  path?: string;
  originalname?: string;
}
export interface ICloudinaryFile extends Express.Multer.File {
  secure_url: string;
  public_id: string;
}

export interface Address {
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  country?: string;
  postcode?: string;
  [key: string]: any; // For any other properties that might exist
}

export interface ReverseGeocodeResponse {
  address: Address;
  display_name: string;
  [key: string]: any; // For any other properties that might exist
}

export interface FormattedAddress {
  fullAddress: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
