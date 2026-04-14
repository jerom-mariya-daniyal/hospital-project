import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import { sendNewReportNotification, sendReportPublishedNotification, } from "../services/mailer.js";
const router = express.Router();
// @route   GET /api/activities
// @desc    Get all PUBLISHED activities (with optional ?tag= filter)
// @access  Public
router.get("/", async (req, res) => {
    try {
        const filter = { status: "PUBLISHED" };
        if (req.query.tag && req.query.tag !== "All") {
            filter.tag = req.query.tag;
        }
        const activities = await Activity.find(filter)
            .populate("author", "name")
            .sort({ createdAt: -1 });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   GET /api/activities/pending
// @desc    Get all PENDING activities (with optional ?tag= filter)
// @access  Private/Admin
router.get("/pending", protect, admin, async (req, res) => {
    try {
        const filter = { status: "PENDING" };
        if (req.query.tag && req.query.tag !== "All") {
            filter.tag = req.query.tag;
        }
        const activities = await Activity.find(filter)
            .populate("author", "name")
            .sort({ createdAt: -1 });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   GET /api/activities/:id
// @desc    Get a single activity by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).populate("author", "name");
        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }
        res.json(activity);
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
        const { title, description, images, tag } = req.body;
        const currentUser = req.user;
        const activity = new Activity({
            title,
            description,
            images,
            tag: tag || "General",
            author: currentUser._id,
            status: "PENDING",
        });
        const createdActivity = await activity.save();
        // Fire-and-forget: notify all admins of new submission
        (async () => {
            try {
                const admins = await User.find({ role: "ADMIN" })
                    .select("name email emailNotifications")
                    .lean();
                await sendNewReportNotification({ title, tag: tag || "General", _id: createdActivity._id.toString() }, currentUser.name || "Staff Member", admins);
            }
            catch (mailErr) {
                console.error("[Mailer] Error notifying admins of new report:", mailErr);
            }
        })();
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
        const activity = await Activity.findById(req.params.id).populate("author", "name email emailNotifications");
        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }
        activity.status = "PUBLISHED";
        const updatedActivity = await activity.save();
        // Fire-and-forget: notify report author it's live
        (async () => {
            try {
                const author = activity.author;
                if (author?.email) {
                    await sendReportPublishedNotification({ title: activity.title, tag: activity.tag, _id: activity._id.toString() }, { email: author.email, name: author.name, emailNotifications: author.emailNotifications });
                }
            }
            catch (mailErr) {
                console.error("[Mailer] Error notifying author of published report:", mailErr);
            }
        })();
        res.json(updatedActivity);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
export default router;
