import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
    const location = useLocation();
    const [state, setState] = useState<"Sign Up" | "Login">("Login");

    useEffect(() => {
        if (location.state?.mode === "SignUp") {
            setState("Sign Up");
            setMessage("Create your Account")
        }
        else {
            setMessage("Login to your Account")
        }
    }, [location.state]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                // Redirect to verify OTP page
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
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            {/* Logo */}
            <img
                onClick={() => navigate("/home")}
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
                src={assets.logo}
                alt="logo"
            />

            <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">
                    {state === "Sign Up" ? "Create Account" : "Login Account"}
                </h2>
                <p
                    className={`text-center text-sm mb-6 ${message === "Create your Account" || message === "Login to your Account"
                        ? "text-blue-200"
                        : "text-red-400"
                        }`}
                >
                    {message}
                </p>

                <form onSubmit={handleSubmit}>
                    {state === "Sign Up" && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
                            <img src={assets.lock_icon} alt="" />
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="bg-transparent outline-none w-full"
                                type="text"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="" />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="bg-transparent outline-none w-full"
                            type="email"
                            placeholder="Email id"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.lock_icon} alt="" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="bg-transparent outline-none w-full"
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {state === "Login" && (
                        <p
                            onClick={() => navigate("/reset-password")}
                            className="mb-4 text-indigo-500 cursor-pointer hover:underline"
                        >
                            Forgot password?
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium shadow-md hover:opacity-90 transition"

                    >
                        {state === "Sign Up" ? "Create Account" : "Login Account"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-5">
                    <hr className="flex-grow border-gray-600" />
                    <span className="px-2 text-gray-400 text-xs">OR</span>
                    <hr className="flex-grow border-gray-600" />
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
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
                        onError={() => {
                            alert("Google login failed");
                        }}
                        theme="filled_blue"   // ✅ changes background (blue button with white text)
                        shape="pill"          // ✅ rounded pill style (optional)
                        text={state === "Sign Up" ? "signup_with" : "signin_with"} // ✅ button text
                        width="280"
                    />

                </div>

                {/* Toggle login/signup */}
                {state === "Sign Up" ? (
                    <p className="text-gray-400 text-center text-xs mt-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => {
                                setState("Login");
                                setMessage("Login to your Account");
                                setName("");
                            }
                            }
                            className="text-blue-400 cursor-pointer underline"
                        >
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className="text-gray-400 text-center text-xs mt-4">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => {
                                setState("Sign Up")
                                setMessage("Create your Account")
                                setPassword("");
                            }}
                            className="text-blue-400 cursor-pointer underline"
                        >
                            Sign up
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
