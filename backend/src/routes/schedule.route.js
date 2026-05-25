import { Router } from "express";
import {
  setDoctorSchedule,
  getDoctorSchedule,
  addDayOff,
  getAllSchedules,
} from "../controllers/schedule.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/set", protect, restrictTo("admin"), setDoctorSchedule);
router.get("/all", protect, getAllSchedules);
router.get("/:doctorId", protect, getDoctorSchedule);
router.post("/:doctorId/day-off", protect, restrictTo("admin"), addDayOff);

export default router;