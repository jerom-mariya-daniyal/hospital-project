import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import Circular from "../models/Circular";
import User from "../models/User";
import { sendCircularNotification } from "../services/mailer";

const router = express.Router();

// @route   POST /api/circulars
// @desc    Create a new circular
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, body, attachments, priority, recipients } = req.body;
    const circular = new Circular({
      title,
      body,
      attachments: attachments || [],
      priority: priority || "Normal",
      recipients: recipients || "ALL",
      author: (req as any).user._id,
    });
    const saved = await circular.save();
    await saved.populate("author", "name role");

    // ── Fire-and-forget: email eligible recipients ──
    (async () => {
      try {
        const recip = saved.recipients; // "ALL" | "STAFF" | "ADMIN"
        const roleFilter =
          recip === "ALL"   ? { role: { $in: ["STAFF", "ADMIN"] } } :
          recip === "STAFF" ? { role: "STAFF" } :
                              { role: "ADMIN" };

        const users = await User.find(roleFilter).select("name email emailNotifications").lean();
        await sendCircularNotification(
          { title: saved.title, body: saved.body, priority: saved.priority, _id: saved._id.toString() },
          users as any
        );
      } catch (mailErr) {
        console.error("[Mailer] Error sending circular notifications:", mailErr);
      }
    })();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/circulars
// @desc    Get all circulars (filtered by user role)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const userRole = (req as any).user.role;
    const roleFilter = userRole === "ADMIN"
      ? { recipients: { $in: ["ALL", "ADMIN"] } }
      : { recipients: { $in: ["ALL", "STAFF"] } };

    const circulars = await Circular.find(roleFilter)
      .populate("author", "name role")
      .populate("viewLog.user", "name role")
      .sort({ createdAt: -1 })
      .select("-followUps");
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/circulars/:id
// @desc    Get a single circular with follow-ups and view log
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id)
      .populate("author", "name role")
      .populate("followUps.author", "name role")
      .populate("viewLog.user", "name role");
    if (!circular) {
      return res.status(404).json({ message: "Circular not found" });
    }
    res.json(circular);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/circulars/:id/followup
// @desc    Add a follow-up reply to a circular
// @access  Private
router.post("/:id/followup", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const circular = await Circular.findById(req.params.id);
    if (!circular) {
      return res.status(404).json({ message: "Circular not found" });
    }
    circular.followUps.push({
      message,
      author: (req as any).user._id,
    } as any);
    await circular.save();
    await circular.populate("followUps.author", "name role");
    res.json(circular.followUps[circular.followUps.length - 1]);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/circulars/:id/read
// @desc    Mark circular as read by current user (logs first-time view)
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const circular = await Circular.findById(req.params.id);
    if (!circular) {
      return res.status(404).json({ message: "Circular not found" });
    }

    const alreadyRead = circular.readBy.some(
      (id: any) => id.toString() === userId.toString()
    );

    const update: any = { $addToSet: { readBy: userId } };

    // Only push to viewLog on first read
    if (!alreadyRead) {
      update.$push = { viewLog: { user: userId, readAt: new Date() } };
    }

    await Circular.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/circulars/:id/readers
// @desc    Get full reader list for a circular (admin/author view)
// @access  Private
router.get("/:id/readers", protect, async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id)
      .populate("viewLog.user", "name email role")
      .select("viewLog readBy author title");
    if (!circular) {
      return res.status(404).json({ message: "Circular not found" });
    }
    res.json(circular.viewLog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
