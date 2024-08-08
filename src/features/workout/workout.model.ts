import { Schema, model, Document } from "mongoose";

export interface IWorkout extends Document {
  name: string;
  user: Schema.Types.ObjectId;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    breakBetweenSets: number; // in seconds
  }[];
  breakBetweenExercises: number; // in seconds
}

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      breakBetweenSets: { type: Number, required: true },
    },
  ],
  breakBetweenExercises: { type: Number, required: true },
});

const Workout = model<IWorkout>("Workout", workoutSchema);

export default Workout;
