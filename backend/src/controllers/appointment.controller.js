import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
 
// ─── Book Appointment ─────────────────────────────────────────
// POST /api/v1/appointments/book
// Access: Protected (any logged in staff)
const bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, type, reasonForVisit, notes } = req.body;
 
    // Basic validation
    if (!patient || !doctor || !date || !time || !type) {
      return res.status(400).json({
        message: "Patient, doctor, date, time and type are required!",
      });
    }
 
    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
 
    // Check if doctor exists and is actually a doctor
    const doctorExists = await User.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (doctorExists.role !== "doctor") {
      return res.status(400).json({ message: "Selected staff is not a doctor" });
    }
 
    // Check if doctor already has an appointment at same date and time
    const conflict = await Appointment.findOne({
      doctor,
      date: new Date(date),
      time,
      status: { $nin: ["cancelled"] }, // ignore cancelled appointments
    });
    if (conflict) {
      return res.status(400).json({
        message: "Doctor already has an appointment at this date and time",
      });
    }
 
    const appointment = await Appointment.create({
      patient,
      doctor,
      date: new Date(date),
      time,
      type,
      reasonForVisit,
      notes,
      bookedBy: req.user._id,
    });
 
    // Populate patient and doctor details
    await appointment.populate("patient", "firstName lastName phone");
    await appointment.populate("doctor", "firstName lastName specialization");
    await appointment.populate("bookedBy", "firstName lastName role");
 
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get All Appointments ─────────────────────────────────────
// GET /api/v1/appointments/all
// Access: Protected (any logged in staff)
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, search } = req.query;
 
    let filter = {};
 
    // Filter by status
    if (status) filter.status = status;
 
    // Filter by date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
 
    const appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName phone email")
      .populate("doctor", "firstName lastName specialization")
      .populate("bookedBy", "firstName lastName role")
      .sort({ date: 1, time: 1 }); // sort by date and time
 
    res.status(200).json({
      message: "Appointments fetched successfully",
      total: appointments.length,
      appointments,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Single Appointment ───────────────────────────────────
// GET /api/v1/appointments/:id
// Access: Protected (any logged in staff)
const getSingleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstName lastName phone email eyeCondition")
      .populate("doctor", "firstName lastName specialization")
      .populate("bookedBy", "firstName lastName role")
      .populate("cancelledBy", "firstName lastName role");
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    res.status(200).json({
      message: "Appointment fetched successfully",
      appointment,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Update Appointment Status ────────────────────────────────
// PUT /api/v1/appointments/:id/status
// Access: Protected (any logged in staff)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
 
    const validStatuses = ["pending", "confirmed", "completed", "no_show"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
 
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    )
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization");
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    res.status(200).json({
      message: `Appointment status updated to ${status} successfully`,
      appointment,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Cancel Appointment ───────────────────────────────────────
// PUT /api/v1/appointments/:id/cancel
// Access: Protected (any logged in staff)
const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
 
    const appointment = await Appointment.findById(req.params.id);
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    // Can't cancel an already cancelled appointment
    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Appointment is already cancelled" });
    }
 
    // Can't cancel a completed appointment
    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed appointment" });
    }
 
    appointment.status = "cancelled";
    appointment.cancelledBy = req.user._id;
    appointment.cancellationReason = cancellationReason || "No reason provided";
    appointment.cancelledAt = new Date();
    await appointment.save();
 
    await appointment.populate("patient", "firstName lastName phone");
    await appointment.populate("doctor", "firstName lastName");
    await appointment.populate("cancelledBy", "firstName lastName role");
 
    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Appointments by Doctor ───────────────────────────────
// GET /api/v1/appointments/doctor/:id
// Access: Protected (any logged in staff)
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { status, date } = req.query;
 
    let filter = { doctor: req.params.id };
 
    // Filter by status
    if (status) filter.status = status;
 
    // Filter by date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
 
    const appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName phone email eyeCondition")
      .populate("doctor", "firstName lastName specialization")
      .sort({ date: 1, time: 1 });
 
    res.status(200).json({
      message: "Doctor appointments fetched successfully",
      total: appointments.length,
      appointments,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export {
  bookAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentsByDoctor,
};
 
 