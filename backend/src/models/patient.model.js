// PATIENT MANAGEMENT
// ============================================================
// Routes:
// POST   /api/v1/patients/register  ← register patient
// GET    /api/v1/patients/all       ← get all patients
// GET    /api/v1/patients/:id       ← get single patient
// PUT    /api/v1/patients/:id       ← update patient
// DELETE /api/v1/patients/:id       ← delete patient (admin only)
// ============================================================


import mongoose from "mongoose";
 
const patientSchema = new mongoose.Schema(
  {
    // ─── Personal Information ───────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
    },
 
    // ─── Medical Information ────────────────────────────────
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: {
      type: [String], // array of allergies
      default: [],
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
 
    // ─── Eye-Specific Information ───────────────────────────
    eyeCondition: {
      type: String,
      trim: true, // e.g., "Myopia", "Glaucoma", "Cataract"
    },
    lastEyeExam: {
      type: Date,
    },
 
    // ─── Emergency Contact ──────────────────────────────────
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
 
    // ─── Tracking ───────────────────────────────────────────
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to staff who registered the patient
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
 
// ─── Virtual: Full Name ─────────────────────────────────────
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
 
// ─── Virtual: Age ───────────────────────────────────────────
patientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});
 
const Patient = mongoose.model("Patient", patientSchema);
 
export default Patient;
 