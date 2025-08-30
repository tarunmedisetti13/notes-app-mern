import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [stickyDropdown, setStickyDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const desktopDropdownRef = useRef<HTMLDivElement>(null);
    const mobileDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    // Close dropdowns if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) &&
                (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) &&
                (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node))
            ) {
                setStickyDropdown(false);
                setShowProfileDropdown(false);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {

        setShowConfirm(true);
        setMobileMenuOpen(false); // Close mobile menu when logout modal opens
    };

    const confirmLogout = () => {
        onLogout();
        setShowConfirm(false);
        navigate("/login");
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
        setShowProfileDropdown(false);
    };

    const handleNotesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleMobileMenuClose();
        navigate("/notes");
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleLogout();
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg z-40">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
                        📝 MyNotes
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-6 items-center relative">
                        <Link to="/notes" className="text-white/90 hover:text-yellow-300 font-medium transition">
                            Notes
                        </Link>

                        {/* Profile dropdown */}
                        <div
                            className="relative"
                            ref={desktopDropdownRef}
                            onMouseEnter={() => !stickyDropdown && setShowProfileDropdown(true)}
                            onMouseLeave={() => !stickyDropdown && setShowProfileDropdown(false)}
                        >
                            <button
                                onClick={() => {
                                    setStickyDropdown((prev) => !prev);
                                    setShowProfileDropdown(true);
                                }}
                                className="text-white/90 hover:text-yellow-300 font-medium transition cursor-pointer"
                            >
                                Profile
                            </button>

                            {(showProfileDropdown || stickyDropdown) && (
                                <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg text-gray-800 z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-blue-100 rounded-t-lg transition"
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            setStickyDropdown(false);
                                        }}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/change-password"
                                        className="block px-4 py-2 hover:bg-blue-100 transition rounded-b-lg"
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            setStickyDropdown(false);
                                        }}
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

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => {
                                setMobileMenuOpen(!mobileMenuOpen);
                            }}
                            className="text-white text-2xl focus:outline-none cursor-pointer z-50 relative"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-4 flex flex-col gap-3 z-45 relative"
                    >
                        {/* Notes Link */}
                        <button
                            onClick={handleNotesClick}
                            className="hover:text-yellow-300 font-medium transition cursor-pointer text-left w-full py-2 px-2 rounded hover:bg-white/10"
                        >
                            Notes
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={mobileDropdownRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileDropdown((prev) => !prev);
                                }}
                                className="hover:text-yellow-300 font-medium transition cursor-pointer text-left w-full py-2 px-2 rounded hover:bg-white/10"
                            >
                                Profile {showProfileDropdown ? '▲' : '▼'}
                            </button>

                            {showProfileDropdown && (
                                <div className="mt-2 bg-white text-gray-800 rounded-lg shadow-lg flex flex-col ml-4">
                                    <Link
                                        to="/profile"
                                        className="px-4 py-2 hover:bg-blue-100 transition rounded-t-lg"
                                        onClick={handleMobileMenuClose}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/change-password"
                                        className="px-4 py-2 hover:bg-blue-100 transition rounded-b-lg"
                                        onClick={handleMobileMenuClose}
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogoutClick}
                            className="hover:text-yellow-300  font-medium transition text-left cursor-pointer w-full py-2 px-2 rounded hover:bg-white/10"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-[#333A5C] mx-2 rounded-xl p-6 shadow-lg w-80 text-center">
                        <p className="mb-4 text-white">Do you want to logout?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmLogout}
                                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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