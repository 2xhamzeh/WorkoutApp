import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  validatePassword,
  updateUser,
  findUserById,
  deleteUser,
} from "./user.service";
import {
  CreateUserDTO,
  loginUserDTO,
  UpdateUserDTO,
  UserDTO,
} from "./user.dto";
import { IUser } from "./user.model";
import { ErrorType } from "../../utils/error.type";

/**
 * Register a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const register = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response<UserDTO | ErrorType>
) => {
  try {
    const userExists = await findUserByEmail(req.body.email);
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const user = await createUser(req.body);
    res.status(201).json(userToDTO(user));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Login a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const login = async (
  req: Request<{}, {}, loginUserDTO>,
  res: Response<UserDTO | ErrorType>
) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await validatePassword(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json(userToDTO(user));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Get a user by ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const getUser = async (
  req: Request,
  res: Response<UserDTO | ErrorType>
) => {
  try {
    const user = await findUserById(req.userId as string);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userToDTO(user));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Update a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const update = async (
  req: Request<{}, {}, UpdateUserDTO>,
  res: Response<UserDTO | ErrorType>
) => {
  if (!req.body.email && !req.body.name && !req.body.password) {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const user = await updateUser(req.userId as string, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userToDTO(user));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Delete a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const remove = async (
  req: Request,
  res: Response<UserDTO | ErrorType>
) => {
  try {
    const user = await deleteUser(req.userId as string);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userToDTO(user));
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

/**
 * Transform IUser to UserDTO
 * @param {IUser} user - The user object
 * @returns {UserDTO} The transformed user object
 */
export const userToDTO = (user: IUser): UserDTO => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    workouts: user.workouts.map((workout) => workout.toString()),
    week: {
      Monday: user.week.Monday?.toString() || null,
      Tuesday: user.week.Tuesday?.toString() || null,
      Wednesday: user.week.Wednesday?.toString() || null,
      Thursday: user.week.Thursday?.toString() || null,
      Friday: user.week.Friday?.toString() || null,
      Saturday: user.week.Saturday?.toString() || null,
      Sunday: user.week.Sunday?.toString() || null,
    },
  };
};
