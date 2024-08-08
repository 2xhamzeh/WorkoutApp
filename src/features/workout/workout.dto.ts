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

export type UpdateWorkoutDTO = Partial<CreateWorkoutDTO>;

export type WorkoutDTO = CreateWorkoutDTO & {
  id: string;
  user: string;
};
