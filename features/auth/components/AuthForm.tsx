"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "@/components/ui/CustomInput";
import { useAttemptThrottle } from "../hooks/useAttemptThrottle";
import { useMediaFileUpload } from "../hooks/useMediaFileUpload";
import {
  type ExtractIdResponse,
  type UploadedPhoto,
} from "@/features/residents/types/resident.types";
import { HttpError } from "@/lib/http/client";
import { idFileSchema, selfieFileSchema } from "../schema/file.schema";
import { authApi } from "../api/auth.api";
import {
  authFormSchema,
  type AuthFormValues,
  type AuthType,
} from "../schema/auth.schema";
import { safeRedirect } from "../utils/safe-redirect";
import { passwordStrength, StrengthMeter } from "./auth-ui";
import { CameraCapture } from "./CameraCapture";
import { IdScanner } from "./IdScanner";
import { FieldError, IdUploadField, SelfieUploadField } from "./UploadField";
import { OtpStep } from "./OtpStep";
import { residentsApi } from "../api/register.api";

interface AuthFormProps {
  type: AuthType;
  next?: string;
}

type OcrField =
  "firstName" | "lastName" | "middleName" | "address" | "dateOfBirth";

const RATE_LIMIT_MSG =
  "Too many attempts. Please wait a bit before trying again.";
const NETWORK_MSG =
  "Network error. Please check your connection and try again.";
const GENERIC_MSG = "Something went wrong. Please try again.";

const ROLE_DESTINATION: Record<string, string> = {
  admin: "/admin",
  staff: "/staff",
  resident: "/resident",
};

const unexpectedMessage = (err: unknown) =>
  err instanceof HttpError && err.status === 0 ? NETWORK_MSG : GENERIC_MSG;

// Expected 4xx responses (wrong password, bad OTP, duplicate email, ...) are
// handled in the UI, so don't log them. Next.js dev shows every console.error
// as an error overlay.
const logUnexpected = (label: string, err: unknown) => {
  if (err instanceof HttpError && err.status >= 400 && err.status < 500) return;
  console.error(label, err);
};

