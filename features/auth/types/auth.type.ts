export type Role = "RESIDENT" | "STAFF" | "ADMIN";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
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

export interface UploadedPhoto {
  imageUrl: string;
  cloudinaryPublicId: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  idImageUrl: string;
  idCloudinaryPublicId?: string;
  idNumber?: string;
  rawOcrText: string;
  ocrConfidence: number;
  profileImageUrl?: string;
  profileImageCloudinaryPublicId?: string;
}

export type MeResponse = {
  success: boolean;
  user: AuthUser;
};
