import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question";
import questionsData from "./questions_seed.json";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");

    await Question.deleteMany({});
    console.log("Old questions removed");

    await Question.insertMany(questionsData);
    console.log(`${questionsData.length} questions inserted`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
