import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import Activity from "../models/Activity";
const router = express.Router();
// @route   GET /api/activities
// @desc    Get all PUBLISHED activities
// @access  Public
router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find({ status: "PUBLISHED" })
            .populate("author", "name")
            .sort({ createdAt: -1 });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   GET /api/activities/pending
// @desc    Get all PENDING activities
// @access  Private/Admin
router.get("/pending", protect, admin, async (req, res) => {
    try {
        const activities = await Activity.find({ status: "PENDING" })
            .populate("author", "name")
            .sort({ createdAt: -1 });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   POST /api/activities
// @desc    Create a new activity
// @access  Private/Staff
router.post("/", protect, async (req, res) => {
    try {
        const { title, description, images } = req.body;
        const activity = new Activity({
            title,
            description,
            images,
            author: req.user._id,
            status: "PENDING",
        });
        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   PUT /api/activities/:id/publish
// @desc    Publish an activity
// @access  Private/Admin
router.put("/:id/publish", protect, admin, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            activity.status = "PUBLISHED";
            const updatedActivity = await activity.save();
            res.json(updatedActivity);
        }
        else {
            res.status(404).json({ message: "Activity not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
export default router;
