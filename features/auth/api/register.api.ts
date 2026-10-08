import { http } from "@/lib/http/client";
import type {
  ExtractedIdFields,
  ExtractIdResponse,
  InitiateRegistrationResponse,
  RegisterResidentPayload,
  UploadedPhoto,
  VerifyRegistrationPayload,
} from "@/features/residents/types/resident.types";

const fileForm = (field: string, file: File) => {
  const form = new FormData();
  form.append(field, file);
  return form;
};

type Raw = Record<string, unknown>;

function pick(source: Raw, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function toDateInput(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const match = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!match) return null;

  const [, a, b, year] = match;
  const first = Number(a);
  const second = Number(b);
  if (first > 12 && second <= 12)
    return `${year}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
  if (second > 12 && first <= 12)
    return `${year}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`;
  return null;
}

const NAME_LABELS =
  /(gitnang\s*apelyido|middle\s*names?|apelyido|last\s*names?|surname|mga\s*pangalan|given\s*names?|first\s*names?)/gi;

const letterCount = (text: string) => (text.match(/\p{L}/gu) ?? []).length;

function cleanName(value: string | null): string | null {
  if (!value) return null;
  const text = value
    .replace(NAME_LABELS, " ")
    .replace(/^[\s/:|.,-]+/, "")
    .trim();
  if (/[^\p{L}\p{M}\s'.,-]/u.test(text)) return null;

  const tokens = text.split(/\s+/).filter(Boolean);
  const words = tokens.filter((token) => letterCount(token) >= 2);
  if (tokens.length === 0 || words.length / tokens.length < 0.6) return null;

  const cleaned = words
    .join(" ")
    .replace(/,+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return letterCount(cleaned) >= 3 ? cleaned : null;
}

function normalizeFields(raw: unknown): ExtractedIdFields {
  const f = (raw ?? {}) as Raw;
  return {
    firstName: cleanName(pick(f, "firstName", "first_name")),
    lastName: cleanName(pick(f, "lastName", "last_name")),
    middleName: cleanName(pick(f, "middleName", "middle_name")),
    address: pick(f, "address"),
    dateOfBirth: toDateInput(
      pick(f, "dateOfBirth", "date_of_birth", "dob", "birthDate"),
    ),
    idNumber: pick(f, "idNumber", "id_number"),
  };
}

export const residentsApi = {
  extractId: async (file: File): Promise<ExtractIdResponse> => {
    const raw = await http.postForm<Raw>(
      "/residents/id-scan/extract",
      fileForm("idFile", file),
    );
    const normalized = {
      imageUrl: String(raw.imageUrl ?? raw.image_url ?? ""),
      cloudinaryPublicId: (raw.cloudinaryPublicId ??
        raw.cloudinary_public_id ??
        null) as string | null,
      rawText: String(raw.rawText ?? raw.raw_text ?? ""),
      confidence: Number(raw.confidence ?? raw.ocrConfidence ?? 0),
      fields: normalizeFields(raw.fields),
    };
    return normalized;
  },
  uploadPhoto: (file: File) =>
    http.postForm<UploadedPhoto>(
      "/residents/photo",
      fileForm("photoFile", file),
    ),
  register: (payload: RegisterResidentPayload) =>
    http.post<InitiateRegistrationResponse>("/residents/register", payload),
  verifyRegistration: (payload: VerifyRegistrationPayload) =>
    http.post<{ email: string; residentId: number }>(
      "/residents/register/verify",
      payload,
    ),
  resendOtp: (email: string) =>
    http.post<InitiateRegistrationResponse>("/residents/register/resend", {
      email,
    }),
};
