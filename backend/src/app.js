import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import patientRouter from "./routes/patient.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import authRouter from "./routes/auth.route.js";
import scheduleRouter from "./routes/schedule.route.js";
import reminderRouter from "./routes/reminder.route.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
 
const app = express();
 
// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter); // apply to all routes
 
// ─── Routes ───────────────────────────────────────────────────
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/prescriptions", prescriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/schedule", scheduleRouter);
app.use("/api/v1/reminders", reminderRouter);
 
// ─── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Eye Clinic API is running ✅" });
});
 
export default app;
 