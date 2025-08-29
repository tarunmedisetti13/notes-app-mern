import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel";
import transporter from "../utils/email";
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
    subject: 'Welcome to MERN STACK',
    text: `Welcome to Mern Stack field. You have just created the account with this email id: ${email}, otp:${otp}`

  }
  // ✅ Send OTP to email
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

/**
 * Login
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("User not verified");

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) throw new Error("Invalid password");

  return user;
};
