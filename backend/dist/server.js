import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import circularRoutes from "./routes/circularRoutes.js";
// Load env vars
dotenv.config();
// Connect to database
connectDB();
// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        "https://hospital-project-bnk2.vercel.app",
        "https://hospital-project-4.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    credentials: true,
}));
// Health-check route
app.get("/", (req, res) => {
    res.send("Vet-Hub API is running...");
});
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/circulars", circularRoutes);
// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
