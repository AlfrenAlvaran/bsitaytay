"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ID_RATIO = 1.586; // standard ID-1 card (85.6 x 54 mm)

type Props = {
  onCapture: (file: File) => void;
  onClose: () => void;
  onUploadInstead?: () => void;
};

export function IdScanner({ onCapture, onClose, onUploadInstead }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shot, setShot] = useState<{ file: File; url: string } | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setReady(false);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser doesn't support camera access.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      setReady(true);
    } catch {
      setError(
        "We couldn't open your camera. Allow camera access in your browser settings, or upload a photo instead.",
      );
    }
  }, []);

  useEffect(() => {
    void start();
    return stop;
  }, [start, stop]);

  useEffect(() => {
    return () => {
      if (shot) URL.revokeObjectURL(shot.url);
    };
  }, [shot]);

  const capture = () => {
    const video = videoRef.current;
    const box = boxRef.current;
    const frame = frameRef.current;
    if (!video || !box || !frame || !video.videoWidth) return;

    // Map the on-screen frame back to video pixels (video is object-cover)
    const b = box.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    const scale = Math.max(b.width / video.videoWidth, b.height / video.videoHeight);
    const offsetX = (video.videoWidth * scale - b.width) / 2;
    const offsetY = (video.videoHeight * scale - b.height) / 2;

    const sx = (f.left - b.left + offsetX) / scale;
    const sy = (f.top - b.top + offsetY) / scale;
    const sw = f.width / scale;
    const sh = f.height / scale;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas
      .getContext("2d")
      ?.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "id-scan.jpg", { type: "image/jpeg" });
        setShot({ file, url: URL.createObjectURL(blob) });
      },
      "image/jpeg",
      0.92,
    );
  };

  const corner = "absolute h-6 w-6 border-white";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <p className="text-sm font-semibold">Scan your ID</p>
        <span className="w-9" />
      </div>

      {/* Camera */}
      <div ref={boxRef} className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Frame: the huge shadow dims everything outside it */}
        <div
          ref={frameRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
          style={{
            width: "min(88%, 520px)",
            aspectRatio: `${ID_RATIO} / 1`,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
          }}
        >
          <span className={`${corner} -left-0.5 -top-0.5 rounded-tl-xl border-l-4 border-t-4`} />
          <span className={`${corner} -right-0.5 -top-0.5 rounded-tr-xl border-r-4 border-t-4`} />
          <span className={`${corner} -bottom-0.5 -left-0.5 rounded-bl-xl border-b-4 border-l-4`} />
          <span className={`${corner} -bottom-0.5 -right-0.5 rounded-br-xl border-b-4 border-r-4`} />
        </div>

        <p className="absolute inset-x-0 bottom-6 px-8 text-center text-[13px] text-white/80">
          Place your ID inside the frame. Keep it flat, well lit, and free of glare.
        </p>

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 px-8 text-center">
            <p className="text-sm text-white/80">{error}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold"
              >
                Try again
              </button>
              {onUploadInstead && (
                <button
                  type="button"
                  onClick={onUploadInstead}
                  className="rounded-lg bg-[#B8860B] px-4 py-2 text-sm font-semibold"
                >
                  Upload instead
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shutter */}
      <div className="flex items-center justify-center py-6">
        <button
          type="button"
          onClick={capture}
          disabled={!ready}
          aria-label="Capture"
          className="h-16 w-16 rounded-full border-4 border-white p-1 disabled:opacity-40"
        >
          <span className="block h-full w-full rounded-full bg-white active:scale-90 transition" />
        </button>
      </div>

      {/* Review */}
      {shot && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black">
          <div className="px-4 py-3 text-center text-sm font-semibold">
            Is your ID clear and readable?
          </div>
          <div className="flex flex-1 items-center justify-center px-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.url} alt="Captured ID" className="max-h-full w-full max-w-lg rounded-xl object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 py-6">
            <button
              type="button"
              onClick={() => setShot(null)}
              className="rounded-xl border border-white/30 py-3 text-sm font-semibold"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => {
                stop();
                onCapture(shot.file);
              }}
              className="rounded-xl bg-[#B8860B] py-3 text-sm font-semibold"
            >
              Use this photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}