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