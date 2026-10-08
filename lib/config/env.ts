import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  OTP_SECRET: z.string().min(1),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const secretEnv = envSchema.parse(process.env);


console.log("SMTP_SECURE =", JSON.stringify(process.env.SMTP_SECURE));