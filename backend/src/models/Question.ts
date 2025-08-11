import mongoose, {Schema, Document} from 'mongoose';

export interface IQuestion extends Document {
  competency: string;
  level: string;
  text: string;
  options: string[];
  correctIndex: number;
}

const QuestionSchema: Schema = new Schema({
  competency: {type: String, required: true},
  level: {type: String, required: true},
  text: {type: String, required: true},
  options: {type: [String], required: true},
  correctIndex: {type: Number, required: true}
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
