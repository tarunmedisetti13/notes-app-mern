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
            setTimeout(() => navigate("/login"), 1500); // Redirect after success
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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-300 text-center">
                <img
                    onClick={() => navigate("/home")}
                    src={assets.logo}
                    alt="logo"
                    className="w-28 mx-auto mb-4 cursor-pointer"
                />
                <h2 className="text-3xl font-semibold text-white mb-2">Verify Your Email</h2>
                <p className="text-sm mb-4 text-blue-200">
                    We have sent an OTP to <br />
                    <span className="font-medium">{email}</span>
                </p>

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 mb-4 rounded-full bg-[#333A5C] text-white outline-none text-center"
                />

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="cursor-pointer w-full py-2.5 mb-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium shadow-md hover:opacity-90 transition"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className=" cursor-pointer w-full py-2.5 mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-md hover:opacity-90 transition"
                >
                    {loading ? "Resending..." : "Resend OTP"}
                </button>

                {message && (
                    <p
                        className={`mt-2  text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <p
                    onClick={() => navigate(-1)}
                    className="mt-4 text-blue-400 cursor-pointer hover:underline text-sm"
                >
                    Go Back
                </p>
            </div>
        </div>
    );
};

export default VerifyGmail;
