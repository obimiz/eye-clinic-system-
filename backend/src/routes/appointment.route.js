import { Router } from "express";
import {
  bookAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentsByDoctor,
} from "../controllers/appointment.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
router.post("/book", protect, bookAppointment);
router.get("/all", protect, getAllAppointments);
router.get("/doctor/:id", protect, getAppointmentsByDoctor);
router.get("/:id", protect, getSingleAppointment);
router.put("/:id/status", protect, updateAppointmentStatus);
router.put("/:id/cancel", protect, cancelAppointment);
 
export default router;