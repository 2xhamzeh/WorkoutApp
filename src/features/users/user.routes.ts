import { Router } from "express";
import { register, login, update, getUser, remove } from "./user.controller";
import authMiddleware from "../../middleware/auth.middleware";
import {
  createUserValidator,
  loginValidator,
  updateUserValidator,
} from "./user.validator";
import { validateRequest } from "../../middleware/validate.middleware";

const router = Router();

router.post("/register", validateRequest(createUserValidator), register);
router.post("/login", validateRequest(loginValidator), login);
router.put(
  "/update",
  authMiddleware,
  validateRequest(updateUserValidator),
  update
);
router.delete("/delete", authMiddleware, remove);
router.get("/", authMiddleware, getUser);

export default router;
