// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'admin' | 'student' | 'supervisor';
  verified?: boolean;
  refreshToken?: string;
  profilePhoto?: string;
  completedSteps?: number[]; // <-- NEW: tracks completed step numbers (e.g. [1,2])
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student', 'supervisor'], default: 'student' },
    verified: { type: Boolean, default: false },
    refreshToken: { type: String },
    profilePhoto: { type: String },
    completedSteps: { type: [Number], default: [] }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
