import "server-only";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/auth.token";
import { AuthError } from "./require-admin";

const ACCESS_COOKIE = "access_token";

export async function requireUser() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) throw new AuthError("Not authenticated.", 401);

  try {
    return verifyAccessToken(token) as { id: string; role: string };
  } catch {
    throw new AuthError("Not authenticated.", 401);
  }
}