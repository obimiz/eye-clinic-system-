import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
 
// ─── Register ────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
 
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
 
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists!" });
    }
 
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
    });
 
    const token = generateToken(user._id);
 
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
// ─── Login ───────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }
 
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
 
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 
    user.lastLogin = new Date();
    await user.save();
 
    const token = generateToken(user._id);
 
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Logout ──────────────────────────────────────────────────
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "User logged out successfully",
      token: null,  // tells frontend to delete the token
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { registerUser, loginUser, logoutUser };
 