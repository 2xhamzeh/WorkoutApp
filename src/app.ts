import express from "express";
import userRoutes from "./features/user/user.route";
import workoutRoutes from "./features/workout/workout.route";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

app.get("/", (req, res) => res.send("API Running"));

export default app;
