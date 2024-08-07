import express from "express";
import userRoutes from "./features/users/user.routes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API Running"));

export default app;
