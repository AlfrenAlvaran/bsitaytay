import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { changePasswordSchema } from "@/features/auth/schema/change-password.schema";
import {
  changePassword,
  PasswordChangeError,
} from "@/server/services/auth.service";
import { requireUser } from "@/server/services/require-user";
import { AuthError } from "@/server/services/require-admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const input = changePasswordSchema.parse(json);
    await changePassword(user.id, input.currentPassword, input.newPassword);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    if (err instanceof PasswordChangeError) {
      return NextResponse.json(
        {
          message: err.message,
          fieldErrors: { currentPassword: err.message },
        },
        { status: 400 },
      );
    }
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const i of err.issues) {
        const k = String(i.path[0] ?? "form");
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      }
      return NextResponse.json(
        { message: "Please check the highlighted fields.", fieldErrors },
        { status: 400 },
      );
    }
    console.error("[auth/change-password]", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}