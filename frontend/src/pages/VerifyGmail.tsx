import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { assets } from "../assets/assets";

const VerifyGmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            setMessage("Please enter the OTP");
            return;
        }

        setLoading(true);
        try {
            await api.post("/users/verify-otp", { email, otp });
            setMessage("Email verified successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            setMessage(err.response?.data?.error || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            await api.post("/users/request-otp", { email });
            setMessage("OTP resent successfully!");
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-400 to-purple-500">
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300 text-center flex flex-col items-center">
                {/* Logo */}
                <img
                    onClick={() => navigate("/home")}
                    src={assets.logo}
                    alt="logo"
                    className="w-24 sm:w-28 mx-auto mb-4 cursor-pointer"
                />

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 sm:mb-4">
                    Verify Your Email
                </h2>
                <p className="text-sm sm:text-base mb-4 text-blue-200">
                    We have sent an OTP to <br />
                    <span className="font-medium">{email}</span>
                </p>

                {/* OTP Input */}
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 mb-4 rounded-full bg-[#333A5C] text-white outline-none text-center text-sm sm:text-base"
                />

                {/* Buttons */}
                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full py-3 mb-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium shadow-md hover:opacity-90 transition text-sm sm:text-base"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full py-3 mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-md hover:opacity-90 transition text-sm sm:text-base"
                >
                    {loading ? "Resending..." : "Resend OTP"}
                </button>

                {/* Message */}
                {message && (
                    <p
                        className={`mt-2 text-sm sm:text-base ${message.includes("success") ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {message}
                    </p>
                )}

                {/* Go Back */}
                <p
                    onClick={() => navigate(-1)}
                    className="mt-4 text-blue-400 cursor-pointer hover:underline text-sm sm:text-base"
                >
                    Go Back
                </p>
            </div>
        </div>
    );
};

export default VerifyGmail;
