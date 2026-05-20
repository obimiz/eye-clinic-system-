import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
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
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "nurse"],
      default: "receptionist",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    licenceNumber: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save: Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: Compare Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;