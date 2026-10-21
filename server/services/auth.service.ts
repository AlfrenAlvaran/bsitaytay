import "server-only";
import bcrypt from "bcrypt";
import {
  generateRefreshToken,
  hashToken,
  REFRESH_TTL_MS,
  Role,
  signAccessToken,
} from "@/lib/auth/auth.token";
import { RefreshToken } from "../models/refreshToken.model";
import { PendingRegistration } from "../models/pending-registration.model";
import { ApiError } from "@/utils/api-error";
import { LoginInput } from "@/lib/validators/auth.validator";
import { connectDB } from "@/lib/config/databse";
import { User } from "../models/user.model";
import { Resident } from "../models/resident.model";
import { Staff } from "../models/staff.model";

export interface SessionMeta {
  ip?: string;
  userAgent?: string;
}

export class PasswordChangeError extends Error {}

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);
const GRACE_MS = 10_000;

async function createRefreshToken(userId: string, meta: SessionMeta) {
  const raw = generateRefreshToken();

  await RefreshToken.create({
    tokenHash: hashToken(raw),
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    ip: meta.ip,
    userAgent: meta.userAgent?.slice(0, 255),
  });

  return raw;
}

async function explainPendingRegistration(email: string, password: string) {
  const pending = await PendingRegistration.findOne({
    email,
    status: { $in: ["AWAITING_APPROVAL", "REJECTED"] },
  }).lean();

  const hash = pending?.payload?.password;

  if (!pending || !hash) return;
  if (!(await bcrypt.compare(password, hash))) return;

  if (pending.status === "AWAITING_APPROVAL") {
    throw ApiError.forbidden(
      "Your registration is still waiting for staff approval",
    );
  }
}

export async function loginUser(input: LoginInput, meta: SessionMeta) {
  await connectDB();

  const email = input.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+passwordHash").lean();

  const passwordOk = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  if (!user || !passwordOk) {
    if (!user) await explainPendingRegistration(email, input.password);
    throw ApiError.unauthorized("Invalid credentials");
  }

  const id = user._id.toString();
  const role = user.role as Role;

  let mustChangePassword = false;

  if (role === "STAFF") {
    if (!user.status) {
      throw ApiError.forbidden("This account has been deactivated");
    }
    const staff = await Staff.findOne({ userId: user._id })
      .select("mustChangePassword")
      .lean();
    mustChangePassword = Boolean(staff?.mustChangePassword);
  }

  return {
    user: { id, email: user.email as string, role, mustChangePassword },
    accessToken: signAccessToken({ id, role }),
    refreshToken: await createRefreshToken(id, meta),
  };
}

export async function refreshSession(
  rawToken: string | undefined,
  meta: SessionMeta,
) {
  if (!rawToken) throw ApiError.unauthorized("Session expired");

  await connectDB();

  const record = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });

  if (!record) throw ApiError.unauthorized("Session Expired");

  if (record.revokedAt) {
    if (Date.now() - record.revokedAt.getTime() >= GRACE_MS) {
      await RefreshToken.updateMany(
        { userId: record.userId, revokedAt: null },
        { revokedAt: new Date() },
      );
      throw ApiError.unauthorized("Session Expired");
    }
  }

  if (record.expiresAt < new Date())
    throw ApiError.unauthorized("Session expired");

  const claimed = await RefreshToken.findOneAndUpdate(
    { _id: record._id, revokedAt: null },
    { revokedAt: new Date() },
  );

  if (!claimed) throw ApiError.unauthorized("Expired session");

  const user = await User.findById(record.userId).select("role status").lean();

  if (!user) throw ApiError.unauthorized("Session expired");

  if (user.role === "STAFF" && !user.status) {
    await RefreshToken.updateMany(
      { userId: record.userId, revokedAt: null },
      { revokedAt: new Date() },
    );
    throw ApiError.unauthorized("Session expired");
  }

  const id = user._id.toString();
  const role = user.role as Role;

  return {
    accessToken: signAccessToken({ id, role }),
    refreshToken: await createRefreshToken(id, meta),
  };
}

export async function logoutSession(rawToken: string | undefined) {
  if (!rawToken) return;
  await connectDB();
  await RefreshToken.updateOne(
    { tokenHash: hashToken(rawToken), revokedAt: null },
    { revokedAt: new Date() },
  );
}

export async function getCurrentUser(id: string) {
  await connectDB();

  const user = await User.findById(id).select("email role status").lean();
  if (!user) throw ApiError.unauthorized("Authentication required");

  const role = user.role as Role;

  if (role === "STAFF") {
    if (!user.status) throw ApiError.unauthorized("Authentication required");

    const staff = await Staff.findOne({ userId: user._id })
      .select("firstName lastName position permissions mustChangePassword")
      .lean();

    return {
      id: user._id.toString(),
      email: user.email as string,
      role,
      firstName: (staff?.firstName as string | undefined) ?? null,
      lastName: (staff?.lastName as string | undefined) ?? null,
      profileImageUrl: null as string | null,
      position: (staff?.position as string | undefined) ?? null,
      permissions: (staff?.permissions as string[] | undefined) ?? [],
      mustChangePassword: Boolean(staff?.mustChangePassword),
    };
  }

  const resident = await Resident.findOne({ userId: user._id })
    .select("firstName lastName profileImageUrl")
    .lean();

  return {
    id: user._id.toString(),
    email: user.email as string,
    role,
    firstName: (resident?.firstName as string | undefined) ?? null,
    lastName: (resident?.lastName as string | undefined) ?? null,
    profileImageUrl: (resident?.profileImageUrl as string | undefined) ?? null,
    position: null as string | null,
    permissions: [] as string[],
    mustChangePassword: false,
  };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  await connectDB();

  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw ApiError.unauthorized("Authentication required");

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new PasswordChangeError("Current password is incorrect");

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  await Staff.updateOne({ userId: user._id }, { mustChangePassword: false });
}