// src/pages/ResetPassword.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { assets } from "../assets/assets";
const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("Enter your new password");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email: string })?.email;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage("Email not found. Restart reset flow.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // console.log("Reset token:", token);
            const result = await api.post(
                "/users/reset-password",
                { email, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(result.data.message);
            localStorage.clear();
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setMessage(err.response?.data?.error || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600 px-4">
            <img
                onClick={() => navigate("/home")}
                className="absolute left-4 sm:left-20 top-4 w-24 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300">
                <h2 className="text-2xl font-semibold text-white text-center mb-2">Reset Password</h2>
                <p className={`text-center text-sm mb-4 ${message.includes('Enter') ? 'text-blue-200' : message.includes("successful") ? "text-green-400" : "text-red-400"}}`}>
                    {message}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-4 py-2 rounded-full bg-[#333A5C] text-white outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-700 text-white font-medium shadow-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
