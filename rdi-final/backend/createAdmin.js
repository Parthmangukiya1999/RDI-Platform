import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const createMentorAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    const existingAdmin = await User.findOne({ email: "mentor@rdi.fi" });
    if (existingAdmin) {
      console.log("Mentor admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("mentor123", 10);

    const adminUser = await User.create({
      name: "Mentor Admin",
      email: "mentor@rdi.fi",
      password: hashedPassword,
      role: "mentor",
    });

    console.log("Mentor admin created successfully");
    console.log("Email:", adminUser.email);
    console.log("Role:", adminUser.role);
    process.exit(0);
  } catch (error) {
    console.error("Error creating mentor admin:", error);
    process.exit(1);
  }
};

createMentorAdmin();