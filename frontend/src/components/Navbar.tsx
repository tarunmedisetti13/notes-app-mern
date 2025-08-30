import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => setShowConfirm(true);

    const confirmLogout = () => {
        onLogout(); // Call parent's logout logic
        setShowConfirm(false);
        navigate("/login");
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg z-10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
                        📝 MyNotes
                    </Link>

                    {/* Links */}
                    <div className="flex gap-6 items-center relative">
                        <Link
                            to="/notes"
                            className="text-white/90 hover:text-yellow-300 font-medium transition"
                        >
                            Notes
                        </Link>

                        {/* Profile dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setShowProfileDropdown((prev) => !prev)
                                }
                                className="text-white/90 hover:text-yellow-300 font-medium transition cursor-pointer"
                            >
                                Profile
                            </button>

                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg text-gray-800 z-20">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-blue-100 transition"
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/change-password"
                                        className="block px-4 py-2 hover:bg-blue-100 transition"
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Logout */}
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
