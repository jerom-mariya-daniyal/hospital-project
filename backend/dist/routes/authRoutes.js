import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), user.role),
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// Seed an admin and staff user
router.get("/seed", async (req, res) => {
    try {
        await User.deleteMany();
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const staffPassword = await bcrypt.hash("staff123", salt);
        const users = await User.insertMany([
            { name: "Admin User", email: "admin@vethub.org", password: adminPassword, role: "ADMIN" },
            { name: "Staff User", email: "staff@vethub.org", password: staffPassword, role: "STAFF" },
        ]);
        res.status(201).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
router.get("/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   POST /api/auth/users
// @desc    Create a new user (Admin only)
router.post("/users", protect, admin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "STAFF",
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   PUT /api/auth/me/notifications
// @desc    Toggle email notification preference for current user
// @access  Private
router.put("/me/notifications", protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const newValue = req.body.emailNotifications !== undefined
            ? Boolean(req.body.emailNotifications)
            : !user.emailNotifications;
        user.emailNotifications = newValue;
        await user.save();
        res.json({ emailNotifications: user.emailNotifications });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// @route   GET /api/auth/me
// @desc    Get current user's profile (includes emailNotifications)
// @access  Private
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
export default router;
