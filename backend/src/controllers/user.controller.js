import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";



// ─── Add Staff (Admin only) ───────────────────────────────────
// POST /api/v1/users/add-staff
// Access: Admin only
const addStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, specialization, licenceNumber, department } = req.body;
 
    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "First name, last name, email, password and role are required!",
      });
    }
 
    // Check if staff already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Staff with this email already exists!" });
    }
 
    // Create staff
    const staff = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      specialization,
      licenceNumber,
      department,
      isActive: true,
    });
 
    res.status(201).json({
      message: `${role} added successfully`,
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        specialization: staff.specialization,
        department: staff.department,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
// ─── Login ────────────────────────────────────────────────────
// POST /api/v1/users/login
// Access: Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }
 
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
 
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
 
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin." });
    }
 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
 
    // Update last login
    user.lastLogin = new Date();
    await user.save();
 
    const token = generateToken(user._id);
 
    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        department: user.department,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Logout ───────────────────────────────────────────────────
// POST /api/v1/users/logout
// Access: Protected
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logged out successfully",
      token: null,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { addStaff, loginUser, logoutUser };
 