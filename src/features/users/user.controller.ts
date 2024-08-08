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
import { CreateUserDTO, loginUserDTO, UpdateUserDTO } from "./user.dto";
import { AuthRequest } from "../../middleware/auth.middleware";
import { validationResult } from "express-validator";

/**
 * Register a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const register = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    const userExists = await findUserByEmail(userData.email);
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
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
  try {
    const userData: loginUserDTO = req.body;
    if (!userData || !userData.email || !userData.password) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const user = await findUserByEmail(userData.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await validatePassword(
      userData.password,
      user.password
    );
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
    const user = await findUserById(userId);
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
  try {
    const userId: string = req.userId as string;
    const updates: UpdateUserDTO = req.body;
    if (!updates || (!updates.email && !updates.name && !updates.password)) {
      return res.status(400).json({ message: "Invalid data" });
    }
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
