import "server-only";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { createWorker, PSM } from "tesseract.js";
import { uploadImage } from "@/lib/config/upload-cloudinary";
import { parseIdText } from "@/lib/auth/id-parser";

async function prepareForOcr(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 2000 })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toBuffer();
}

async function readText(buffer: Buffer): Promise<string> {
  const image = await prepareForOcr(buffer);
  const worker = await createWorker("eng");
  try {
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });
    const { data } = await worker.recognize(image);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export async function extractIdFields(buffer: Buffer) {
  const [rawText, uploaded] = await Promise.all([
    readText(buffer),
    uploadImage(buffer, "id-uploads", randomUUID()).catch((e) => {
      console.error("Cloudinary upload failed", e);
      return null;
    }),
  ]);

  // temporary: remove after testing, it prints personal data
  if (process.env.NODE_ENV !== "production") {
    // console.log("---- OCR RAW ----\n" + rawText + "\n---- END ----");
  }

  const { fields, confidence } = parseIdText(rawText);

  return {
    fields,
    confidence,
    imageUrl: uploaded?.secureUrl ?? null,
    cloudinaryPublicId: uploaded?.publicId ?? null,
  };
}
