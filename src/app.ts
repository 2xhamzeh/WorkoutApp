import express from "express";
import userRoutes from "./features/user/user.route";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API Running"));

export default app;
