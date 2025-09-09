import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel";
import transporter from "../utils/email";
import { AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/**
 * Signup - create user (not verified yet)
 */
export const signupUser = async (email: string, name: string, password: string) => {
  let user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new User({
    email,
    name,
    password: hashedPassword,
    isVerified: false,
    otp: undefined,
    otpExpiry: undefined
  });

  await user.save();
  return user;
};


export const getCurrentUser = async (req: AuthRequest) => {
  if (!req.user) throw new Error("Unauthorized");

  const user = await User
    .findById(req.user.id)
    .select("name email createdAt");

  if (!user) throw new Error("User not found");

  return user;
};

// Change password logic
export const changePassword = async (req: AuthRequest, currentPassword: string, newPassword: string) => {
  if (!req.user) throw new Error("Unauthorized");

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User has no password set");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return "Password changed successfully";
};

export const forgotPasswordOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetOtp = crypto.randomInt(100000, 999999).toString();
  user.resetOtp = resetOtp;
  user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Reset Your Password – Notes App',
    text: `Hello,

We received a request to reset the password for your Notes App account linked to this email: ${email}.

Please use the OTP below to reset your password:

🔑 OTP: ${resetOtp}

For security reasons, this code will expire shortly.  
If you did not request a password reset, you can safely ignore this email and your account will remain secure.

Thank you,  
The Notes App Team
`,
  };

  await transporter.sendMail(mailOptions);

  return true;
}

/**
 * Google login/signup
 */
export const loginWithGoogle = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google token");

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // create new Google user
    user = new User({
      email,
      name,
      provider: "google",
      googleId,
      isVerified: true, // Google users don’t need OTP
    });
    await user.save();
  }

  // generate app’s JWT
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
};

/**
 * Request OTP for existing unverified user
 */
export const requestOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("User already verified");

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Welcome to Notes App – Verify Your Email',
    text: `Hello,

Welcome to the Notes App! 🎉  

We’re excited to have you join our community.  
Your account has been created using this email: ${email}.

To complete your registration, please verify your account using the OTP below:

🔑 OTP: ${otp}

This code will expire shortly, so please use it as soon as possible.  

If you did not sign up for this account, please ignore this email.

Thank you,  
The Notes App Team
`,
  };
  await transporter.sendMail(mailOptions);

  return true;
  // don’t return otp anymore (only for debugging before)
};

/**
 * Verify OTP
 */
export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (!user.otp) throw new Error("OTP is required");
  if (user.otp !== otp) throw new Error(" OTP not matched");
  if (!user.otpExpiry || user.otpExpiry < new Date()) throw new Error("OTP expired");

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return user;
};

// userOperations.ts
// export const requestPasswordResetOtp = async (email: string) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");

//   // if user registered only via Google
//   if (!user.password) throw new Error("This account was created using Google Sign-In");

//   const otp = crypto.randomInt(100000, 999999).toString();
//   user.resetOtp = otp;
//   user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
//   await user.save();

//   const mailOptions = {
//     from: process.env.SENDER_EMAIL,
//     to: email,
//     subject: "Reset Password OTP",
//     text: `Your OTP to reset password is: ${otp}`
//   };

//   await transporter.sendMail(mailOptions);
//   return true;
// };

export const verifyPasswordResetOtp = async (email: string, resetOtp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (!user.resetOtp) throw new Error("No reset request found");
  if (user.resetOtp !== resetOtp) throw new Error("Invalid OTP");
  if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) throw new Error("OTP expired");
  // OTP is valid → clear it
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" } // 10 minutes validity
  );
  return token;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return "Password updated successfully";
};


/**
 * Login
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  // ✅ If user has no password stored, they signed up only via Google
  if (!user.password) throw new Error("This account was created using Google. Please login with Google Sign-In.");
  if (!user.isVerified) throw new Error("User not verified");

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) throw new Error("Invalid password");

  return user;
};

/**
 * Validate token
 */
export const validateToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");

    return user;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};