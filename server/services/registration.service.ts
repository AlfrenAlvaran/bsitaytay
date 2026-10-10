import "server-only";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { PSM } from "tesseract.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { after } from "next/server";
import { User } from "@/server/models/user.model";
import { Resident } from "@/server/models/resident.model";
import { PendingRegistration } from "@/server/models/pending-registration.model";

import type {
  ExtractIdResult,
  InitiateRegistrationResult,
  UploadPhotoResult,
} from "@/features/residents/types/resident.types";
import { RegisterResidentInput } from "@/features/residents/schema/resident.schema";
import { uploadImage } from "@/lib/config/upload-cloudinary";
import { parseIdText } from "@/lib/auth/id-parser";
import { generateOtp, hashOtp, otpMatches } from "@/utils/otp";
import { connectDB } from "@/lib/config/databse";
import { verificationCode } from "@/utils/mail-templates";
import { createOcrWorker } from "@/lib/ocr/create-worker";

export type ResidentServiceErrorCode =
  | "EMAIL_TAKEN"
  | "NO_PENDING_REGISTRATION"
  | "OTP_EXPIRED"
  | "OTP_INVALID"
  | "OTP_TOO_MANY_ATTEMPTS"
  | "OTP_RESEND_COOLDOWN";

export class ResidentServiceError extends Error {
  constructor(
    message: string,
    public code: ResidentServiceErrorCode,
    public retryAfterSec?: number,
  ) {
    super(message);
  }
}

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 30;

type PendingPayload = Omit<RegisterResidentInput, "password"> & {
  passwordHash: string;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const fullName = (p: {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}) => [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");

const cooldownLeft = (sentAt: Date) =>
  Math.max(
    0,
    Math.ceil(
      (sentAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000,
    ),
  );

const cooldownError = (wait: number) =>
  new ResidentServiceError(
    `Please wait ${wait}s before requesting another code.`,
    "OTP_RESEND_COOLDOWN",
    wait,
  );

const noPendingError = () =>
  new ResidentServiceError(
    "No pending registration for this email. Please start again.",
    "NO_PENDING_REGISTRATION",
  );

const tooManyAttemptsError = () =>
  new ResidentServiceError(
    "Too many incorrect attempts. Request a new code.",
    "OTP_TOO_MANY_ATTEMPTS",
  );

// purgeAt (expiry + 24h) feeds the TTL index that cleans up old rows
const otpTimes = () => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  return {
    otpSentAt: now,
    expiresAt,
    purgeAt: new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000),
  };
};

const otpResult = (email: string): InitiateRegistrationResult => ({
  email,
  expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
  resendAvailableInSeconds: RESEND_COOLDOWN_SECONDS,
});

function sendOtpInBackground(email: string, name: string, code: string) {
  after(async () => {
    try {
      await verificationCode(email, name, code, OTP_EXPIRY_MINUTES);
    } catch (err) {
      console.error("[register] failed to send OTP email:", err);
    }
  });
}

/* ----------------------------- OCR ----------------------------- */

async function prepareForOcr(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: false })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toBuffer();
}

async function extractTextFromImage(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    throw new Error(
      "PDF OCR isn't wired up. Tesseract.js only reads raster images. " +
        "Rasterize the PDF's first page before passing it in, or upload the ID as an image.",
    );
  }

  const image = await prepareForOcr(buffer);
  const worker = await createOcrWorker();

  try {
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });
    const {
      data: { text },
    } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

export async function extractIdFields(
  buffer: Buffer,
  mimeType: string,
): Promise<ExtractIdResult> {
  const [rawText, uploadResult] = await Promise.all([
    extractTextFromImage(buffer, mimeType),
    uploadImage(buffer, "id-uploads", randomUUID()).catch((err) => {
      console.error("Cloudinary upload failed:", err);
      return null;
    }),
  ]);

  const { fields, confidence } = parseIdText(rawText);

  return {
    fields,
    confidence,
    rawText,
    imageUrl: uploadResult?.secureUrl ?? null,
    cloudinaryPublicId: uploadResult?.publicId ?? null,
  };
}

export async function uploadProfilePhoto(
  buffer: Buffer,
): Promise<UploadPhotoResult> {
  const { secureUrl, publicId } = await uploadImage(
    buffer,
    "profile-photos",
    randomUUID(),
  );
  return { imageUrl: secureUrl, cloudinaryPublicId: publicId };
}

/* ------------------------ Registration + OTP ------------------------ */

