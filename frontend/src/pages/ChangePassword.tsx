import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const togglePassword = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChangePassword = async () => {

        setError(null);
        setMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/users/change-password", {
                currentPassword,
                newPassword,
            });
            setMessage(res.data.message || "Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
            const backendError = err.response?.data?.error;
            if (backendError === "User has no password set") {
                setError(null);
                setMessage(
                    "Your account was created with Google. You cannot change password here."
                );
            } else {
                setError(backendError || err.message || "Failed to change password");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 pt-16">
            <Navbar onLogout={logout} />

            <div className="max-w-md mx-2 sm:mx-auto mt-10 p-6 sm:p-10 bg-white/90 shadow-xl rounded-3xl backdrop-blur">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                    🔒 Change Password
                </h2>

                <div className="space-y-4">
                    {/* Current Password */}
                    <div className="relative">
                        <input
                            type={showPassword.current ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pr-10 text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword("current")}
                            className="absolute right-3 top-3 text-gray-600"
                        >
                            {currentPassword ? (
                                showPassword.current ? <FaEyeSlash /> : <FaEye />
                            ) : null}
                        </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pr-10 text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword("new")}
                            className="absolute right-3 top-3 text-gray-600"
                        >
                            {newPassword ? (showPassword.new ? <FaEyeSlash /> : <FaEye />) : null}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pr-10 text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword("confirm")}
                            className="absolute right-3 top-3 text-gray-600"
                        >
                            {confirmPassword
                                ? showPassword.confirm
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                : null}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>}
                    {message && <p className="text-green-600 text-center text-sm sm:text-base">{message}</p>}

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition shadow-md text-sm sm:text-base"
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
