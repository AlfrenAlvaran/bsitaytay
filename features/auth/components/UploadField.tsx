import React from "react";
import { Camera, FileText, UploadCloud } from "lucide-react";
import type { MediaFileUpload } from "../hooks/useMediaFileUpload";
import {
  ID_MIME_TYPES,
  MAX_FILE_BYTES,
  SELFIE_MIME_TYPES,
  idFileSchema,
  selfieFileSchema,
  verifyFileSignature,
} from "../schema/file.schema";

const MAX_FILE_SIZE_MB = MAX_FILE_BYTES / (1024 * 1024);

type FileChecker = { safeParse: (value: unknown) => { success: boolean } };
type FileSelectedHandler = (file: File) => void | Promise<void>;

async function selectAndNotify(
  upload: MediaFileUpload,
  file: File | null,
  schema: FileChecker,
  onFileSelected?: FileSelectedHandler,
) {
  await upload.select(file);
  if (!file || !onFileSelected) return;
  if (!schema.safeParse(file).success) return;
  if (!(await verifyFileSignature(file))) return;
  await onFileSelected(file);
}

function FieldError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs font-medium mt-2" role="alert">
      {message}
    </p>
  );
}

function FilePreviewRow({
  file,
  previewUrl,
  previewAlt,
  roundedFull,
  onRemove,
}: {
  file: File;
  previewUrl: string | null;
  previewAlt: string;
  roundedFull?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg p-3">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={previewAlt}
          className={`w-14 h-14 object-cover border border-slate-200 ${roundedFull ? "rounded-full" : "rounded-lg"}`}
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400">
          <FileText className="w-6 h-6" aria-hidden="true" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
        <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-red-500 text-xs font-semibold transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

function UploadField({
  label,
  htmlFor,
  upload,
  previewAlt,
  roundedFull,
  emptyState,
  onRemoved,
}: {
  label: string;
  htmlFor: string;
  upload: MediaFileUpload;
  previewAlt: string;
  roundedFull?: boolean;
  emptyState: React.ReactNode;
  onRemoved?: () => void;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {upload.file ? (
        <FilePreviewRow
          file={upload.file}
          previewUrl={upload.previewUrl}
          previewAlt={previewAlt}
          roundedFull={roundedFull}
          onRemove={() => {
            upload.remove();
            onRemoved?.();
          }}
        />
      ) : (
        emptyState
      )}
      <FieldError message={upload.error} />
    </div>
  );
}

export function IdUploadField({
  upload,
  onFileSelected,
  onFileRemoved,
}: {
  upload: MediaFileUpload;
  onFileSelected?: FileSelectedHandler;
  onFileRemoved?: () => void;
}) {
  const pick = (file: File | null) => selectAndNotify(upload, file, idFileSchema, onFileSelected);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void pick(e.dataTransfer.files?.[0] ?? null);
  };

  return (
    <UploadField
      label="Valid ID (photo or document) showing your address"
      htmlFor="id-upload"
      upload={upload}
      previewAlt="ID preview"
      onRemoved={onFileRemoved}
      emptyState={
        <div
          id="id-upload"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => upload.inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") upload.inputRef.current?.click();
          }}
          className="mt-2 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-[#B8860B] rounded-lg py-7 px-4 cursor-pointer transition-colors text-slate-400 hover:text-[#B8860B]"
        >
          <UploadCloud className="w-7 h-7" aria-hidden="true" />
          <p className="text-sm font-medium">
            Drag & drop, or <span className="text-[#B8860B] underline">browse</span>
          </p>
          <p className="text-xs text-slate-400">JPG, PNG, WEBP, or PDF — up to {MAX_FILE_SIZE_MB}MB</p>
          <input
            ref={upload.inputRef}
            type="file"
            accept={ID_MIME_TYPES.join(",")}
            className="hidden"
            onChange={(e) => void pick(e.target.files?.[0] ?? null)}
          />
        </div>
      }
    />
  );
}

export function SelfieUploadField({
  upload,
  onTakePhoto,
  onFileSelected,
  onFileRemoved,
}: {
  upload: MediaFileUpload;
  onTakePhoto: () => void;
  onFileSelected?: FileSelectedHandler;
  onFileRemoved?: () => void;
}) {
  const pick = (file: File | null) => selectAndNotify(upload, file, selfieFileSchema, onFileSelected);

  return (
    <UploadField
      label="Take a selfie"
      htmlFor="selfie-upload"
      upload={upload}
      previewAlt="Selfie preview"
      roundedFull
      onRemoved={onFileRemoved}
      emptyState={
        <div
          id="selfie-upload"
          className="mt-2 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300 rounded-lg py-7 px-4 text-slate-400"
        >
          <Camera className="w-7 h-7" aria-hidden="true" />
          <p className="text-xs text-slate-400 text-center">JPG, PNG, or WEBP — up to {MAX_FILE_SIZE_MB}MB</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTakePhoto}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/5 transition-colors"
            >
              Take Photo
            </button>
            <button
              type="button"
              onClick={() => upload.inputRef.current?.click()}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-500 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
            >
              Choose File
            </button>
          </div>
          <input
            ref={upload.inputRef}
            type="file"
            accept={SELFIE_MIME_TYPES.join(",")}
            className="hidden"
            onChange={(e) => void pick(e.target.files?.[0] ?? null)}
          />
        </div>
      }
    />
  );
}

export { FieldError };