export async function initiateRegistration(
  input: RegisterResidentInput,
): Promise<InitiateRegistrationResult> {
  await connectDB();
  const email = normalizeEmail(input.email);

  if (await User.exists({ email })) {
    throw new ResidentServiceError(
      "An account with this email already exists.",
      "EMAIL_TAKEN",
    );
  }

  const pending = await PendingRegistration.findOne({ email }).lean();
  if (pending) {
    const wait = cooldownLeft(pending.otpSentAt);
    if (wait > 0) throw cooldownError(wait);
  }

  const code = generateOtp();

  const { password, ...rest } = input;
  const payload: PendingPayload = {
    ...rest,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  };

  await PendingRegistration.findOneAndUpdate(
    { email },
    {
      $set: {
        otpHash: hashOtp(email, code),
        payload,
        attempts: 0,
        ...otpTimes(),
      },
    },
    { upsert: true },
  );

  sendOtpInBackground(email, fullName(input), code);

  return otpResult(email);
}

export async function resendRegistrationOtp(
  rawEmail: string,
): Promise<InitiateRegistrationResult> {
  await connectDB();
  const email = normalizeEmail(rawEmail);

  const pending = await PendingRegistration.findOne({ email }).lean();
  if (!pending) throw noPendingError();

  const wait = cooldownLeft(pending.otpSentAt);
  if (wait > 0) throw cooldownError(wait);

  const code = generateOtp();
  await PendingRegistration.updateOne(
    { email },
    { $set: { otpHash: hashOtp(email, code), attempts: 0, ...otpTimes() } },
  );

  const p = pending.payload as unknown as PendingPayload;
  sendOtpInBackground(email, fullName(p), code);

  return otpResult(email);
}

export async function verifyRegistration(rawEmail: string, otp: string) {
  await connectDB();
  const email = normalizeEmail(rawEmail);

  const pending = await PendingRegistration.findOne({ email }).lean();
  if (!pending) throw noPendingError();

  if (pending.expiresAt < new Date()) {
    throw new ResidentServiceError(
      "That code has expired. Request a new one.",
      "OTP_EXPIRED",
    );
  }

  if (pending.attempts >= MAX_OTP_ATTEMPTS) throw tooManyAttemptsError();

  // Atomically count this attempt first, so parallel requests
  // can't exceed the limit via a read-then-write race.
  const updated = await PendingRegistration.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" },
  ).lean();
  if (!updated) throw noPendingError();

  const attempts = updated.attempts;
  if (attempts > MAX_OTP_ATTEMPTS) throw tooManyAttemptsError();

  if (!otpMatches(pending.otpHash, email, otp)) {
    const left = MAX_OTP_ATTEMPTS - attempts;
    if (left <= 0) throw tooManyAttemptsError();
    throw new ResidentServiceError(
      `That code is incorrect. ${left} attempt${left === 1 ? "" : "s"} left.`,
      "OTP_INVALID",
    );
  }

  return createResident(pending.payload as unknown as PendingPayload);
}

async function createResident(payload: PendingPayload) {
  try {
    // Transactions need a replica set (MongoDB Atlas has one by default).
    return await mongoose.connection.transaction(async (session) => {
      const [user] = await User.create(
        [
          {
            email: payload.email,
            passwordHash: payload.passwordHash,
            role: "RESIDENT",
          },
        ],
        { session },
      );

      const doc = payload.document;
      const [resident] = await Resident.create(
        [
          {
            userId: user._id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            middleName: payload.middleName || undefined,
            phone: payload.phone,
            address: payload.address,
            dateOfBirth: payload.dateOfBirth
              ? new Date(payload.dateOfBirth)
              : undefined,
            profileImageUrl: payload.profileImage?.imageUrl,
            profileImagePublicId: payload.profileImage?.cloudinaryPublicId,
            documents: doc
              ? [
                  {
                    documentType: doc.documentType ?? "OTHER",
                    idNumber: doc.idNumber,
                    imageUrl: doc.imageUrl,
                    cloudinaryPublicId: doc.cloudinaryPublicId,
                    rawOcrText: doc.rawOcrText,
                    ocrConfidence: doc.ocrConfidence,
                  },
                ]
              : [],
          },
        ],
        { session },
      );

      await PendingRegistration.deleteMany(
        { email: payload.email },
        { session },
      );

      return {
        user: { id: user._id.toString(), email: user.email, role: user.role },
        resident: resident.toObject(),
      };
    });
  } catch (err) {
    // 11000 = duplicate key (email registered between initiate and verify)
    if ((err as { code?: number }).code === 11000) {
      throw new ResidentServiceError(
        "An account with this email already exists.",
        "EMAIL_TAKEN",
      );
    }
    throw err;
  }
}