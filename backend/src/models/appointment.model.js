// ============================================================
// APPOINTMENTS MANAGEMENT
// ============================================================
// Routes:
// POST   /api/v1/appointments/book          ← book appointment
// GET    /api/v1/appointments/all           ← get all appointments
// GET    /api/v1/appointments/:id           ← get single appointment
// PUT    /api/v1/appointments/:id/status    ← update appointment status
// PUT    /api/v1/appointments/:id/cancel    ← cancel appointment
// GET    /api/v1/appointments/doctor/:id    ← get appointments by doctor
// ============================================================


import mongoose from "mongoose";
 
const appointmentSchema = new mongoose.Schema(
  {
    // ─── Patient ────────────────────────────────────────────
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },
 
    // ─── Doctor ─────────────────────────────────────────────
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
 
    // ─── Appointment Details ─────────────────────────────────
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
      // e.g., "10:00 AM", "02:30 PM"
    },
    type: {
      type: String,
      enum: [
        "consultation",
        "eye_exam",
        "follow_up",
        "surgery",
        "glasses_fitting",
        "contact_lens",
        "emergency",
      ],
      required: [true, "Appointment type is required"],
      default: "consultation",
    },
 
    // ─── Status ──────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no_show"],
      default: "pending",
    },
 
    // ─── Notes ───────────────────────────────────────────────
    reasonForVisit: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true, // doctor's notes after appointment
    },
 
    // ─── Cancellation ────────────────────────────────────────
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
 
    // ─── Tracking ────────────────────────────────────────────
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // staff who booked the appointment
    },
  },
  {
    timestamps: true,
  }
);
 
const Appointment = mongoose.model("Appointment", appointmentSchema);
 
export default Appointment;
 
 