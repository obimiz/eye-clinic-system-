import Appointment from "../models/appointment.model.js";
import sendEmail from "../utils/sendEmail.js";
import { appointmentReminderEmail } from "../utils/emailTemplates.js";
 
// ─── Send Appointment Reminder ────────────────────────────────
// POST /api/v1/reminders/appointment/:id
// Access: Admin or receptionist
const sendAppointmentReminder = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName");
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    if (!appointment.patient.email) {
      return res.status(400).json({ message: "Patient has no email address on file" });
    }
 
    const date = new Date(appointment.date).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
 
    await sendEmail({
      to: appointment.patient.email,
      subject: "EyeClinic — Appointment Reminder",
      html: appointmentReminderEmail(
        `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        date,
        appointment.time,
        appointment.type.replace("_", " ")
      ),
    });
 
    res.status(200).json({
      message: `Reminder sent to ${appointment.patient.email}`,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Send Bulk Reminders for Tomorrow ────────────────────────
// POST /api/v1/reminders/bulk
// Access: Admin only
const sendBulkReminders = async (req, res) => {
  try {
    // Get tomorrow's appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(0, 0, 0, 0));
    const end = new Date(tomorrow.setHours(23, 59, 59, 999));
 
    const appointments = await Appointment.find({
      date: { $gte: start, $lte: end },
      status: { $in: ["pending", "confirmed"] },
    })
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName");
 
    if (appointments.length === 0) {
      return res.status(200).json({ message: "No appointments found for tomorrow" });
    }
 
    let sent = 0;
    let failed = 0;
 
    for (const appointment of appointments) {
      if (!appointment.patient.email) {
        failed++;
        continue;
      }
 
      try {
        const date = new Date(appointment.date).toLocaleDateString("en-NG", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
 
        await sendEmail({
          to: appointment.patient.email,
          subject: "EyeClinic — Appointment Reminder",
          html: appointmentReminderEmail(
            `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            date,
            appointment.time,
            appointment.type.replace("_", " ")
          ),
        });
        sent++;
      } catch {
        failed++;
      }
    }
 
    res.status(200).json({
      message: "Bulk reminders processed",
      total: appointments.length,
      sent,
      failed,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { sendAppointmentReminder, sendBulkReminders };