import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  validatePassword,
  updateUser,
  getUserById,
  deleteUser,
} from "./user.service";
import { CreateUserDTO, UpdateUserDTO } from "./user.dto";
import { AuthRequest } from "../../middleware/auth.middleware";

/**
 * Register a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const register = async (req: Request, res: Response) => {
  const userData: CreateUserDTO = req.body;
  try {
    const userExists = await findUserByEmail(userData.email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await createUser(userData);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Login a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get a user by ID
 * @param {AuthRequest} req - The request object
 * @param {Response} res - The response object
 */
export const getUser = async (req: AuthRequest, res: Response) => {
  const userId: string = req.userId as string;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a user
 * @param {AuthRequest} req - The request object
 * @param {Response} res - The response object
 */
export const update = async (req: AuthRequest, res: Response) => {
  const userId: string = req.userId as string;
  const updates: UpdateUserDTO = req.body;
  try {
    const user = await updateUser(userId, updates);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Delete a user
 * @param {AuthRequest} req - The request object
 * @param {Response} res - The response object
 */
export const remove = async (req: AuthRequest, res: Response) => {
  const userId: string = req.userId as string;
  try {
    const user = await deleteUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
