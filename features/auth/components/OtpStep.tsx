"use client";

import { useState } from "react";

interface OtpStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  resendIn: number;
  resending: boolean;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export function OtpStep({
  email,
  loading,
  error,
  resendIn,
  resending,
  onSubmit,
  onResend,
  onBack,
}: OtpStepProps) {
  const [code, setCode] = useState("");
  const ready = code.length === 6;

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready && !loading) onSubmit(code);
      }}
    >
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
          Verification code
        </label>
        <p className="mt-1 mb-3 text-[13px] leading-relaxed text-slate-500">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-slate-700">{email}</span>. It expires in 10 minutes.
        </p>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          aria-invalid={!!error}
          aria-describedby={error ? "otp-error" : undefined}
          placeholder="••••••"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl font-medium tracking-[0.5em] text-[#0F172A] placeholder:text-slate-300 focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30 aria-[invalid=true]:border-red-500"
        />
        {error && (
          <p id="otp-error" role="alert" className="mt-2 text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!ready || loading}
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150"
      >
        {loading ? "Creating account..." : "Verify and create account"}
      </button>

      <div className="flex items-center justify-between text-[13px]">
        <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 transition-colors">
          ← Change details
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resendIn > 0 || resending}
          className="font-semibold text-[#B8860B] hover:underline disabled:text-slate-400 disabled:no-underline"
        >
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
