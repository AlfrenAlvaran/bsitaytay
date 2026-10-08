import { z } from "zod";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const ID_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export const SELFIE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function buildFileSchema(allowed: readonly string[], label: string) {
  return z
    .instanceof(File, { message: `${label} is required` })
    .refine((f) => f.size > 0, `${label} appears to be empty`)
    .refine(
      (f) => f.size <= MAX_FILE_BYTES,
      `${label} must be smaller than ${MAX_FILE_BYTES / (1024 * 1024)}MB`,
    )
    .refine((f) => allowed.includes(f.type), `${label} must be one of: ${allowed.join(", ")}`);
}

export const idFileSchema = buildFileSchema(ID_MIME_TYPES, "ID file");
export const selfieFileSchema = buildFileSchema(SELFIE_MIME_TYPES, "Selfie");

export async function verifyFileSignature(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  const startsWith = (bytes: number[], offset = 0) => bytes.every((b, i) => head[offset + i] === b);

  switch (file.type) {
    case "image/jpeg":
      return startsWith([0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp":
      return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8);
    case "application/pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46]);
    default:
      return false;
  }
}