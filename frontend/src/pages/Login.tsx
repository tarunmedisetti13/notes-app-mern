import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
    const location = useLocation();
    const [state, setState] = useState<"Sign Up" | "Login">("Login");

    useEffect(() => {
        if (location.state?.mode === "SignUp") {
            setState("Sign Up");
            setMessage("Create your Account");
        } else {
            setMessage("Login to your Account");
        }
    }, [location.state]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("Create your Account");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (state === "Login") {
                const res = await api.post("/users/login", { email, password });
                login(res.data.token);
                navigate("/notes");
            } else {
                await api.post("/users/signup", { name, email, password });
                await api.post("/users/request-otp", { email });
                navigate("/verify-gmail", { state: { email } });
            }
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Something went wrong");
        }
        setEmail("");
        setPassword("");
        setName("");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 px-4 sm:px-0">
            {/* Logo */}
            <img
                onClick={() => navigate("/home")}
                className="absolute left-4 sm:left-20 top-4 w-24 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />

            {/* Card */}
            <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-indigo-300 text-sm flex flex-col items-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-2 sm:mb-4">
                    {state === "Sign Up" ? "Create Account" : "Login Account"}
                </h2>
                <p
                    className={`text-center text-sm mb-4 sm:mb-6 ${message === "Create your Account" || message === "Login to your Account"
                        ? "text-blue-200"
                        : "text-red-400"
                        }`}
                >
                    {message}
                </p>

                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    {state === "Sign Up" && (
                        <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333a5c]">
                            <img src={assets.lock_icon} alt="" className="w-5 h-5" />
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                                type="text"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="" className="w-5 h-5" />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                            type="email"
                            placeholder="Email id"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C] relative">
                        <img src={assets.lock_icon} alt="" className="w-5 h-5" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="bg-transparent outline-none w-full pr-8 text-white placeholder-gray-400"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 text-gray-400"
                        >
                            {password ? (showPassword ? <FaEyeSlash /> : <FaEye />) : null}
                        </button>
                    </div>

                    {state === "Login" && (
                        <p
                            onClick={() => navigate("/reset-password")}
                            className="text-indigo-400 text-xs cursor-pointer hover:underline text-right"
                        >
                            Forgot password?
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium shadow-lg hover:opacity-90 transition"
                    >
                        {state === "Sign Up" ? "Create Account" : "Login Account"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4 w-full">
                    <hr className="flex-grow border-gray-600" />
                    <span className="px-2 text-gray-400 text-xs">OR</span>
                    <hr className="flex-grow border-gray-600" />
                </div>

                {/* Google Login */}
                <div className="w-full flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const res = await api.post("/users/google-login", {
                                    idToken: credentialResponse.credential,
                                });
                                login(res.data.token);
                                navigate("/notes");
                            } catch (err: any) {
                                alert(err.response?.data?.error || "Google login failed");
                            }
                        }}
                        onError={() => alert("Google login failed")}
                        theme="filled_blue"
                        shape="pill"
                        text={state === "Sign Up" ? "signup_with" : "signin_with"}
                        width={100}
                    />
                </div>

                {/* Toggle login/signup */}
                <p className="text-gray-400 text-center text-xs mt-4">
                    {state === "Sign Up" ? (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={() => {
                                    setState("Login");
                                    setMessage("Login to your Account");
                                    setName("");
                                }}
                                className="text-blue-400 cursor-pointer underline"
                            >
                                Login here
                            </span>
                        </>
                    ) : (
                        <>
                            Don’t have an account?{" "}
                            <span
                                onClick={() => {
                                    setState("Sign Up");
                                    setMessage("Create your Account");
                                    setPassword("");
                                }}
                                className="text-blue-400 cursor-pointer underline"
                            >
                                Sign up
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;
