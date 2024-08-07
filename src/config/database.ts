import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // this will make sure the app stops running when database connection isn't successful
  }
};

export default connectDB;
