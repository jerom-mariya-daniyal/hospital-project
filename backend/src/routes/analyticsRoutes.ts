import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import Activity from "../models/Activity";
import User from "../models/User";

const router = express.Router();

// @route   GET /api/analytics
// @desc    Get dashboard analytics (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const totalActivities = await Activity.countDocuments();
    const pendingActivities = await Activity.countDocuments({ status: "PENDING" });
    const publishedActivities = await Activity.countDocuments({ status: "PUBLISHED" });
    const totalStaff = await User.countDocuments({ role: "STAFF" });

    // Activities by month for a chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activityStats = await Activity.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      totalActivities,
      pendingActivities,
      publishedActivities,
      totalStaff,
      activityStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
