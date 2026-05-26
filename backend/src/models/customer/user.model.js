import mongoose, { Schema } from "mongoose";

const auth_Schema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    profileImage:{
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    contact: {
        type: Number,
        unique: true,
        sparse: true
    },
    gender: {
        type: String
    },
    resetOtpHash: {
        type: String,
        default: null
    },
    resetOtpExpiresAt: {
        type: Date,
        default: null
    },
    resetOtpVerified: {
        type: Boolean,
        default: false
    },
    resetOtpLastSentAt: {
        type: Date,
        default: null
    },
    resetOtpRequestCount: {
        type: Number,
        default: 0
    },
    resetOtpRequestWindowStart: {
        type: Date,
        default: null
    },
    resetOtpRequestLockedUntil: {
        type: Date,
        default: null
    },
    resetOtpVerifyAttempts: {
        type: Number,
        default: 0
    },
    resetOtpVerifyLockedUntil: {
        type: Date,
        default: null
    },
    userType: {
        type: String,
        enum: ["B2C", "B2B"],
        default: "B2C"
    },
    businessDetails: {
        companyName: { type: String, default: "" },
        gstin: { type: String, default: "" },
        businessAddress: { type: String, default: "" },
        isApproved: { type: Boolean, default: false },
        approvedAt: { type: Date, default: null }
    }
},
    { timestamps: true }
);

const authModel = mongoose.model("customer", auth_Schema);

export default authModel;