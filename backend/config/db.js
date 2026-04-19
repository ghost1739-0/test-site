import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI env degiskeni tanimli degil.");
    }

    await mongoose.connect(mongoURI);
    console.log("Lüleburgaz Veritabanı Hazır!");
  } catch (error) {
    console.error("MongoDB baglanti hatasi:", error.message);
    process.exit(1);
  }
}
