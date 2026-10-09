
import "server-only";

import { Role, verifyAccessToken } from "./auth.token";
import { ApiError } from "@/utils/api-error";

export async function getSession(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const token = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("access_token="))
    ?.slice("access_token=".length);

  if (!token) return null;

  try {
    return verifyAccessToken(decodeURIComponent(token));
  } catch {
    return null;
  }
}

export async function requireSession(req: Request) {
  const session = await getSession(req);

  if (!session) {
    throw ApiError.unauthorized("Authentication required");
  }

  return session;
}

export async function requireRole(req: Request, ...roles: Role[]) {
  const session = await requireSession(req);

  if (!roles.includes(session.role)) {
    throw ApiError.forbidden("Forbidden");
  }

  return session;
}