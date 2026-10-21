import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError,requireAdmin } from "@/server/services/require-admin";
import { setStaffActiveSchema } from "@/features/staff/schema/staff.schema";
import {
  setStaffActive,
  StaffServiceError,
} from "@/server/services/staff.service";

// export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const { active } = setStaffActiveSchema.parse(json);
    await setStaffActive(id, active);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 },
      );
    }
    if (err instanceof StaffServiceError && err.code === "NOT_FOUND") {
      return NextResponse.json({ message: err.message }, { status: 404 });
    }
    console.error("[admin/staff/:id]", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}