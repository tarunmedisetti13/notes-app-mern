// src/pages/VerifyResetOtp.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { assets } from "../assets/assets";
const VerifyResetOtp: React.FC = () => {
    const location = useLocation();
    const { email } = location.state || {};
    const [resetOtp, setResetOtp] = useState("");
    const [message, setMessage] = useState("Enter OTP sent to your email");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            //console.log(email, resetOtp);
            const result = await api.post("/users/verify-reset-otp", { email, resetOtp });
            if (result.data.token) {
                setMessage(result.data.message);
                localStorage.setItem('token', result.data.token);
            }
            setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
        } catch (err: any) {
            setMessage(err.response?.data?.error || `OTP Not Matches`);
            // console.log(err);
        }
        setLoading(false);
    };
    const handleResend = async () => {
        try {
            if (!email) {
                navigate('/forgot-password');
                return;
            }
            const result = await api.post("/users/forgot-password", { email });
            setMessage(result.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Server Error try again');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 px-4">
            <img
                onClick={() => navigate("/home")}
                className="absolute left-4 sm:left-20 top-4 w-24 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300">
                <h2 className="text-2xl font-semibold text-white text-center mb-2">Verify Reset OTP</h2>
                <p className={`text-center text-sm mb-4 ${message.includes('Enter') ? 'text-blue-200' : message.includes("verified") ? "text-green-400" : "text-red-400"}}`}>
                    {message}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        className="px-4 py-2 rounded-full bg-[#333A5C] text-white outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-purple-700 text-white font-medium shadow-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <p
                        onClick={handleResend}
                        className="text-indigo-400 text-sm cursor-pointer hover:underline text-left"
                    >
                        resend otp
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VerifyResetOtp;
