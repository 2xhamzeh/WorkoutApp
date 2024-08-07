import dotenv from "dotenv";
import connectDB from "./config/database";
import app from "./app";
// load environment variables from a .env file
dotenv.config();

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

