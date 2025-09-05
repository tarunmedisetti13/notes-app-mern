import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;             // optional for Google users
    provider: "email" | "google";  // signup method
    googleId?: string;             // store Google ID if Google signup
    isVerified: boolean;           // whether email/OTP verification is done
    dob?: Date;                    // date of birth (optional)
    otp?: string;                  // OTP for email verification
    otpExpiry?: Date;              // expiry timestamp for OTP

    // 🔑 reset password fields
    resetOtp?: string;
    resetOtpExpiry?: Date;
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // only required for email users
        provider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },
        googleId: { type: String },
        isVerified: { type: Boolean, default: false },
        dob: { type: Date }, // date of birth
        otp: { type: String },
        otpExpiry: { type: Date },

        // 🔑 reset password fields
        resetOtp: { type: String },
        resetOtpExpiry: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
