import { Schema, model, Document } from "mongoose";

export interface IWorkout extends Document {
  name: string;
  user: Schema.Types.ObjectId;
  exercises: Schema.Types.ObjectId[];
  breakBetweenExercises: number; // in seconds
}

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exercises: [
    { type: Schema.Types.ObjectId, ref: "ExerciseInstance", required: true },
  ],
  breakBetweenExercises: { type: Number, required: true },
});

const Workout = model<IWorkout>("Workout", workoutSchema);

export default Workout;
