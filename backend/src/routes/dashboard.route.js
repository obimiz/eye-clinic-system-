import { Router } from "express";
import { getDashboardStats, getRecentActivity } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
router.get("/stats", protect, getDashboardStats);
router.get("/recent", protect, getRecentActivity);
 
export default router;
 