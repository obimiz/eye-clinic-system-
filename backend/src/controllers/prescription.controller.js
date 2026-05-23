import Prescription from "../models/prescription.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
 
// ─── Create Prescription ──────────────────────────────────────
// POST /api/v1/prescriptions/create
// Access: Doctor only
const createPrescription = async (req, res) => {
  try {
    const {
      patient, doctor, appointment,
      rightEye, leftEye, pupillaryDistance,
      prescriptionType, medications,
      diagnosis, notes, followUpDate, expiryDate,
    } = req.body;
 
    // Basic validation
    if (!patient || !doctor || !prescriptionType) {
      return res.status(400).json({
        message: "Patient, doctor and prescription type are required!",
      });
    }
 
    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
 
    // Check if doctor exists
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }
 
    const prescription = await Prescription.create({
      patient,
      doctor,
      appointment,
      rightEye,
      leftEye,
      pupillaryDistance,
      prescriptionType,
      medications,
      diagnosis,
      notes,
      followUpDate,
      expiryDate,
      createdBy: req.user._id,
    });
 
    // Populate details
    await prescription.populate("patient", "firstName lastName phone");
    await prescription.populate("doctor", "firstName lastName specialization");
 
    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Patient Prescriptions ────────────────────────────────
// GET /api/v1/prescriptions/patient/:id
// Access: Protected (any logged in staff)
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type")
      .sort({ createdAt: -1 }); // newest first
 
    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this patient" });
    }
 
    res.status(200).json({
      message: "Prescriptions fetched successfully",
      total: prescriptions.length,
      prescriptions,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Single Prescription ──────────────────────────────────
// GET /api/v1/prescriptions/:id
// Access: Protected (any logged in staff)
const getSinglePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "firstName lastName phone email dateOfBirth")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type")
      .populate("createdBy", "firstName lastName role");
 
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
 
    res.status(200).json({
      message: "Prescription fetched successfully",
      prescription,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid prescription ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Update Prescription ──────────────────────────────────────
// PUT /api/v1/prescriptions/:id
// Access: Doctor only
const updatePrescription = async (req, res) => {
  try {
    const {
      rightEye, leftEye, pupillaryDistance,
      prescriptionType, medications,
      diagnosis, notes, followUpDate,
      expiryDate, status,
    } = req.body;
 
    const updatedData = {
      rightEye, leftEye, pupillaryDistance,
      prescriptionType, medications,
      diagnosis, notes, followUpDate,
      expiryDate, status,
    };
 
    // Remove undefined fields
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );
 
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    )
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization");
 
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
 
    res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid prescription ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export {
  createPrescription,
  getPatientPrescriptions,
  getSinglePrescription,
  updatePrescription,
};