// src/pages/VerifyResetOtp.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { assets } from "../assets/assets";

const VerifyResetOtp: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("Enter OTP sent to your email");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/users/verify-reset-otp", { email, otp });
            setMessage("OTP verified! Set your new password.");
            setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Invalid OTP");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 px-4">
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300">
                <h2 className="text-2xl font-semibold text-white text-center mb-2">Verify OTP</h2>
                <p className={`text-center text-sm mb-4 ${message.includes("verified") ? "text-green-400" : "text-red-400"}`}>
                    {message}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-full bg-[#333A5C] text-white outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="px-4 py-2 rounded-full bg-[#333A5C] text-white outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-700 text-white font-medium shadow-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyResetOtp;
