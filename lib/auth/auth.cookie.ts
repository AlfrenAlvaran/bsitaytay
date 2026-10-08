import "server-only";

import { cookies } from "next/headers";

import { secretEnv } from "../config/env";
import { ACCESS_TTL_MS, REFRESH_TTL_MS } from "./auth.token";

const isProd = secretEnv.NODE_ENV === 'production';
const base = { httpOnly: true, secure: isProd } as const;

const ACCESS = { ...base, sameSite: "lax", path: "/" } as const;

const REFRESH = { ...base, sameSite: "strict", path: "/api/auth" } as const;

const FLAG = { ...base, sameSite: "lax", path: "/" } as const;

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const jar = await cookies();
  jar.set("access_token", accessToken, {
    ...ACCESS,
    maxAge: ACCESS_TTL_MS / 1000,
  });
  jar.set("refresh_token", refreshToken, {
    ...REFRESH,
    maxAge: REFRESH_TTL_MS / 1000,
  });
  jar.set("session_active", "1", { ...FLAG, maxAge: REFRESH_TTL_MS / 1000 });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.set("access_token", "", { ...ACCESS, maxAge: 0 });
  jar.set("refresh_token", "", { ...REFRESH, maxAge: 0 });
  jar.set("session_active", "", { ...FLAG, maxAge: 0 });
}
