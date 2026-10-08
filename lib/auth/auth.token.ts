import "server-only";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ROLES, type Role } from "./role";

export type { Role };

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!ACCESS_SECRET || ACCESS_SECRET.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must be set and at least 32 characters");
}

export const ACCESS_TTL_MS = 15 * 60 * 1000; // 15 min
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const OBJECT_ID = /^[0-9a-f]{24}$/i;

export function signAccessToken(user: { id: string; role: Role }) {
  return jwt.sign({ role: user.role }, ACCESS_SECRET!, {
    subject: user.id,
    expiresIn: Math.floor(ACCESS_TTL_MS / 1000),
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string): { id: string; role: Role } {
  const payload = jwt.verify(token, ACCESS_SECRET!, {
    algorithms: ["HS256"],
  }) as jwt.JwtPayload;

  const id = payload.sub;
  const role = payload.role as Role;

  if (!id || !OBJECT_ID.test(id) || !ROLES.includes(role)) {
    throw new Error("Invalid token payload");
  }
  return { id, role };
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
