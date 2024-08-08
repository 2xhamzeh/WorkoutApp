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

export const updateUserValidator = [
  body("email").optional().trim().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .escape(),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
];
