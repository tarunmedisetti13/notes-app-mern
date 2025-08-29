import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token"); // or your logout logic
        setShowConfirm(false);
        navigate("/login");
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg z-10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
                        📝 MyNotes
                    </Link>

                    {/* Links */}
                    <div className="flex gap-6">
                        <Link
                            to="/notes"
                            className="text-white/90 hover:text-yellow-300 font-medium transition"
                        >
                            Notes
                        </Link>
                        <Link
                            to="/profile"
                            className="text-white/90 hover:text-yellow-300 font-medium transition"
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-white/90 hover:text-yellow-300 font-medium transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                        <p className="mb-4 text-gray-800">Do you want to logout?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
