import "server-only";
import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email());

// Only accept images that were uploaded to YOUR Cloudinary account,
// so a client can't submit an arbitrary URL as their "ID image".
const cloudinaryUrl = z
  .url()
  .refine(
    (u) => u.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`),
    "Invalid image URL",
  );

export const registerResidentSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  middleName: z.string().trim().max(60).optional(),
  lastName: z.string().trim().min(1).max(60),
  email,
  password: z.string().min(8).max(72),
  phone: z
    .string()
    .trim()
    .regex(/^(\+63|0)9\d{9}$/, "Invalid PH mobile number"),
  address: z.string().trim().min(5).max(255),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  profileImage: z
    .object({
      imageUrl: cloudinaryUrl,
      cloudinaryPublicId: z.string().optional(),
    })
    .optional(),
  document: z
    .object({
      documentType: z.string().optional(),
      idNumber: z.string().optional(),
      imageUrl: cloudinaryUrl,
      cloudinaryPublicId: z.string().optional(),
      rawOcrText: z.string().max(5000).optional(),
      ocrConfidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export const verifySchema = z.object({
  email,
  otp: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const resendSchema = z.object({ email });

export type RegisterResidentInput = z.infer<typeof registerResidentSchema>;
