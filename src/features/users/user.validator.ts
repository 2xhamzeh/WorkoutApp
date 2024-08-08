import { body } from "express-validator";

const emailValidator = () =>
  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail();
const passwordValidator = () =>
  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .escape();
const nameValidator = () =>
  body("name")
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("Name must be between 1 and 20 characters")
    .escape();

export const createUserValidator = [
  emailValidator(),
  passwordValidator(),
  nameValidator(),
];

export const updateUserValidator = [
  emailValidator().optional(),
  passwordValidator().optional(),
  nameValidator().optional(),
];

export const loginValidator = [emailValidator(), passwordValidator()];
