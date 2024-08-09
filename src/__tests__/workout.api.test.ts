import request from "supertest";
import app from "../app";
import dotenv from "dotenv";
import { CreateWorkoutDTO, WorkoutDTO } from "../features/workout/workout.dto";
import { CreateUserDTO, UserDTO } from "../features/user/user.dto";
import Workout from "../features/workout/workout.model";
import { workoutToDTO } from "../features/workout/workout.controller";
import User from "../features/user/user.model";
import { userToDTO } from "../features/user/user.controller";
import jwt from "jsonwebtoken";

dotenv.config();

describe("Workout API", () => {
  let token: string;
  let workout1Data: WorkoutDTO;
  let workout2Data: WorkoutDTO;
  let deletedWorkoutData: WorkoutDTO;
  let user1Data: UserDTO;
  let user2Data: UserDTO;
  beforeAll(async () => {
    user1Data = userToDTO(
      await User.create({
        name: "John Smith",
        email: "smith@example.com",
        password: "password123",
      })
    );
    user2Data = userToDTO(
      await User.create({
        name: "James Talon",
        email: "talon@example.com",
        password: "password123",
      })
    );
    workout1Data = workoutToDTO(
      await Workout.create({
        name: "Workout 1",
        user: user1Data.id,
        exercises: [
          {
            name: "Exercise 1",
            sets: 3,
            reps: 10,
            breakBetweenSets: 60,
          },
        ],
        breakBetweenExercises: 120,
      })
    );
    workout2Data = workoutToDTO(
      await Workout.create({
        name: "Workout 2",
        user: user2Data.id,
        exercises: [
          {
            name: "Exercise 2",
            sets: 3,
            reps: 10,
            breakBetweenSets: 60,
          },
        ],
        breakBetweenExercises: 120,
      })
    );
    deletedWorkoutData = workoutToDTO(
      await Workout.create({
        name: "Workout 2",
        user: user1Data.id,
        exercises: [
          {
            name: "Exercise 2",
            sets: 3,
            reps: 10,
            breakBetweenSets: 60,
          },
        ],
        breakBetweenExercises: 120,
      })
    );
    await Workout.findByIdAndDelete(deletedWorkoutData.id);
    await User.findByIdAndUpdate(user1Data.id, { workouts: [workout1Data.id] });
    await User.findByIdAndUpdate(user2Data.id, { workouts: [workout2Data.id] });

    token = jwt.sign(
      { userId: user1Data.id },
      process.env.JWT_SECRET as string
    );
  });

  afterAll(async () => {
    await User.findByIdAndDelete(user1Data.id);
    await User.findByIdAndDelete(user2Data.id);
    await Workout.findByIdAndDelete(workout1Data.id);
    await Workout.findByIdAndDelete(workout2Data.id);
  });

  let workoutData: CreateWorkoutDTO = {
    name: "New Workout",
    exercises: [
      {
        name: "New Exercise",
        sets: 3,
        reps: 10,
        breakBetweenSets: 60,
      },
    ],
    breakBetweenExercises: 120,
  };

  describe("POST /workouts", () => {
    it("should create a workout", async () => {
      const res = await request(app)
        .post("/api/workouts")
        .send(workoutData)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });

    it("should not create a workout with invalid data", async () => {
      const res = await request(app)
        .post("/api/workouts")
        .send({ hello: "name not provided" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid data");
    });
  });

  describe("PUT /workouts/:id", () => {
    it("should update a workout", async () => {
      const res = await request(app)
        .put(`/api/workouts/${workout1Data.id}`)
        .send({ ...workoutData, name: "Updated Workout Name" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Updated Workout Name");
    });

    it("should not update a workout that does not exist", async () => {
      const res = await request(app)
        .put(`/api/workouts/${deletedWorkoutData.id}`)
        .send({ ...workoutData, name: "Updated Workout" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Workout not found");
    });

    it("should not update a workout that does not belong to the user", async () => {
      const res = await request(app)
        .put(`/api/workouts/${workout2Data.id}`)
        .send({ ...workoutData, name: "Updated Workout" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "You are not allowed to update this workout"
      );
    });
    it("should not update a workout with invalid data", async () => {
      const res = await request(app)
        .put(`/api/workouts/${workout1Data.id}`)
        .send({ hello: "name not provided" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid data");
    });
  });

  describe("DELETE /workouts/:id", () => {
    it("should delete a workout", async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workout1Data.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", workout1Data.id.toString());
    });

    it("should not delete a workout that does not exist", async () => {
      const res = await request(app)
        .delete(`/api/workouts/${deletedWorkoutData.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Workout not found");
    });

    it("should not delete a workout that does not belong to the user", async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workout2Data.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "You are not allowed to delete this workout"
      );
    });
  });
});
