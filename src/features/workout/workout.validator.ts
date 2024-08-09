import { body } from "express-validator";

const nameValidator = () =>
  body("name")
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("Name must be between 1 and 20 characters")
    .escape();
const exercisesValidator = () =>
  body("exercises")
    .isArray({ min: 1, max: 100 })
    .withMessage(
      "Exercises must be an array with at least 1 and at most 100 items"
    );
const exerciseNameValidator = () =>
  body("exercises.*.name")
    .trim()
    .isString()
    .withMessage("Exercise name must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("Exercise name must be between 1 and 20 characters")
    .escape();
const exerciseSetsValidator = () =>
  body("exercises.*.sets")
    .isInt({ min: 1, max: 100 })
    .withMessage("Sets must be between 1 and 100");
const exerciseRepsValidator = () =>
  body("exercises.*.reps")
    .isInt({ min: 1, max: 100 })
    .withMessage("Reps must be between 1 and 100");
const exerciseBreakBetweenSetsValidator = () =>
  body("exercises.*.breakBetweenSets")
    .isInt({ min: 0, max: 600 }) // 10 minutes
    .withMessage("Break between sets must be between 0 and 600 seconds");
const breakBetweenExercisesValidator = () =>
  body("breakBetweenExercises")
    .isInt({ min: 0, max: 600 }) // 10 minutes
    .withMessage("Break between exercises must be between 0 and 600 seconds");
const workoutIdValidator = () =>
  body("id").isMongoId().withMessage("Workout id is invalid");

export const createWorkoutValidator = [
  nameValidator(),
  exercisesValidator(),
  exerciseNameValidator(),
  exerciseSetsValidator(),
  exerciseRepsValidator(),
  exerciseBreakBetweenSetsValidator(),
  breakBetweenExercisesValidator(),
];

export const updateWorkoutValidator = [...createWorkoutValidator];
