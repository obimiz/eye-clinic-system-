import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { loginLimiter, resetLimiter } from "../middlewares/rateLimiter.middleware.js";
 
const router = Router();
 
router.post("/forgot-password", resetLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/refresh-token", loginLimiter, refreshToken);
 
export default router;