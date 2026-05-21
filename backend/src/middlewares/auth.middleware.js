import jwt from "jsonwebtoken";
import User from "../models/user.model.js";



// ─── Protect Route — checks if user is logged in ─────────────
const protect = async (req, res, next) => {
  try {
    let token;
 
    // Check if token is in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
 
    // No token found
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided. Please log in.",
      });
    }
 
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    // Find user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }
 
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Your account has been deactivated. Contact admin.",
      });
    }
 
    // Attach user to request
    req.user = user;
    next();
 
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
// ─── Restrict to Roles — checks if user has permission ───────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(", ")} can do this.`,
      });
    }
    next();
  };
};
 
export { protect, restrictTo };

