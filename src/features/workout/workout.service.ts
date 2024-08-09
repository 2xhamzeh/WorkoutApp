import User from "../user/user.model";
import { CreateWorkoutDTO, UpdateWorkoutDTO } from "./workout.dto";
import Workout, { IWorkout } from "./workout.model";

/**
 * Create a new workout
 * @param {CreateWorkoutDTO} workout - The workout to create
 * @returns {Promise<IWorkout>} The created workout
 */
export const createWorkout = async (
  workout: CreateWorkoutDTO,
  userId: string
): Promise<IWorkout> => {
  const newWorkout = new Workout({
    ...workout,
    user: userId,
  });
  await newWorkout.save();

  // Update the user's workouts array
  await User.findByIdAndUpdate(userId, {
    $push: { workouts: newWorkout._id },
  });

  return newWorkout;
};

/**
 * update a workout
 * @param {string} id - The id of the workout
 * @param {UpdateWorkoutDTO} updates - Object containing the updates
 */
export const updateWorkout = async (
  id: string,
  updates: UpdateWorkoutDTO
): Promise<IWorkout | null> => {
  return Workout.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * Delete a workout
 * @param {string} id - The id of the workout
 * @param {string} userId - The id of the user
 */
export const deleteWorkout = async (
  id: string,
  userId: string
): Promise<IWorkout | null> => {
  // Remove the workout from the user's workouts array
  await User.findByIdAndUpdate(userId, {
    $pull: { workouts: id },
  });
  return Workout.findByIdAndDelete(id);
};

/**
 * Check if a workout belongs to a user
 * @param {string} workoutId - The id of the workout
 * @param {string} userId - The id of the user
 * @returns {Promise<boolean>} True if the workout belongs to the user, false otherwise
 */
export const workoutBelongsToUser = async (
  workoutId: string,
  userId: string
): Promise<boolean> => {
  const workout = await Workout.findById(workoutId);
  return workout?.user.toString() === userId;
};

/**
 * check if a workout exists
 * @param {string} workoutId - The id of the workout
 */
export const workoutExists = async (workoutId: string): Promise<boolean> => {
  return Boolean(await Workout.findById(workoutId));
};
