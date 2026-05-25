import { Router } from "express";
import {
  sendAppointmentReminder,
  sendBulkReminders,
} from "../controllers/reminder.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/appointment/:id", protect, restrictTo("admin", "receptionist"), sendAppointmentReminder);
router.post("/bulk", protect, restrictTo("admin"), sendBulkReminders);

export default router;