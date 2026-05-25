// Password reset, change password, refresh token
 
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import { passwordResetEmail } from "../utils/emailTemplates.js";
import jwt from "jsonwebtoken";
 
// ─── Forgot Password ──────────────────────────────────────────
// POST /api/v1/auth/forgot-password
// Access: Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
 
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }
 
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
 
    // Hash token before saving
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
 
    // Expires in 10 minutes
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
 
    // Send email
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 
    await sendEmail({
      to: user.email,
      subject: "EyeClinic — Password Reset Request",
      html: passwordResetEmail(user.firstName, resetURL),
    });
 
    res.status(200).json({
      message: "Password reset link sent to your email",
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Reset Password ───────────────────────────────────────────
// POST /api/v1/auth/reset-password/:token
// Access: Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
 
    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }
 
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
 
    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
 
    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() },
    });
 
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
 
    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
 
    res.status(200).json({ message: "Password reset successfully. Please log in." });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Change Password ──────────────────────────────────────────
// POST /api/v1/auth/change-password
// Access: Protected (logged in user)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
 
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
 
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
 
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }
 
    // Get user with password
    const user = await User.findById(req.user._id).select("+password");
 
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
 
    // Update password
    user.password = newPassword;
    await user.save();
 
    // Generate new tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
 
    res.status(200).json({
      message: "Password changed successfully",
      token,
      refreshToken,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Refresh Token ────────────────────────────────────────────
// POST /api/v1/auth/refresh-token
// Access: Public (with refresh token)
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
 
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }
 
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
 
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
 
    // Generate new access token
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
 
    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
      refreshToken: newRefreshToken,
    });
 
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired. Please log in again." });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { forgotPassword, resetPassword, changePassword, refreshToken };
 
 