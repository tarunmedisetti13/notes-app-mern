import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
    name: string;
    email: string;
    createdAt?: string;
}

const Profile: React.FC = () => {
    const { token, logout } = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const res = await api.get("/users/me");
                setUser(res.data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [token]);

    const handlePassword = () => {
        navigate("/change-password");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 pt-16">
            <Navbar onLogout={logout} />

            <div className="max-w-md sm:max-w-lg mx-2 sm:mx-auto mt-10 p-6 sm:p-10 bg-white/90 shadow-xl rounded-3xl backdrop-blur">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                    👤 My Profile
                </h2>

                {user ? (
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-100 rounded-lg">
                            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">Name:</span>
                            <span className="text-gray-800 break-words">{user.name}</span>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-100 rounded-lg">
                            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">Email:</span>
                            <span className="text-gray-800 break-words">{user.email}</span>
                        </div>

                        {/* Joined Date */}
                        {user.createdAt && (
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-100 rounded-lg">
                                <span className="font-semibold text-gray-700 mb-1 sm:mb-0">Joined:</span>
                                <span className="text-gray-800">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}

                        {/* Change Password Button */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                            <button
                                onClick={handlePassword}
                                className="w-full sm:w-auto bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition shadow-md text-sm sm:text-base"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-sm sm:text-base">Loading profile...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
