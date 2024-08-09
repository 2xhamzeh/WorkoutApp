import { Router } from "express";
import { create, update, remove } from "./workout.controller";
import authMiddleware from "../../middleware/auth.middleware";
import {
  createWorkoutValidator,
  updateWorkoutValidator,
} from "./workout.validator";
import { validateRequest } from "../../middleware/validate.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(createWorkoutValidator),
  create
);
router.put(
  "/:id",
  authMiddleware,
  validateRequest(updateWorkoutValidator),
  update
);
router.delete("/:id", authMiddleware, remove);

export default router;
