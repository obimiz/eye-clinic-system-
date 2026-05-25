import mongoose from "mongoose";
 
const doctorScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Weekly availability
    availability: {
      monday:    { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      tuesday:   { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      wednesday: { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      thursday:  { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      friday:    { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      saturday:  { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
      sunday:    { isAvailable: { type: Boolean, default: false }, startTime: String, endTime: String },
    },
    // Slot duration in minutes
    slotDuration: {
      type: Number,
      default: 30, // 30 minutes per appointment
    },
    // Days off (holidays, leave)
    daysOff: [
      {
        date: { type: Date },
        reason: { type: String },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
 
const DoctorSchedule = mongoose.model("DoctorSchedule", doctorScheduleSchema);
export default DoctorSchedule;