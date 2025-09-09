import express from "express";
import jwt from "jsonwebtoken";
import {
    signupUser, requestOtp, verifyOtp, loginUser,
    validateToken, loginWithGoogle, getCurrentUser,
    changePassword, resetPassword, verifyPasswordResetOtp,
    forgotPasswordOTP
} from "../dbOperations/userOperations";
import { authMiddleware } from "../middleware/auth";
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
// Get current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await getCurrentUser(req);
        res.json({ user });
    } catch (err: any) {
        res.status(err.message === "Unauthorized" ? 401 : 404).json({ error: err.message });
    }
});

// router.post("/request-reset-otp", async (req, res) => {
//     try {
//         const { email } = req.body;
//         await requestPasswordResetOtp(email);
//         res.json({ message: "OTP sent to your email" });
//     } catch (err: any) {
//         res.status(400).json({ error: err.message });
//     }
// });

router.post("/verify-reset-otp", async (req, res) => {
    try {
        const { email, resetOtp } = req.body;
        const token=await verifyPasswordResetOtp(email, resetOtp);
        res.json({ message: "OTP verified, you can reset password now" ,token:token});
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        await resetPassword(email, newPassword);
        res.json({ message: "Password updated successfully" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Change password route
router.post("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "All fields required" });
        }

        const message = await changePassword(req, currentPassword, newPassword);
        res.json({ message });
    } catch (err: any) {
        res.status(err.message === "Unauthorized" ? 401 : 400).json({ error: err.message });
    }
});

//Forgot Password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email Required' });
        }
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'Please enter valid gmail address' });
        }
        await forgotPasswordOTP(email);
        res.status(201).json({ message: `Reset Password OTP Sent to ${email}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error });
    }
})

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

// Validate token
router.get("/validate-token", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: "No token provided" });

        const token = authHeader.split(" ")[1];
        const user = await validateToken(token);

        res.json({ valid: true, user });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
});


// Google login/signup
router.post("/google-login", async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ error: "Google token required" });

        const { user, token } = await loginWithGoogle(idToken);

        res.json({ message: "Google login successful", token, user });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});
export default router;
