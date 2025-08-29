import express from "express";
import jwt from "jsonwebtoken";
import { signupUser, requestOtp, verifyOtp, loginUser } from "../dbOperations/userOperations";

const router = express.Router();

/**
 * Signup
 */
router.post("/signup", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const user = await signupUser(email, name, password);
        res.json({ message: "Signup successful, please request OTP", userId: user._id });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Request OTP
    */
router.post("/request-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });

        const result = await requestOtp(email);
        res.json({ message: "OTP sent to email", response: result });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Verify OTP
 */
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

        const user = await verifyOtp(email, otp);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.json({ message: "User verified successfully", token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Login
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const user = await loginUser(email, password);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
