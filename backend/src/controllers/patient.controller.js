import Patient from "../models/patient.model.js";
 
// ─── Register Patient ─────────────────────────────────────────
// POST /api/v1/patients/register
// Access: Protected (any logged in staff)
const registerPatient = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      dateOfBirth, gender, address, bloodGroup,
      allergies, medicalHistory, eyeCondition,
      emergencyContact,
    } = req.body;
 
    // Basic validation
    if (!firstName || !lastName || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({
        message: "First name, last name, phone, date of birth and gender are required!",
      });
    }
 
    // Check if patient already exists by phone
    const existing = await Patient.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Patient with this phone number already exists!" });
    }
 
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      eyeCondition,
      emergencyContact,
      registeredBy: req.user._id, // logged in staff
    });
 
    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get All Patients ─────────────────────────────────────────
// GET /api/v1/patients/all
// Access: Protected (any logged in staff)
const getAllPatients = async (req, res) => {
  try {
    const { search } = req.query; // get search term from URL
 
    // Build search filter
    let filter = { isActive: true };
 
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },  // case insensitive
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { eyeCondition: { $regex: search, $options: "i" } },
      ];
    }
 
    const patients = await Patient.find(filter)
      .populate("registeredBy", "firstName lastName role")
      .sort({ createdAt: -1 });
 
    res.status(200).json({
      message: "Patients fetched successfully",
      total: patients.length,
      patients,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



 
// ─── Get Single Patient ───────────────────────────────────────
// GET /api/v1/patients/:id
// Access: Protected (any logged in staff)
const getSinglePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("registeredBy", "firstName lastName role");
 
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
 
    res.status(200).json({
      message: "Patient fetched successfully",
      patient,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Update Patient ───────────────────────────────────────────
// PUT /api/v1/patients/:id
// Access: Protected (any logged in staff)
const updatePatient = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      dateOfBirth, gender, address, bloodGroup,
      allergies, medicalHistory, eyeCondition,
      lastEyeExam, emergencyContact,
    } = req.body;
 
    // Fields allowed to update
    const updatedData = {
      firstName, lastName, email, phone,
      dateOfBirth, gender, address, bloodGroup,
      allergies, medicalHistory, eyeCondition,
      lastEyeExam, emergencyContact,
    };
 
    // Remove undefined fields
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );
 
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
 
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
 
    res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Delete Patient ───────────────────────────────────────────
// DELETE /api/v1/patients/:id
// Access: Admin only
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
 
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
 
    res.status(200).json({
      message: "Patient deleted successfully",
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getPatientByName = async (req, res) => {
  try {
    const { name } = req.params;
 
    if (!name) {
      return res.status(400).json({ message: "Please provide a name to search" });
    }
 
    // Split name in case full name is provided e.g "John Doe"
    const nameParts = name.trim().split(" ");
 
    let filter;
 
    if (nameParts.length === 1) {
      // Single word — search both firstName and lastName
      filter = {
        $or: [
          { firstName: { $regex: nameParts[0], $options: "i" } },
          { lastName: { $regex: nameParts[0], $options: "i" } },
        ],
      };
    } else {
      // Full name provided — search firstName and lastName together
      filter = {
        $and: [
          { firstName: { $regex: nameParts[0], $options: "i" } },
          { lastName: { $regex: nameParts[1], $options: "i" } },
        ],
      };
    }
 
    const patients = await Patient.find(filter)
      .populate("registeredBy", "firstName lastName role");
 
    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found with that name" });
    }
 
    res.status(200).json({
      message: "Patients fetched successfully",
      total: patients.length,
      patients,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
 
export { registerPatient, getAllPatients, getSinglePatient, updatePatient, deletePatient, getPatientByName };