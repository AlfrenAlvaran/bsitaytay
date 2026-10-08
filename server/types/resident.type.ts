import type { ParsedIdFields } from "@/lib/auth/id-parser";

export interface ExtractIdResult {
  fields: ParsedIdFields;
  confidence: number;
  rawText: string;
  imageUrl: string | null;
  cloudinaryPublicId: string | null;
}

export interface UploadPhotoResult {
  imageUrl: string;
  cloudinaryPublicId: string;
}

export interface InitiateRegistrationResult {
  email: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}

export interface ExtractedIdFields {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  address: string | null;
  dateOfBirth: string | null;
  idNumber: string | null;
}

export interface ExtractIdResponse {
  imageUrl: string;
  cloudinaryPublicId: string | null;
  rawText: string;
  confidence: number;
  fields: ExtractedIdFields;
}

export type UploadedPhoto = UploadPhotoResult;

export type InitiateRegistrationResponse = InitiateRegistrationResult;

export interface RegisterResidentPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  document: {
    imageUrl: string;
    cloudinaryPublicId?: string;
    idNumber?: string;
    rawOcrText?: string;
    ocrConfidence?: number;
  };
  profileImage?: {
    imageUrl: string;
    cloudinaryPublicId?: string;
  };
}

export interface VerifyRegistrationPayload {
  email: string;
  otp: string;
}