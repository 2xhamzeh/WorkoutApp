import bcrypt from "bcryptjs";
import User, { IUser } from "./user.model";
import { CreateUserDTO, UpdateUserDTO } from "./user.dto";

/**
 * Create a new user
 * @param  {CreateUserDTO} userFields - The user data
 * @returns {Promise<IUser>} The created user
 */
export const createUser = async (userFields: CreateUserDTO): Promise<IUser> => {
  const { name, email, password } = userFields;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return newUser;
};

/**
 * Find user by email
 * @param {string} email - The email of the user
 * @returns {Promise<IUser | null>} The user document or null if not found
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

/**
 * Validate user password
 * @param {string} password - The password to validate
 * @param {string} hashedPassword - The hashed password stored in the database
 * @returns {Promise<boolean>} True if the password is valid, false otherwise
 */
export const validatePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Update a user
 * @param {string} id - The id of the user
 * @param {UpdateUserDTO} updates - Object containing the updates
 * @returns {Promise<IUser | null>} The updated user or null if not found
 */
export const updateUser = async (
  id: string,
  updates: UpdateUserDTO
): Promise<IUser | null> => {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  return User.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * Delete a user
 * @param {string} id - The id of the user
 * @returns {Promise<IUser | null>} The deleted user or null if not found
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id);
};

/**
 * Get a user by id
 * @param {string} id - The id of the user
 * @returns {Promise<IUser | null>} The user document or null if not found
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};
