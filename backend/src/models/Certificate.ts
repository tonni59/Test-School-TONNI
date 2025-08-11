// backend/models/Certificate.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId | string;
  level: string;
  certUrl: string;
  lifetime: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, required: true },
  certUrl: { type: String, required: true },
  lifetime: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
