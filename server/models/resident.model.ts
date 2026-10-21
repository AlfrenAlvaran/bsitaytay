import "server-only";
import { Schema, model, models, InferSchemaType } from "mongoose";
import {
  GENDERS,
  CIVIL_STATUSES,
  computeAge,
} from "@/constant/resident.constants";
export { GENDERS, CIVIL_STATUSES };

const documentSchema = new Schema(
  {
    documentType: { type: String, default: "OTHER" },
    idNumber: String,
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: String,
    rawOcrText: String,
    ocrConfidence: Number,
  },
  { timestamps: true },
);

const residentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    suffix: { type: String, trim: true },
    gender: { type: String, enum: GENDERS, required: true },
    civilStatus: { type: String, enum: CIVIL_STATUSES, required: true },
    nationality: { type: String, default: "Filipino", trim: true },
    dateOfBirth: { type: Date, required: true },
    placeOfBirth: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    occupation: { type: String, trim: true },
    voterStatus: { type: Boolean, default: false },
    profileImageUrl: String,
    profileImagePublicId: String,
    documents: [documentSchema],
  },
  { timestamps: true },
);

residentSchema.virtual("age").get(function () {
  return computeAge(this.dateOfBirth);
});

residentSchema.set("toJSON", { virtuals: true });
residentSchema.set("toObject", { virtuals: true });

export type ResidentType = InferSchemaType<typeof residentSchema>;

export const Resident = models.Resident ?? model("Resident", residentSchema);
