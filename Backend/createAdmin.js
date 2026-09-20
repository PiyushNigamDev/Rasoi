import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL);

    // Hash admin password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@rasoi.com" },
      {
        name: "Admin",
        email: "admin@rasoi.com",
        password: hashedPassword,
        role: "admin",
      },
      { returnDocument: "after", upsert: true, runValidators: true }
    );                       

    console.log("Admin account is ready");
    console.log("Email:", admin.email);

    process.exit();
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();