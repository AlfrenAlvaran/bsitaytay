import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(254);

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1).max(128),
  }),
});
export type LoginInput = z.infer<typeof loginSchema>["body"];

const documentSchema = z.object({
  documentType: z.string().max(50).default("OTHER"),
  idNumber: z.string().max(100).optional(),
  imageUrl: z.string().url(),
  cloudinaryPublicId: z.string().optional(),
  rawOcrText: z.string().optional(),
  ocrConfidence: z.number().min(0).max(100).optional(),
});

export const registerSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(8).max(128),
    firstName: z.string().trim().min(1).max(80),
    middleName: z.string().trim().max(80).optional(),
    lastName: z.string().trim().min(1).max(80),
    phone: z.string().trim().max(30).optional(),
    address: z.string().trim().max(300).optional(),
    dateOfBirth: z.coerce.date().optional(),
    profileImageUrl: z.string().url().optional(),
    profileImagePublicId: z.string().optional(),
    documents: z.array(documentSchema).max(5).default([]),
  }),
});
export type RegisterInput = z.infer<typeof registerSchema>["body"];

export const verifyOtpSchema = z.object({
  body: z.object({
    email,
    otp: z.string().regex(/^\d{6}$/),
  }),
});

export const rejectSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(1).max(500),
  }),
});
