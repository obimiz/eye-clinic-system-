import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { getAllStaff, getSingleStaff, updateStaff, deleteStaff, changeStaffRole } from "../controllers/staff.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
// ─── Public routes ────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);
 
// ─── Auth routes ──────────────────────────────────────────────
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});
 
// ─── Staff Management routes ──────────────────────────────────
router.get("/all", protect, restrictTo("admin"), getAllStaff);
router.get("/:id", protect, getSingleStaff);
router.put("/:id", protect, updateStaff);
router.delete("/:id", protect, restrictTo("admin"), deleteStaff);
router.put("/:id/role", protect, restrictTo("admin"), changeStaffRole);
 
export default router;
 