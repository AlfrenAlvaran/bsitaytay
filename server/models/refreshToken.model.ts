import "server-only";
import { Schema, model, models } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export const RefreshToken =
  models.RefreshToken ?? model("RefreshToken", refreshTokenSchema);
