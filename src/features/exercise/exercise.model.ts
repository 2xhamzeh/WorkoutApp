import { Schema, model, Document } from "mongoose";

export interface IExercise extends Document {
  name: string;
  sets: number;
  reps: number;
  breakBetweenSets: number; // in seconds
}

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  breakBetweenSets: { type: Number, required: true },
});

const Exercise = model<IExercise>("Exercise", exerciseSchema);

export default Exercise;
