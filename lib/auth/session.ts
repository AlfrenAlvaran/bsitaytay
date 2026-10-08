import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { Role, verifyAccessToken } from "./auth.token";
import { ApiError } from "@/utils/api-error";

export const getSession = cache(async () => {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch (error) {
    return null;
  }
});

export async function requireSession() {
  const session = await getSession();

  if (!session) throw ApiError.unauthorized("Authentication required");

  return session;
}

export async function requireRole(...role: Role[]) {
  const session = await requireSession();

  if (!role.includes(session.role)) throw ApiError.forbidden("Forbidden");

  return session;
}
