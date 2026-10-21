

import { removeBackground } from "@imgly/background-removal";

const MAX_SIDE = 1024; // downscale large camera photos so processing is fast
const OUTPUT_QUALITY = 0.92;
const BACKGROUND_COLOR = "#FFFFFF";

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      type,
      quality,
    );
  });
}

/** Shrinks the image so its longest side is at most MAX_SIDE. */
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file); // honours EXIF orientation
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));

  if (scale === 1) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvasToBlob(canvas, "image/png");
}

export async function replaceBackgroundWithWhite(file: File): Promise<File> {
  // 1. Shrink, then cut the person out (transparent PNG)
  const source = await downscale(file);
  const cutout = await removeBackground(source, {
    output: { format: "image/png" },
  });
  const bitmap = await createImageBitmap(cutout);

  // 2. Paint white, then draw the cutout on top
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas 2D context unavailable");
  }
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // 3. Export as JPEG (no transparency needed, smaller upload)
  const blob = await canvasToBlob(canvas, "image/jpeg", OUTPUT_QUALITY);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "profile";
  return new File([blob], `${baseName}-white-bg.jpg`, { type: "image/jpeg" });
}