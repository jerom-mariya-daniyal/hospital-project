import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
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
router.post("/seed", async (req, res) => {
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
export default router;
