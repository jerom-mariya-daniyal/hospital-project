import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "vet-hub",
        });
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error during upload" });
    }
});
export default router;
