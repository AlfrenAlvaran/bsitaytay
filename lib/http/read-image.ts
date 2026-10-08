import "server-only";
import sharp from "sharp";
import { ApiError } from "@/utils/api-error";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const TOO_LARGE = "File is too large (max 10MB).";
const UNSUPPORTED = "Unsupported file type. Upload a JPG, PNG, or WEBP.";

export async function readImage(req: Request, field: string) {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES + 100_000) throw ApiError.payloadTooLarge(TOO_LARGE);

  const form = await req.formData().catch(() => null);
  const file = form?.get(field);

  if (!(file instanceof File)) throw ApiError.badRequest(`Missing '${field}' file.`);
  if (!ALLOWED_MIME.has(file.type)) throw ApiError.unsupportedMedia(UNSUPPORTED);
  if (file.size > MAX_BYTES) throw ApiError.payloadTooLarge(TOO_LARGE);

  const buffer = Buffer.from(await file.arrayBuffer());

  // file.type comes from the client, so check the real bytes
  const meta = await sharp(buffer).metadata().catch(() => null);
  if (!meta?.format || !ALLOWED_FORMATS.has(meta.format)) {
    throw ApiError.unsupportedMedia(UNSUPPORTED);
  }

  return { buffer, mimeType: file.type };
}