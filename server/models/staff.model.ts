import "server-only";
import { Schema, model, models, InferSchemaType } from "mongoose";
import { POSITIONS, PERMISSION_IDS } from "@/features/staff/constant/staff.constant";

const staffSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, enum: POSITIONS, required: true },
    employeeId: { type: String, trim: true, unique: true, sparse: true },
    startDate: { type: Date, required: true },
    permissions: {
      type: [{ type: String, enum: PERMISSION_IDS }],
      default: [],
    },
    mustChangePassword: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export type StaffType = InferSchemaType<typeof staffSchema>;

export const Staff = models.Staff ?? model("Staff", staffSchema);