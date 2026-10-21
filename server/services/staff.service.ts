import "server-only";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "@/server/models/user.model";
import { Staff } from "@/server/models/staff.model";
import { RefreshToken } from "@/server/models/refreshToken.model";
import { connectDB } from "@/lib/config/databse";
import type { CreateStaffInput } from "@/features/staff/schema/staff.schema";

export type StaffServiceErrorCode =
  | "EMAIL_TAKEN"
  | "EMPLOYEE_ID_TAKEN"
  | "NOT_FOUND";

export class StaffServiceError extends Error {
  constructor(
    message: string,
    public code: StaffServiceErrorCode,
    public field: "email" | "employeeId" | "form",
  ) {
    super(message);
  }
}

export async function createStaff(input: CreateStaffInput, adminId: string) {
  await connectDB();
  const email = input.email.trim().toLowerCase();

  if (await User.exists({ email })) {
    throw new StaffServiceError(
      "An account with this email already exists.",
      "EMAIL_TAKEN",
      "email",
    );
  }

  if (
    input.employeeId &&
    (await Staff.exists({ employeeId: input.employeeId }))
  ) {
    throw new StaffServiceError(
      "This employee ID is already in use.",
      "EMPLOYEE_ID_TAKEN",
      "employeeId",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    return await mongoose.connection.transaction(async (session) => {
      const [user] = await User.create(
        [{ email, passwordHash, role: "STAFF", status: true }],
        { session },
      );

      const [staff] = await Staff.create(
        [
          {
            userId: user._id,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.mobile,
            position: input.position,
            employeeId: input.employeeId,
            startDate: input.startDate,
            permissions: input.permissions,
            mustChangePassword: input.mustChangePassword,
            createdBy: adminId,
          },
        ],
        { session },
      );

      return {
        id: staff._id.toString(),
        userId: user._id.toString(),
        email: user.email as string,
        firstName: staff.firstName as string,
        lastName: staff.lastName as string,
        position: staff.position as string,
        permissions: staff.permissions as string[],
      };
    });
  } catch (err) {
    const e = err as { code?: number; keyPattern?: Record<string, unknown> };
    if (e.code === 11000) {
      if (e.keyPattern?.employeeId) {
        throw new StaffServiceError(
          "This employee ID is already in use.",
          "EMPLOYEE_ID_TAKEN",
          "employeeId",
        );
      }
      throw new StaffServiceError(
        "An account with this email already exists.",
        "EMAIL_TAKEN",
        "email",
      );
    }
    throw err;
  }
}

export async function listStaff() {
  await connectDB();
  const rows = await Staff.find()
    .sort({ createdAt: -1 })
    .populate("userId", "email status")
    .lean();

  return rows.map((s: any) => ({
    id: s._id.toString(),
    userId: s.userId?._id?.toString() ?? "",
    email: s.userId?.email ?? null,
    firstName: s.firstName,
    lastName: s.lastName,
    phone: s.phone,
    position: s.position,
    employeeId: s.employeeId,
    startDate: new Date(s.startDate).toISOString(),
    permissions: s.permissions,
    mustChangePassword: s.mustChangePassword,
    active: Boolean(s.userId?.status),
    createdAt: new Date(s.createdAt).toISOString(),
  }));
}

export async function setStaffActive(staffId: string, active: boolean) {
  await connectDB();

  if (!mongoose.isValidObjectId(staffId)) {
    throw new StaffServiceError("Staff not found.", "NOT_FOUND", "form");
  }

  const staff = await Staff.findById(staffId).select("userId").lean();
  if (!staff) {
    throw new StaffServiceError("Staff not found.", "NOT_FOUND", "form");
  }

  await User.updateOne({ _id: staff.userId }, { $set: { status: active } });

  if (!active) {
    await RefreshToken.updateMany(
      { userId: staff.userId, revokedAt: null },
      { revokedAt: new Date() },
    );
  }
}