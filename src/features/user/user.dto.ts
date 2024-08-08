export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

export type loginUserDTO = {
  email: string;
  password: string;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  workouts: string[];
  week: {
    Monday: string | null;
    Tuesday: string | null;
    Wednesday: string | null;
    Thursday: string | null;
    Friday: string | null;
    Saturday: string | null;
    Sunday: string | null;
  };
};
