import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import notesRoutes from "./routes/noteRoutes"; // 👈 import notes routes

dotenv.config();

const app = express();

// Debugging environment vars (remove in production)
console.log("Environment check:");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes); // 👈 mount notes routes

// Connect DB & Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
