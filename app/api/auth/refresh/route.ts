import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { refreshSession } from "@/server/services/auth.service";
import { ACCESS_TTL_MS, REFRESH_TTL_MS } from "@/lib/auth/auth.token";
import { ApiError } from "@/utils/api-error";

// export const dynamic = "force-dynamic";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const SESSION_COOKIE = "session_active";

const base = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST() {
  const jar = await cookies();
  const h = await headers();

  try {
    const { accessToken, refreshToken } = await refreshSession(
      jar.get(REFRESH_COOKIE)?.value,
      {
        ip: h.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: h.get("user-agent") ?? undefined,
      },
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ACCESS_COOKIE, accessToken, {
      ...base,
      httpOnly: true,
      maxAge: Math.floor(ACCESS_TTL_MS / 1000),
    });
    res.cookies.set(REFRESH_COOKIE, refreshToken, {
      ...base,
      httpOnly: true,
      maxAge: Math.floor(REFRESH_TTL_MS / 1000),
    });
    res.cookies.set(SESSION_COOKIE, "1", {
      ...base,
      httpOnly: false,
      maxAge: Math.floor(REFRESH_TTL_MS / 1000),
    });
    return res;
  } catch (err) {
    const res = NextResponse.json(
      { message: err instanceof ApiError ? err.message : "Session expired" },
      { status: 401 },
    );
    res.cookies.delete(ACCESS_COOKIE);
    res.cookies.delete(REFRESH_COOKIE);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
}