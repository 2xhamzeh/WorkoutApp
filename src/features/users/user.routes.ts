import { Router } from "express";
import { register, login, update, getUser, remove } from "./user.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", authMiddleware, update);
router.delete("/delete", authMiddleware, remove);
router.get("/", authMiddleware, getUser);

export default router;
