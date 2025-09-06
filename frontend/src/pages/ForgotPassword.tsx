// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { assets } from "../assets/assets";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("Enter your email to reset password");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api.post("/users/forgot-password", { email });
            setMessage(result.data.message);
            setEmail("");
            navigate('/verify-reset-otp', { state: { email } });
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 px-4 sm:px-0">
            {/* Logo */}
            <img
                onClick={() => navigate("/home")}
                className="absolute left-4 sm:left-20 top-4 w-24 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />

            {/* Card */}
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300 text-sm flex flex-col items-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-2 sm:mb-4">
                    Forgot Password
                </h2>
                <p
                    className={`text-center text-sm mb-4 sm:mb-6 ${message.includes("sent")
                        ? "text-green-400"
                        : message.includes("wrong")
                            ? "text-red-400"
                            : "text-blue-200"
                        }`}
                >
                    {message}
                </p>

                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="" className="w-5 h-5" />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium shadow-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p
                    onClick={() => navigate("/login")}
                    className="text-gray-400 text-center text-xs mt-4 cursor-pointer hover:underline"
                >
                    Back to Login
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
