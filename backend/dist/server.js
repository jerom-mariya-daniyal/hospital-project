import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import activityRoutes from "./routes/activityRoutes";
import uploadRoutes from "./routes/uploadRoutes";
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
app.use(cors());
// Basic Route
app.get("/", (req, res) => {
    res.send("Vet-Hub API is running...");
});
// Setup API Routes
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/upload", uploadRoutes);
// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
