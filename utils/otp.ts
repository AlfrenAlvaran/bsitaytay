import "server-only";
import crypto from "crypto";

export const generateOtp = () =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

export const hashOtp = (email: string, code: string) =>
  crypto.createHmac("sha256", process.env.OTP_SECRET!).update(`${email}:${code}`).digest("hex");

export const otpMatches = (storedHash: string, email: string, code: string) => {
  const a = Buffer.from(hashOtp(email, code));
  const b = Buffer.from(storedHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};