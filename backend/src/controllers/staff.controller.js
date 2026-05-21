// DOCTOR/STAFF MANAGEMENT
// ============================================================
// Routes:
// GET    /api/v1/users/all          ← get all staff (admin only)
// GET    /api/v1/users/:id          ← get single staff (protected)
// PUT    /api/v1/users/:id          ← update staff profile (protected)
// DELETE /api/v1/users/:id          ← delete staff (admin only)
// PUT    /api/v1/users/:id/role     ← change staff role (admin only)
// ============================================================


import User from "../models/user.model.js";


// ─── Get All Staff ────────────────────────────────────────────
// GET /api/v1/users/all
// Access: Admin only
const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find().select("-password");
 
    res.status(200).json({
      message: "Staff fetched successfully",
      total: staff.length,
      staff,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Get Single Staff ─────────────────────────────────────────
// GET /api/v1/users/:id
// Access: Protected (any logged in staff)
const getSingleStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id).select("-password");
 
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
 
    res.status(200).json({
      message: "Staff member fetched successfully",
      staff,
    });
 
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid staff ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Update Staff Profile ─────────────────────────────────────
// PUT /api/v1/users/:id
// Access: Protected (own profile) or Admin (any profile)
const updateStaff = async (req, res) => {
  try {
    const { firstName, lastName, phone, specialization, licenceNumber, department } = req.body;
 
    // Only allow staff to update their own profile unless admin
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }
 
    // Fields allowed to update
    const updatedData = {
      firstName,
      lastName,
      phone,
      specialization,
      licenceNumber,
      department,
    };
 
    // Remove undefined fields
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );
 
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }  // return updated doc
    ).select("-password");
 
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
 
    res.status(200).json({
      message: "Staff profile updated successfully",
      staff,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid staff ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Delete Staff ─────────────────────────────────────────────
// DELETE /api/v1/users/:id
// Access: Admin only
const deleteStaff = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
 
    const staff = await User.findByIdAndDelete(req.params.id);
 
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
 
    res.status(200).json({
      message: "Staff member deleted successfully",
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid staff ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
// ─── Change Staff Role ────────────────────────────────────────
// PUT /api/v1/users/:id/role
// Access: Admin only
const changeStaffRole = async (req, res) => {
  try {
    const { role } = req.body;
 
    // Validate role
    const validRoles = ["admin", "doctor", "receptionist", "nurse"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }
 
    // Prevent admin from changing their own role
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }
 
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
 
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
 
    res.status(200).json({
      message: `Staff role updated to ${role} successfully`,
      staff,
    });
 
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid staff ID format" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 
export { getAllStaff, getSingleStaff, updateStaff, deleteStaff, changeStaffRole };
 