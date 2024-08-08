import { body } from "express-validator";

export const createUserValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
  body("name").trim().isString().withMessage("Name must be a string").escape(),
];
