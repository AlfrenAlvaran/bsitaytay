import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "@/utils/api-error";
import {
  ResidentServiceError,
  type ResidentServiceErrorCode,
} from "@/server/services/registration.service";

const SERVICE_ERROR_STATUS: Record<ResidentServiceErrorCode, number> = {
  EMAIL_TAKEN: 409,
  NO_PENDING_REGISTRATION: 404,
  OTP_EXPIRED: 400,
  OTP_INVALID: 400,
  OTP_TOO_MANY_ATTEMPTS: 429,
  OTP_RESEND_COOLDOWN: 429,
};

export function ok<T>(data: T, message = "OK", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function handle<C = unknown>(
  fn: (req: Request, ctx: C) => Promise<Response>,
) {
  return async (req: Request, ctx: C) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: err.message },
          { status: err.statusCode },
        );
      }

      if (err instanceof ResidentServiceError) {
        return NextResponse.json(
          {
            success: false,
            message: err.message,
            code: err.code,
            retryAfterSec: err.retryAfterSec,
          },
          {
            status: SERVICE_ERROR_STATUS[err.code],
            headers: err.retryAfterSec
              ? { "Retry-After": String(err.retryAfterSec) }
              : undefined,
          },
        );
      }

      console.error(err);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export async function readJson(req: Request): Promise<unknown> {
  return req.json().catch(() => null);
}

export function sessionMeta(req: Request) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  };
}