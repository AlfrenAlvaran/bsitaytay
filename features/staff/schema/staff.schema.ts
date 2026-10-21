import { z } from "zod";
import { POSITIONS, PERMISSION_IDS } from "../constant/staff.constant";

// const NAME_REGEX = /^[\p{L}\p{M}' .-]+$/u;

export const NAME_REGEX = /^[\p{L}\p{M}'’ .-]+$/u;
const PH_MOBILE_REGEX = /^(?:\+63|0)9\d{9}$/;

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(60, `${label} is too long`)
    .regex(NAME_REGEX, `${label} contains invalid characters`);

export const createStaffSchema = z.object({
  firstName: name("First name"),
  lastName: name("Last name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Enter a valid email"),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine((v) => PH_MOBILE_REGEX.test(v), "Use 09XXXXXXXXX or +639XXXXXXXXX"),
  position: z.enum(POSITIONS, { message: "Select a valid position" }),
  employeeId: z
    .string()
    .trim()
    .max(50, "Employee ID is too long")
    .optional()
    .transform((v) => v || undefined),
  startDate: z.coerce.date({ message: "Choose a start date" }),
  permissions: z
    .array(z.enum(PERMISSION_IDS))
    .min(1, "Select at least one permission")
    .transform((v) => Array.from(new Set(v))),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(72, "At most 72 characters"),
  mustChangePassword: z.boolean().default(true),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const setStaffActiveSchema = z.object({
  active: z.boolean(),
});