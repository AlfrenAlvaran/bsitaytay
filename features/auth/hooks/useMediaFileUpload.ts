import { verifyFileSignature } from "../schema/file.schema";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ZodSchema } from "zod";

export interface MediaFileUpload {
  file: File | null;
  previewUrl: string | null;
  error: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  select: (candidate: File | null) => Promise<void>;
  remove: () => void;
}

export function useMediaFileUpload(
  schema: ZodSchema<File>,
  invalidSignatureMessage: string,
): MediaFileUpload {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const select = useCallback(
    async (candidate: File | null) => {
      if (!candidate) return;

      const result = schema.safeParse(candidate);
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "That file isn't valid");
        return;
      }

      // Belt-and-suspenders: don't trust the reported MIME type, read the
      // file's actual header bytes before accepting it.
      const signatureOk = await verifyFileSignature(candidate);
      if (!signatureOk) {
        setError(invalidSignatureMessage);
        return;
      }

      setError("");
      setFile(candidate);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return candidate.type.startsWith("image/")
          ? URL.createObjectURL(candidate)
          : null;
      });
    },
    [schema, invalidSignatureMessage],
  );

  const remove = useCallback(() => {
    setFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return { file, previewUrl, error, inputRef, select, remove };
}
