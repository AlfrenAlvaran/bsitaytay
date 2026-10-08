import "server-only";
import { Schema, model, models } from "mongoose";

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
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    phone: String,
    address: String,
    dateOfBirth: Date,
    profileImageUrl: String,
    profileImagePublicId: String,
    documents: [documentSchema],
  },
  { timestamps: true },
);

export const Resident = models.Resident ?? model("Resident", residentSchema);
