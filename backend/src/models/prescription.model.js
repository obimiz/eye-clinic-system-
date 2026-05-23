// ============================================================
// PRESCRIPTIONS MANAGEMENT
// ============================================================
// Routes:
// POST   /api/v1/prescriptions/create         ← create prescription
// GET    /api/v1/prescriptions/patient/:id    ← get patient prescriptions
// GET    /api/v1/prescriptions/:id            ← get single prescription
// PUT    /api/v1/prescriptions/:id            ← update prescription
// ============================================================
 
import mongoose from "mongoose";
 
const prescriptionSchema = new mongoose.Schema(
  {
    // ─── Patient & Doctor ────────────────────────────────────
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // optional — links to an appointment
    },
 
    // ─── Eye Measurements ────────────────────────────────────
    rightEye: {
      sphere: { type: Number },       // e.g., -2.50
      cylinder: { type: Number },     // e.g., -0.75
      axis: { type: Number },         // e.g., 180
      add: { type: Number },          // for reading glasses
      vision: { type: String },       // e.g., "6/6", "6/9"
    },
    leftEye: {
      sphere: { type: Number },
      cylinder: { type: Number },
      axis: { type: Number },
      add: { type: Number },
      vision: { type: String },
    },
 
    // ─── Prescription Details ────────────────────────────────
    pupillaryDistance: {
      type: Number, // distance between pupils in mm
    },
    prescriptionType: {
      type: String,
      enum: [
        "glasses",
        "contact_lens",
        "both",
        "medication",
      ],
      required: [true, "Prescription type is required"],
      default: "glasses",
    },
 
    // ─── Medication (if any) ─────────────────────────────────
    medications: [
      {
        name: { type: String, trim: true },
        dosage: { type: String, trim: true },       // e.g., "1 drop"
        frequency: { type: String, trim: true },    // e.g., "3 times daily"
        duration: { type: String, trim: true },     // e.g., "2 weeks"
        instructions: { type: String, trim: true }, // e.g., "Apply before bed"
      },
    ],
 
    // ─── Notes & Follow Up ───────────────────────────────────
    diagnosis: {
      type: String,
      trim: true, // e.g., "Myopia", "Astigmatism", "Glaucoma"
    },
    notes: {
      type: String,
      trim: true,
    },
    followUpDate: {
      type: Date, // next appointment date
    },
 
    // ─── Status ──────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    expiryDate: {
      type: Date, // prescription valid until
    },
 
    // ─── Tracking ────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
 
const Prescription = mongoose.model("Prescription", prescriptionSchema);
 
export default Prescription;