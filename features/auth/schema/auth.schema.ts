import { z } from "zod";

export type AuthType = "login" | "register";

const PH_MOBILE_REGEX = /^(?:\+63|0)9\d{9}$/;
const NAME_REGEX = /^[\p{L}\p{M}' .-]+$/u;

const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "qwerty123",
  "letmein11",
  "admin1234",
  "iloveyou1",
  "welcome123",
]);

export const passwordField = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(72, "Password must be at most 72 characters")
  .refine((v) => /[a-z]/.test(v), "Include at least one lowercase letter")
  .refine((v) => /[A-Z]/.test(v), "Include at least one uppercase letter")
  .refine((v) => /[0-9]/.test(v), "Include at least one number")
  .refine((v) => /[^A-Za-z0-9]/.test(v), "Include at least one special character")
  .refine((v) => !COMMON_PASSWORDS.has(v.toLowerCase()), "This password is too common");

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address")
  .transform((v) => v.toLowerCase());

const normalizePhone = (v: string) => v.replace(/[\s()-]/g, "");

const phoneField = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((v) => PH_MOBILE_REGEX.test(v), "Enter a valid mobile number (e.g. 09XXXXXXXXX)");

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(60, `${label} is too long`)
    .regex(NAME_REGEX, `${label} contains invalid characters`);

const middleNameField = z
  .string()
  .trim()
  .max(60, "Middle name is too long")
  .refine((v) => v === "" || NAME_REGEX.test(v), "Middle name contains invalid characters")
  .optional();

const addressField = z.string().trim().min(5, "Enter your complete address").max(255, "Address is too long");

const dateOfBirthField = z
  .string()
  .optional()
  .refine(
    (v) => !v || (!Number.isNaN(Date.parse(v)) && new Date(v) < new Date()),
    "Enter a valid date of birth",
  );

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required").max(72),
  website: z.string().optional(),
});

export const registerSchema = z
  .object({
    firstName: nameField("First name"),
    middleName: middleNameField,
    lastName: nameField("Last name"),
    email: emailField,
    phone: phoneField,
    address: addressField,
    dateOfBirth: dateOfBirthField,
    password: passwordField,
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((v) => v === true, "You must accept the Terms and Privacy Policy"),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export interface AuthFormValues {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  website?: string;
}

export const authFormSchema = (type: AuthType) => (type === "login" ? loginSchema : registerSchema);