import { Router } from "express";
import { create, update, remove } from "./workout.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

export default router;
