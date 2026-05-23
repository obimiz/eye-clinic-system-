import { Router } from "express";
import { addStaff, loginUser, logoutUser } from "../controllers/user.controller.js";
import { getAllStaff, getSingleStaff, updateStaff, deleteStaff, changeStaffRole, deactivateStaff } from "../controllers/staff.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
// ─── Public routes ────────────────────────────────────────────
router.post("/login", loginUser);
 
// ─── Auth routes ──────────────────────────────────────────────
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});
 
// ─── Admin only — Staff Management ───────────────────────────
router.post("/add-staff", protect, restrictTo("admin"), addStaff);
router.get("/all", protect, restrictTo("admin"), getAllStaff);
router.delete("/:id", protect, restrictTo("admin"), deleteStaff);
router.put("/:id/role", protect, restrictTo("admin"), changeStaffRole);
router.put("/:id/deactivate", protect, restrictTo("admin"), deactivateStaff);
 
// ─── Protected — any logged in staff ─────────────────────────
router.get("/:id", protect, getSingleStaff);
router.put("/:id", protect, updateStaff);
 
export default router;