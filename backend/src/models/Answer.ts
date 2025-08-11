// backend/models/Answer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  userId: mongoose.Types.ObjectId | string;
  step: number;
  questionId: mongoose.Types.ObjectId | string;
  chosenIndex: number;
  isCorrect: boolean;
  createdAt: Date;
}

const AnswerSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  step: { type: Number, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  chosenIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.model<IAnswer>('Answer', AnswerSchema);
