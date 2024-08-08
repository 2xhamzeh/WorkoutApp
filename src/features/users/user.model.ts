import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  workouts: Schema.Types.ObjectId[];
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
});

const User = model<IUser>("User", userSchema);
export default User;
