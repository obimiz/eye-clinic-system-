// This creates the first admin account
// Run ONCE with: node src/seed/admin.seed.js
// Delete or disable after running
// ============================================================
 
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
 
dotenv.config({ path: "./.env" });
 
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected...");
 
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log(`Email: ${existingAdmin.email}`);
      process.exit(0);
    }
 
    // Create first admin
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@eyeclinic.com",
      password: "Admin1234",
      role: "admin",
      isActive: true,
    });
 
    console.log("✅ Admin created successfully!");
    console.log("─────────────────────────────────");
    console.log(`Name    : ${admin.firstName} ${admin.lastName}`);
    console.log(`Email   : ${admin.email}`);
    console.log(`Password: Admin1234`);
    console.log(`Role    : ${admin.role}`);
    console.log("─────────────────────────────────");
    console.log("Use these credentials to log in.");
    console.log("Change your password after first login!");
 
    process.exit(0);
 
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};
 
seedAdmin();