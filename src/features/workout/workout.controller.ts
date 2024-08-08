import { Response, Request } from "express";
import {
  createWorkout,
  updateWorkout,
  deleteWorkout,
  workoutBelongsToUser,
} from "./workout.service";
import { CreateWorkoutDTO, UpdateWorkoutDTO, WorkoutDTO } from "./workout.dto";
import { IWorkout } from "./workout.model";
import { ErrorType } from "../../utils/error.type";

/**
 * Create a new workout
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const create = async (
  req: Request<{}, {}, CreateWorkoutDTO>,
  res: Response<WorkoutDTO | ErrorType>
) => {
  try {
    const newWorkout = await createWorkout(req.body, req.userId as string);
    res.status(201).json(workoutToDTO(newWorkout));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Update a workout
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const update = async (
  req: Request<{ id: string }, {}, UpdateWorkoutDTO>,
  res: Response<WorkoutDTO | ErrorType>
) => {
  try {
    const allowed = await workoutBelongsToUser(
      req.params.id,
      req.userId as string
    );
    if (!allowed) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this workout" });
    }
    const updatedWorkout = await updateWorkout(req.params.id, req.body);
    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json(workoutToDTO(updatedWorkout));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Delete a workout
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const remove = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<WorkoutDTO | ErrorType>
) => {
  try {
    const allowed = await workoutBelongsToUser(
      req.params.id,
      req.userId as string
    );
    if (!allowed) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this workout" });
    }
    const deletedWorkout = await deleteWorkout(
      req.params.id,
      req.userId as string
    );
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json(workoutToDTO(deletedWorkout));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

const workoutToDTO = (workout: IWorkout): WorkoutDTO => {
  return {
    id: workout._id,
    name: workout.name,
    user: workout.user.toString(),
    exercises: workout.exercises,
    breakBetweenExercises: workout.breakBetweenExercises,
  };
};
