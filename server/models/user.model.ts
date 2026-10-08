import "server-only";

import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["RESIDENT", "ADMIN", "STAFF"],
      default: "RESIDENT",
    },
  },
  { timestamps: true },
);
export const User = models.User ?? model("User", userSchema);
