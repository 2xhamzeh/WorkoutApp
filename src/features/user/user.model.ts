import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  workouts: Schema.Types.ObjectId[];
  week: {
    Monday: Schema.Types.ObjectId | null;
    Tuesday: Schema.Types.ObjectId | null;
    Wednesday: Schema.Types.ObjectId | null;
    Thursday: Schema.Types.ObjectId | null;
    Friday: Schema.Types.ObjectId | null;
    Saturday: Schema.Types.ObjectId | null;
    Sunday: Schema.Types.ObjectId | null;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
  week: {
    Monday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Tuesday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Wednesday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Thursday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Friday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Saturday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
    Sunday: { type: Schema.Types.ObjectId, ref: "Workout", default: null },
  },
});

const User = model<IUser>("User", userSchema);
export default User;
