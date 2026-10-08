import "server-only";
import { Schema, model, models } from "mongoose";

const pendingSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  otpHash: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  status: {
    type: String,
    enum: ["AWAITING_OTP", "AWAITING_APPROVAL", "REJECTED"],
    default: "AWAITING_OTP",
    index: true,
  },
  rejectionReason: String,
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
  attempts: { type: Number, default: 0 },
  otpSentAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true }, // OTP expiry only
  purgeAt: { type: Date, required: true },
});
pendingSchema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

export const PendingRegistration =
  models.PendingRegistration ?? model("PendingRegistration", pendingSchema);