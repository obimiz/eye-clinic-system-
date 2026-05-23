import express from "express"
import userRouter from "./routes/user.route.js";
import patientRouter from "./routes/patient.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
 


const app = express();  //create an express app

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}))


//route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/prescriptions", prescriptionRouter);

//Health check
app.get("/", (req, res) => {
    res.json({ message: "Health Clinic API is running" });
});


//example routes: http://localhost:4000/api/v1/users/register 

export default app;