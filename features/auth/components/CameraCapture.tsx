import React, { useEffect, useRef, useState } from "react";

export function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (
      typeof window === "undefined" ||
      !window.isSecureContext ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError(
        "Camera access requires a secure (HTTPS) connection. Please choose a file instead.",
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() =>
        setError(
          "Couldn't access your camera. Please allow camera permission or choose a file instead.",
        ),
      );

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const handleShoot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // mirror the image so the saved photo matches what the user sees in the preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onCapture(
          new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" }),
        );
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Take a selfie"
    >
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-sm">
        <div className="relative bg-black aspect-square">
          {error ? (
            <div
              className="w-full h-full flex items-center justify-center p-6 text-center text-white text-sm"
              role="alert"
            >
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform-[scaleX(-1)]"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-500 hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
          {!error && (
            <button
              type="button"
              onClick={handleShoot}
              className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors"
            >
              Capture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
