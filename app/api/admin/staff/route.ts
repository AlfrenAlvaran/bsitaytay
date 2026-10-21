import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createStaffSchema } from "@/features/staff/schema/staff.schema";
import {
  createStaff,
  listStaff,
  StaffServiceError,
} from "@/server/services/staff.service";
import { AuthError, requireAdmin } from "@/server/services/require-admin";

function fieldErrorsFrom(err: ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  if (err instanceof ZodError) {
    console.log("[admin/staff] validation:", JSON.stringify(err.issues, null, 2));
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        fieldErrors: fieldErrorsFrom(err),
      },
      { status: 400 },
    );
  }
  if (err instanceof StaffServiceError) {
    if (err.code === "NOT_FOUND") {
      return NextResponse.json({ message: err.message }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: err.message,
        code: err.code,
        fieldErrors: { [err.field]: err.message },
      },
      { status: 409 },
    );
  }
  console.error("[admin/staff]", err);
  return NextResponse.json(
    { message: "Something went wrong. Please try again." },
    { status: 500 },
  );
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const input = createStaffSchema.parse(json);
    const staff = await createStaff(input, String(admin.id));

    return NextResponse.json({ staff }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const staff = await listStaff();
    return NextResponse.json({ staff });
  } catch (err) {
    return handleError(err);
  }
}