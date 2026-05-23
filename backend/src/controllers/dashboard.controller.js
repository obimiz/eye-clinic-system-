// ============================================================
// DASHBOARD STATS
// ============================================================
// Routes:
// GET /api/v1/dashboard/stats        ← all stats in one call
// GET /api/v1/dashboard/recent       ← recent activity
// ============================================================


import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";
 
// ─── Get Dashboard Stats ──────────────────────────────────────
// GET /api/v1/dashboard/stats
// Access: Protected (any logged in staff)
const getDashboardStats = async (req, res) => {
  try {
    // ─── Date Helpers ───────────────────────────────────────
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
 
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
 
    // ─── Patient Stats ──────────────────────────────────────
    const totalPatients = await Patient.countDocuments({ isActive: true });
 
    const newPatientsThisMonth = await Patient.countDocuments({
      isActive: true,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
 
    // ─── Appointment Stats ──────────────────────────────────
    const todaysAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
 
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });
 
    const confirmedAppointments = await Appointment.countDocuments({
      status: "confirmed",
    });
 
    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });
 
    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });
 
    const appointmentsThisMonth = await Appointment.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
 
    // ─── Staff Stats ────────────────────────────────────────
    const totalStaff = await User.countDocuments({ isActive: true });
 
    const activeDoctors = await User.countDocuments({
      role: "doctor",
      isActive: true,
    });
 
    const activeNurses = await User.countDocuments({
      role: "nurse",
      isActive: true,
    });
 
    const activeReceptionists = await User.countDocuments({
      role: "receptionist",
      isActive: true,
    });
 
    // ─── Prescription Stats ─────────────────────────────────
    const totalPrescriptions = await Prescription.countDocuments({
      status: "active",
    });
 
    const prescriptionsThisMonth = await Prescription.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
 
    // ─── Response ───────────────────────────────────────────
    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        patients: {
          total: totalPatients,
          newThisMonth: newPatientsThisMonth,
        },
        appointments: {
          today: todaysAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          thisMonth: appointmentsThisMonth,
        },
        staff: {
          total: totalStaff,
          doctors: activeDoctors,
          nurses: activeNurses,
          receptionists: activeReceptionists,
        },
        prescriptions: {
          active: totalPrescriptions,
          thisMonth: prescriptionsThisMonth,
        },
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Recent Activity ──────────────────────────────────────
// GET /api/v1/dashboard/recent
// Access: Protected (any logged in staff)
const getRecentActivity = async (req, res) => {
  try {
    // Last 5 registered patients
    const recentPatients = await Patient.find({ isActive: true })
      .select("firstName lastName phone createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
 
    // Last 5 appointments
    const recentAppointments = await Appointment.find()
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .select("date time type status")
      .sort({ createdAt: -1 })
      .limit(5);
 
    // Last 5 prescriptions
    const recentPrescriptions = await Prescription.find()
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .select("prescriptionType diagnosis status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
 
    // Today's appointments in full
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
 
    const todaysAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization")
      .sort({ time: 1 });
 
    res.status(200).json({
      message: "Recent activity fetched successfully",
      recent: {
        patients: recentPatients,
        appointments: recentAppointments,
        prescriptions: recentPrescriptions,
        todaysAppointments,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { getDashboardStats, getRecentActivity };
 
 