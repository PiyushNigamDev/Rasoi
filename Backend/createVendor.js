import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const [, , email, name, password] = process.argv;

if (!email || !name || !password) {
  console.error("Usage: node createVendor.js <email> <name> <password>");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_DB_URL);
  const hashedPassword = await bcrypt.hash(password, 12);
  const vendor = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { name, email: email.trim().toLowerCase(), password: hashedPassword, role: "vendor" },
    { returnDocument: "after", upsert: true, runValidators: true }
  );
  console.log(`Vendor account ready: ${vendor.email}`);
} catch (error) {
  console.error("Error:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();    
}
