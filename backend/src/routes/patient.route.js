import { Router } from "express";
import {
  registerPatient,
  getAllPatients,
  getSinglePatient,
  updatePatient,
  deletePatient,
  getPatientByName,
} from "../controllers/patient.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
router.post("/register", protect, registerPatient);
router.get("/all", protect, getAllPatients);                  // supports ?search=
router.get("/search/:name", protect, getPatientByName);      // search by name ← new
router.get("/:id", protect, getSinglePatient);               // get by ID
router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, restrictTo("admin"), deletePatient);
 
export default router;
 