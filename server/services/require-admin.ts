import "server-only";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/auth.token";
import { getCurrentUser } from "@/server/services/auth.service";

export class AuthError extends Error {
  constructor(
    message: string,
    public status: 401 | 403,
  ) {
    super(message);
  }
}

const ACCESS_COOKIE = "access_token";

export async function requireAdmin() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) throw new AuthError("Not authenticated.", 401);

  let payload: { id: string; role: string };
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new AuthError("Not authenticated.", 401);
  }

  if (payload.role !== "ADMIN") throw new AuthError("Forbidden.", 403);

  const user = await getCurrentUser(payload.id);
  if (user.role !== "ADMIN") throw new AuthError("Forbidden.", 403);

  return user;
}