export default function AuthForm({ type, next }: AuthFormProps) {
  const router = useRouter();
  const isRegister = type === "register";

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showIdCamera, setShowIdCamera] = useState(false);
  const [showSelfieCamera, setShowSelfieCamera] = useState(false);
  const [idMode, setIdMode] = useState<"upload" | null>(null);
  const [idDoc, setIdDoc] = useState<ExtractIdResponse | null>(null);
  const [profileImage, setProfileImage] = useState<UploadedPhoto | null>(null);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [resending, setResending] = useState(false);

  const submitLockRef = useRef(false);
  const idRequestRef = useRef(0);
  const photoRequestRef = useRef(0);
  const throttle = useAttemptThrottle();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const idUpload = useMediaFileUpload(
    idFileSchema,
    "This file doesn't look like a valid JPG, PNG, WEBP, or PDF. Try re-exporting it.",
  );
  const selfieUpload = useMediaFileUpload(
    selfieFileSchema,
    "This image doesn't look like a valid JPG, PNG, or WEBP file.",
  );

  const { control, handleSubmit, watch, setValue, setError } =
    useForm<AuthFormValues>({
      resolver: zodResolver(
        authFormSchema(type) as never,
      ) as Resolver<AuthFormValues>,
      mode: "onBlur",
      defaultValues: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
        website: "",
      },
    });

  const fill = (name: OcrField, value: string | null) => {
    if (!value) return false;
    setValue(name, value, { shouldValidate: true });
    return true;
  };

  const runIdExtraction = async (file: File) => {
    const requestId = ++idRequestRef.current;
    setExtracting(true);
    setIdDoc(null);
    try {
      const result = await residentsApi.extractId(file);
      if (requestId !== idRequestRef.current) return;

      setIdDoc(result);
      const { fields, confidence } = result;
      const filled = [
        fill("firstName", fields.firstName),
        fill("lastName", fields.lastName),
        fill("middleName", fields.middleName),
        fill("address", fields.address),
        fill("dateOfBirth", fields.dateOfBirth),
      ].filter(Boolean).length;

      if (filled === 0) {
        toast.warning(
          "We couldn't read any details from that ID. Fill in the fields manually, or try a clearer, well-lit photo.",
        );
      } else if (confidence < 0.5) {
        toast.info(
          "We pulled some details from your ID — please double-check them.",
        );
      } else {
        toast.success(
          "Details filled in from your ID. Please review before continuing.",
        );
      }
    } catch (err) {
      logUnexpected("ID extraction failed:", err);
      if (requestId !== idRequestRef.current) return;
      toast.error(
        "Couldn't read that ID automatically. Please fill the fields in manually or try a clearer photo.",
      );
    } finally {
      if (requestId === idRequestRef.current) setExtracting(false);
    }
  };

  const runPhotoUpload = async (file: File) => {
    const requestId = ++photoRequestRef.current;
    setUploadingPhoto(true);
    setProfileImage(null);
    try {
      const uploaded = await residentsApi.uploadPhoto(file);
      if (requestId === photoRequestRef.current) setProfileImage(uploaded);
    } catch (err) {
      logUnexpected("Photo upload failed:", err);
      if (requestId === photoRequestRef.current) {
        toast.error("Couldn't upload that photo. You can try again.");
      }
    } finally {
      if (requestId === photoRequestRef.current) setUploadingPhoto(false);
    }
  };

  async function guarded(values: AuthFormValues, action: () => Promise<void>) {
    if (values.website) return;
    if (!throttle.registerAttempt()) {
      toast.error(RATE_LIMIT_MSG);
      return;
    }
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  }

  const login = (v: AuthFormValues) =>
    guarded(v, async () => {
      try {
        const response = await authApi.login({
          email: v.email.trim().toLowerCase(),
          password: v.password,
        });
        const role = response.role.toLowerCase();
        const destination = ROLE_DESTINATION[role];

        if (!destination) {
          toast.error("Your account has no valid role.");
          return;
        }

        toast.success("Welcome Back");
        router.replace(safeRedirect(next, destination));
        router.refresh();
      } catch (err) {
        logUnexpected("login failed:", err);
        if (err instanceof HttpError && err.status === 401) {
          setError("password", { message: "Invalid email or password." });
        } else if (err instanceof HttpError && err.status !== 0) {
          toast.error(err.message);
        } else {
          toast.error(unexpectedMessage(err));
        }
      }
    });

  const register = (v: AuthFormValues) => {
    if (v.website) return;
    if (extracting || uploadingPhoto) {
      toast.info("Please wait — your upload is still processing.");
      return;
    }
    if (!idDoc?.imageUrl) {
      toast.error("Please scan or upload a valid ID first.");
      return;
    }

    return guarded(v, async () => {
      try {
        const result = await residentsApi.register({
          email: v.email.trim().toLowerCase(),
          password: v.password,
          firstName: v.firstName,
          lastName: v.lastName,
          middleName: v.middleName || undefined,
          phone: v.phone,
          address: v.address,
          dateOfBirth: v.dateOfBirth || undefined,
          document: {
            imageUrl: idDoc.imageUrl,
            cloudinaryPublicId: idDoc.cloudinaryPublicId ?? undefined,
            idNumber: idDoc.fields.idNumber ?? undefined,
            rawOcrText: idDoc.rawText.slice(0, 5000),
            ocrConfidence: idDoc.confidence,
          },
          profileImage: profileImage
            ? {
                imageUrl: profileImage.imageUrl,
                cloudinaryPublicId: profileImage.cloudinaryPublicId,
              }
            : undefined,
        });
        setOtpEmail(result.email);
        setOtpError(null);
        setResendIn(result.resendAvailableInSeconds);
        toast.success(`We sent a 6-digit code to ${result.email}.`);
      } catch (err) {
        logUnexpected("register failed:", err);
        if (err instanceof HttpError && err.status !== 0) {
          if (err.fieldErrors?.email)
            setError("email", { message: err.fieldErrors.email });
          else if (err.fieldErrors?.phone)
            setError("phone", { message: err.fieldErrors.phone });
          else if (err.status === 409)
            setError("email", { message: err.message });
          else toast.error(err.message);
        } else {
          toast.error(unexpectedMessage(err));
        }
      }
    });
  };

  const backToForm = (message?: string) => {
    setOtpEmail(null);
    setOtpError(null);
    if (message) toast.error(message);
  };

  const resendOtp = async () => {
    if (resendIn > 0 || resending || !otpEmail) return;
    setResending(true);
    try {
      const result = await residentsApi.resendOtp(otpEmail);
      setOtpError(null);
      setResendIn(result.resendAvailableInSeconds);
      toast.success("We sent you a new code.");
    } catch (err) {
      logUnexpected("resend OTP failed:", err);
      if (err instanceof HttpError && err.status === 404) {
        backToForm("Your registration expired. Please submit the form again.");
      } else if (err instanceof HttpError && err.status !== 0) {
        toast.error(err.message);
      } else {
        toast.error(unexpectedMessage(err));
      }
    } finally {
      setResending(false);
    }
  };

  const submitOtp = async (code: string) => {
    if (submitLockRef.current || !otpEmail) return;
    submitLockRef.current = true;
    setLoading(true);
    setOtpError(null);

    try {
      await residentsApi.verifyRegistration({ email: otpEmail, otp: code });
      toast.success("Account created. You can now sign in.");
      router.push("/login");
    } catch (err) {
      logUnexpected("verify OTP failed:", err);
      if (err instanceof HttpError && err.status !== 0) {
        if (err.status === 404) {
          backToForm(
            "Your registration expired. Please submit the form again.",
          );
        } else if (err.status === 409) {
          setOtpEmail(null);
          setError("email", { message: err.message });
        } else {
          setOtpError(err.fieldErrors?.otp ?? err.message);
        }
      } else {
        toast.error(unexpectedMessage(err));
      }
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  };

  const onSubmit = handleSubmit(
    (values) => (isRegister ? register(values) : login(values)),
    (formErrors) => {
      const first = Object.values(formErrors)[0];
      toast.error(
        (first?.message as string) || "Please check the highlighted fields.",
      );
    },
  );

  const password = watch("password");

  if (isRegister && otpEmail) {
    return (
      <OtpStep
        email={otpEmail}
        loading={loading}
        error={otpError}
        resendIn={resendIn}
        resending={resending}
        onSubmit={submitOtp}
        onResend={resendOtp}
        onBack={() => backToForm()}
      />
    );
  }

  return (
    <form
      noValidate
      autoComplete="on"
      className="space-y-6"
      onSubmit={onSubmit}
    >
      <div
        inert
        className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
      >
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <input
              {...field}
              value={field.value ?? ""}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          )}
        />
      </div>

      {isRegister && (
        <div className="space-y-3">
          <p className="text-[13px] font-medium text-slate-700">Valid ID</p>

          {idMode !== "upload" ? (
            <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setShowIdCamera(true)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8860B]/10 text-[#B8860B]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8a2 2 0 012-2h1.5l1-1.5h9l1 1.5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    Scan ID
                  </span>
                  <span className="block text-xs text-slate-500">
                    Take a photo with your camera
                  </span>
                </span>
                <span className="rounded-full bg-[#B8860B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#B8860B]">
                  Recommended
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIdMode("upload")}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    Upload ID
                  </span>
                  <span className="block text-xs text-slate-500">
                    Choose a JPG, PNG, WEBP or PDF
                  </span>
                </span>
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <IdUploadField
                upload={idUpload}
                onFileSelected={runIdExtraction}
                onFileRemoved={() => {
                  idRequestRef.current++;
                  setIdDoc(null);
                  setExtracting(false);
                  setIdMode(null); // back to the two options
                }}
              />
              <button
                type="button"
                onClick={() => setShowIdCamera(true)}
                className="text-xs font-semibold text-[#B8860B] hover:underline"
              >
                Scan with camera instead
              </button>
            </>
          )}

          {extracting && (
            <p className="text-xs text-slate-500" role="status">
              Reading details from your ID...
            </p>
          )}
        </div>
      )}

      {isRegister && (
        <div className="space-y-2">
          <SelfieUploadField
            upload={selfieUpload}
            onTakePhoto={() => setShowSelfieCamera(true)}
            onFileSelected={runPhotoUpload}
            onFileRemoved={() => {
              photoRequestRef.current++;
              setProfileImage(null);
              setUploadingPhoto(false);
            }}
          />
          {uploadingPhoto && (
            <p className="text-xs text-slate-500" role="status">
              Uploading photo...
            </p>
          )}
        </div>
      )}

      {isRegister && (
        <>
          <CustomInput
            control={control}
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Dela Cruz"
            autoComplete="family-name"
            maxLength={80}
          />
          <CustomInput
            control={control}
            name="firstName"
            label="First Name"
            type="text"
            placeholder="Juan"
            autoComplete="given-name"
            maxLength={80}
          />
          <CustomInput
            control={control}
            name="middleName"
            label="Middle Name (optional)"
            type="text"
            placeholder="Santos"
            autoComplete="additional-name"
            maxLength={80}
          />
        </>
      )}

      <CustomInput
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete={isRegister ? "email" : "username"}
        maxLength={254}
      />

      {isRegister && (
        <>
          <CustomInput
            control={control}
            name="phone"
            label="Mobile Number"
            type="tel"
            placeholder="09XXXXXXXXX"
            autoComplete="tel"
            maxLength={13}
          />
          <CustomInput
            control={control}
            name="address"
            label="Address"
            type="text"
            placeholder="Street, Barangay, City"
            autoComplete="street-address"
            maxLength={240}
          />
          <CustomInput
            control={control}
            name="dateOfBirth"
            label="Date of Birth (optional)"
            type="date"
            placeholder=""
            autoComplete="bday"
          />
        </>
      )}

      <div>
        <CustomInput
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete={isRegister ? "new-password" : "current-password"}
          maxLength={72}
        />
        {!isRegister && (
          <div className="flex justify-end mt-1.5">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#B8860B] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}
        {isRegister && password.length > 0 && (
          <StrengthMeter strength={passwordStrength(password)} />
        )}
      </div>

      {isRegister && (
        <>
          <CustomInput
            control={control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            maxLength={72}
          />

          <Controller
            control={control}
            name="agreeTerms"
            render={({ field, fieldState }) => (
              <div>
                <label className="flex items-start gap-2.5 text-[13px] text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded-sm border-slate-300 text-[#B8860B] focus:ring-[#B8860B]/40"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="text-[#B8860B] font-semibold hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-[#B8860B] font-semibold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <FieldError message={fieldState.error?.message ?? ""} />
              </div>
            )}
          />
        </>
      )}

      {throttle.isRateLimited && (
        <p className="text-amber-600 text-xs font-medium" role="alert">
          Too many attempts. Please wait a moment before trying again.
        </p>
      )}

      <button
        type="submit"
        disabled={
          loading || extracting || uploadingPhoto || throttle.isRateLimited
        }
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {isRegister ? "Creating account..." : "Signing in..."}
          </>
        ) : isRegister ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </button>

      {showIdCamera && (
        <IdScanner
          onCapture={(file) => {
            void idUpload.select(file);
            void runIdExtraction(file);
            setIdMode("upload"); // shows the captured photo with its remove button
            setShowIdCamera(false);
          }}
          onClose={() => setShowIdCamera(false)}
          onUploadInstead={() => {
            setShowIdCamera(false);
            setIdMode("upload");
          }}
        />
      )}
      {showSelfieCamera && (
        <CameraCapture
          onCapture={(file) => {
            void selfieUpload.select(file);
            void runPhotoUpload(file);
            setShowSelfieCamera(false);
          }}
          onClose={() => setShowSelfieCamera(false)}
        />
      )}
    </form>
  );
}