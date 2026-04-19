import mongoose from "mongoose";

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  await mongoose.connect(mongoURI);
  const dbName = mongoose.connection.name;
  console.log(`MongoDB connected successfully. Database: ${dbName}`);
}
