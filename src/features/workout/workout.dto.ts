export type CreateWorkoutDTO = {
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    breakBetweenSets: number;
  }[];
  breakBetweenExercises: number;
};

export type UpdateWorkoutDTO = CreateWorkoutDTO;

export type WorkoutDTO = CreateWorkoutDTO & {
  id: string;
  user: string;
};
