import DoctorSchedule from "../models/doctorSchedule.model.js";
import User from "../models/user.model.js";
 
// ─── Set Doctor Schedule ──────────────────────────────────────
// POST /api/v1/schedule/set
// Access: Admin only
const setDoctorSchedule = async (req, res) => {
  try {
    const { doctor, availability, slotDuration } = req.body;
 
    if (!doctor || !availability) {
      return res.status(400).json({ message: "Doctor and availability are required" });
    }
 
    // Check doctor exists
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }
 
    // Upsert schedule (create or update)
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctor },
      { doctor, availability, slotDuration },
      { new: true, upsert: true, runValidators: true }
    ).populate("doctor", "firstName lastName specialization");
 
    res.status(200).json({
      message: "Doctor schedule set successfully",
      schedule,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Doctor Schedule ──────────────────────────────────────
// GET /api/v1/schedule/:doctorId
// Access: Protected (any staff)
const getDoctorSchedule = async (req, res) => {
  try {
    const schedule = await DoctorSchedule.findOne({ doctor: req.params.doctorId })
      .populate("doctor", "firstName lastName specialization");
 
    if (!schedule) {
      return res.status(404).json({ message: "No schedule found for this doctor" });
    }
 
    res.status(200).json({
      message: "Schedule fetched successfully",
      schedule,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Add Day Off ──────────────────────────────────────────────
// POST /api/v1/schedule/:doctorId/day-off
// Access: Admin only
const addDayOff = async (req, res) => {
  try {
    const { date, reason } = req.body;
 
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
 
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctor: req.params.doctorId },
      { $push: { daysOff: { date: new Date(date), reason } } },
      { new: true }
    ).populate("doctor", "firstName lastName");
 
    if (!schedule) {
      return res.status(404).json({ message: "No schedule found for this doctor" });
    }
 
    res.status(200).json({
      message: "Day off added successfully",
      schedule,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get All Doctor Schedules ─────────────────────────────────
// GET /api/v1/schedule/all
// Access: Protected (any staff)
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await DoctorSchedule.find({ isActive: true })
      .populate("doctor", "firstName lastName specialization");
 
    res.status(200).json({
      message: "Schedules fetched successfully",
      total: schedules.length,
      schedules,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { setDoctorSchedule, getDoctorSchedule, addDayOff, getAllSchedules };