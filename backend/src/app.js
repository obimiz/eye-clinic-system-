import express from "express"
import userRouter from "./routes/user.route.js";


const app = express();  //create an express app

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}))


//route declaration
app.use("/api/v1/users", userRouter);

//Health check
app.get("/", (req, res) => {
    res.json({ message: "Health Clinic API is running" });
});


//example routes: http://localhost:4000/api/v1/users/register 

export default app;