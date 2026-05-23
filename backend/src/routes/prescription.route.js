import { Router } from "express";
import {
  createPrescription,
  getPatientPrescriptions,
  getSinglePrescription,
  updatePrescription,
} from "../controllers/prescription.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
 
const router = Router();
 
router.post("/create", protect, restrictTo("doctor", "admin"), createPrescription);
router.get("/patient/:id", protect, getPatientPrescriptions);
router.get("/:id", protect, getSinglePrescription);
router.put("/:id", protect, restrictTo("doctor", "admin"), updatePrescription);
 
export default router;
 