// backend/src/models/Result.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  step: number;
  total: number;
  correct: number;
  percent: number;
  certificateLevel: string;
  certUrl?: string;      // ✅ new
  emailSent?: boolean;   // ✅ new
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    step: { type: Number, required: true },
    total: { type: Number, required: true },
    correct: { type: Number, required: true },
    percent: { type: Number, required: true },
    certificateLevel: { type: String, required: true },
    certUrl: { type: String },        // ✅ new
    emailSent: { type: Boolean, default: false }, // ✅ new
  },
  { timestamps: true }
);

export default mongoose.model<IResult>("Result", ResultSchema);
