import auth_Model from "../../models/customer/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { encryptPasswordMethod, decryptPasswordMethod } from "../../utils/passwordEncrypt&passwordDecrypt.js";
import cookiesForUser from "../../utils/cookiesForUser.js";
import { cloudinary, deleteFromCloudinary } from "../../configs/cloudinary.js";
import { OAuth2Client } from "google-auth-library"
import SibApiV3Sdk from "sib-api-v3-sdk";
import crypto from "crypto";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LOCK_MS = 15 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_REQUESTS_PER_WINDOW = 3;
const VERIFY_LOCK_MS = 10 * 60 * 1000;
const MAX_OTP_VERIFY_ATTEMPTS = 5;

const hashOtp = (otp) => {
        return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

const clearForgotPasswordOtpState = (customer) => {
    customer.resetOtpHash = null;
    customer.resetOtpExpiresAt = null;
    customer.resetOtpVerified = false;
    customer.resetOtpVerifyAttempts = 0;
    customer.resetOtpVerifyLockedUntil = null;
};

const sendForgotPasswordOtpEmail = async (email, otpCode) => {
        const client = SibApiV3Sdk.ApiClient.instance;
        client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const senderEmail = process.env.BREVO_SENDER_EMAIL || "jewellery.graphura@gmail.com";
        const senderName = process.env.BREVO_SENDER_NAME || "Balaji Gift Shop";

        await apiInstance.sendTransacEmail({
                sender: {
                        name: senderName,
                        email: senderEmail,
                },
                to: [{ email }],
                replyTo: {
                        email: senderEmail,
                        name: senderName,
                },
                subject: "Balaji Gift Shop Password Reset OTP",
                htmlContent: `
<div style="margin:0;padding:0;background:#fdf8ef;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">
                <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.08);overflow:hidden;">
                    <tr>
                        <td style="background:linear-gradient(135deg,#1C3A2C,#CBA135);padding:25px;text-align:center;">
                            <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">BALAJI</h1>
                            <p style="color:#fdf8ef;margin:5px 0 0;font-size:13px;">Premium Curated Gifts</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:35px 30px;text-align:center;color:#333;">
                            <h2 style="margin:0 0 15px;color:#1C3A2C;">Reset Your Password</h2>
                            <p style="font-size:14px;color:#555;margin-bottom:25px;">Use this OTP to verify your identity.</p>
                            <div style="display:inline-block;padding:18px 40px;background:#f4efe4;border-radius:10px;border:2px dashed #CBA135;font-size:32px;font-weight:bold;letter-spacing:6px;color:#1C3A2C;">
                                ${otpCode}
                            </div>
                            <p style="margin-top:25px;font-size:13px;color:#666;">This OTP will expire in <b>5 minutes</b>.</p>
                            <p style="margin-top:10px;font-size:12px;color:#999;">Do not share this OTP with anyone.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f9f4e8;padding:18px;text-align:center;font-size:12px;color:#777;">© ${new Date().getFullYear()} Balaji Gift Shop. All rights reserved.</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
`,
        });
};

const Signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, userType, businessDetails } = req.body;
        const normalizedEmail = email?.trim()?.toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json(new ApiError(400, "Email is required"));
        }

        const customerData = {
            email: normalizedEmail,
            password: await encryptPasswordMethod(password),
            firstName: firstName,
            lastName: lastName,
            userType: userType || "B2C"
        };

        if (userType === "B2B" && businessDetails) {
            customerData.businessDetails = {
                companyName: businessDetails.companyName || "",
                gstin: businessDetails.gstin || "",
                businessAddress: businessDetails.businessAddress || "",
                isApproved: false
            };
        }

        const customerDetail = auth_Model(customerData);

        await customerDetail.save();

        customerDetail.password = undefined;
        customerDetail.contact = undefined;
        customerDetail.profileImage = undefined;

        await cookiesForUser(res, customerDetail)

        return res.status(200).json(new ApiResponse(200, customerDetail, "Registration Successful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const Login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body?.email?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json(new ApiError(400, "Email is required"));
        }

        const customerDetail = await auth_Model.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!customerDetail) {
            return res.status(404).json(new ApiError(404, "Email not Found."));
        }

        // if (!customerDetail) {
        //     return res.status(404).json(new ApiError(404, "User Not Found"));
        // }

        const decryptPassword = await decryptPasswordMethod(password, customerDetail.password);

        if (!decryptPassword) {
            return res.status(401).json(new ApiError(401, "Incorrect Password"));
        }

        customerDetail.password = undefined;
        customerDetail.contact = undefined;
        customerDetail.profileImage = undefined;

        await cookiesForUser(res, customerDetail)

        return res.status(200).json(new ApiResponse(200, null, "Access Granted"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const password = req.body?.password;
        const email = req.body?.email?.trim()?.toLowerCase();

        if (!email || !password) {
            return res.status(400).json(new ApiError(400, "Email and password are required"));
        }

        let customerDetail = await auth_Model.findOneAndUpdate(
            { email: new RegExp(`^${escapeRegExp(email)}$`, "i") },
            {
                password: await encryptPasswordMethod(password)
            },
            { new: true }
        );

        if (!customerDetail) {
            return res.status(404).json(new ApiError(404, "Email not Found."));
        }

        customerDetail.password = undefined;
        customerDetail.contact = undefined;
        customerDetail.profileImage = undefined;

        await cookiesForUser(res, customerDetail)
        return res.status(200).json(new ApiResponse(200, null, "Password Change Successfully."));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const requestForgotPasswordOtp = async (req, res) => {
    try {
        const email = req.body?.email?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json(new ApiError(400, "Email is required"));
        }

        if (!process.env.BREVO_API_KEY) {
            return res.status(500).json(new ApiError(500, "BREVO_API_KEY is not configured"));
        }

        const customer = await auth_Model.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!customer) {
            return res.status(404).json(new ApiError(404, "Email not Found."));
        }

        const now = Date.now();

        if (customer.resetOtpRequestLockedUntil && new Date(customer.resetOtpRequestLockedUntil).getTime() > now) {
            const retryAfterSeconds = Math.ceil((new Date(customer.resetOtpRequestLockedUntil).getTime() - now) / 1000);
            return res.status(429).json(new ApiError(429, `Too many OTP requests. Try again in ${retryAfterSeconds} seconds.`));
        }

        const requestWindowStart = customer.resetOtpRequestWindowStart ? new Date(customer.resetOtpRequestWindowStart).getTime() : null;
        if (!requestWindowStart || now - requestWindowStart > REQUEST_WINDOW_MS) {
            customer.resetOtpRequestWindowStart = new Date(now);
            customer.resetOtpRequestCount = 0;
            customer.resetOtpRequestLockedUntil = null;
        }

        if (customer.resetOtpLastSentAt && now - new Date(customer.resetOtpLastSentAt).getTime() < REQUEST_COOLDOWN_MS) {
            const retryAfterSeconds = Math.ceil((REQUEST_COOLDOWN_MS - (now - new Date(customer.resetOtpLastSentAt).getTime())) / 1000);
            return res.status(429).json(new ApiError(429, `Please wait ${retryAfterSeconds} seconds before requesting another OTP.`));
        }

        if ((customer.resetOtpRequestCount || 0) >= MAX_OTP_REQUESTS_PER_WINDOW) {
            customer.resetOtpRequestLockedUntil = new Date(now + REQUEST_LOCK_MS);
            await customer.save();
            return res.status(429).json(new ApiError(429, "Too many OTP requests. Please try again after 15 minutes."));
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        customer.resetOtpHash = hashOtp(otpCode);
        customer.resetOtpExpiresAt = new Date(now + OTP_EXPIRY_MS);
        customer.resetOtpVerified = false;
        customer.resetOtpRequestCount = (customer.resetOtpRequestCount || 0) + 1;
        customer.resetOtpLastSentAt = new Date(now);
        customer.resetOtpVerifyAttempts = 0;
        customer.resetOtpVerifyLockedUntil = null;

        await customer.save();

        await sendForgotPasswordOtpEmail(customer.email, otpCode);

        return res.status(200).json(new ApiResponse(200, null, "Otp Sent Successfully."));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const email = req.body?.email?.trim()?.toLowerCase();
        const otp = String(req.body?.otp || "").trim();

        if (!email || !otp) {
            return res.status(400).json(new ApiError(400, "Email and OTP are required"));
        }

        const customer = await auth_Model.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!customer) {
            return res.status(404).json(new ApiError(404, "Email not Found."));
        }

        const now = Date.now();

        if (customer.resetOtpVerifyLockedUntil && new Date(customer.resetOtpVerifyLockedUntil).getTime() > now) {
            const retryAfterSeconds = Math.ceil((new Date(customer.resetOtpVerifyLockedUntil).getTime() - now) / 1000);
            return res.status(429).json(new ApiError(429, `Too many incorrect OTP attempts. Try again in ${retryAfterSeconds} seconds.`));
        }

        if (!customer.resetOtpHash || !customer.resetOtpExpiresAt) {
            return res.status(400).json(new ApiError(400, "OTP not requested. Please request OTP first."));
        }

        if (new Date(customer.resetOtpExpiresAt).getTime() < now) {
            clearForgotPasswordOtpState(customer);
            await customer.save();

            return res.status(400).json(new ApiError(400, "OTP expired. Please request a new OTP."));
        }

        if (customer.resetOtpHash !== hashOtp(otp)) {
            customer.resetOtpVerifyAttempts = (customer.resetOtpVerifyAttempts || 0) + 1;

            if (customer.resetOtpVerifyAttempts >= MAX_OTP_VERIFY_ATTEMPTS) {
                customer.resetOtpVerifyLockedUntil = new Date(now + VERIFY_LOCK_MS);
                await customer.save();
                return res.status(429).json(new ApiError(429, "Too many incorrect OTP attempts. Please try again after 10 minutes."));
            }

            await customer.save();
            return res.status(401).json(new ApiError(401, "Incorrect OTP"));
        }

        customer.resetOtpVerified = true;
        customer.resetOtpVerifyAttempts = 0;
        customer.resetOtpVerifyLockedUntil = null;
        await customer.save();

        return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const resetForgotPassword = async (req, res) => {
    try {
        const email = req.body?.email?.trim()?.toLowerCase();
        const password = req.body?.password;
        const confirmPassword = req.body?.confirmPassword;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json(new ApiError(400, "Email, password and confirmPassword are required"));
        }

        if (password !== confirmPassword) {
            return res.status(400).json(new ApiError(400, "Passwords do not match"));
        }

        const customer = await auth_Model.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!customer) {
            return res.status(404).json(new ApiError(404, "Email not Found."));
        }

        if (!customer.resetOtpVerified) {
            return res.status(401).json(new ApiError(401, "OTP verification required"));
        }

        if (!customer.resetOtpExpiresAt || new Date(customer.resetOtpExpiresAt).getTime() < Date.now()) {
            clearForgotPasswordOtpState(customer);
            await customer.save();
            return res.status(400).json(new ApiError(400, "OTP expired. Please request a new OTP."));
        }

        customer.password = await encryptPasswordMethod(password);
        clearForgotPasswordOtpState(customer);

        await customer.save();

        return res.status(200).json(new ApiResponse(200, null, "Password Change Successfully."));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        const { _id } = req.user;

        const userDetail = await auth_Model.findById(_id);

        const decryptPassword = await decryptPasswordMethod(oldPassword, userDetail.password);

        if (!decryptPassword) {
            return res.status(401).json(new ApiError(401, "Incorrect Old Password"));
        }

        await auth_Model.findByIdAndUpdate(
            { _id },
            { password: await encryptPasswordMethod(newPassword) }
        );

        return res.status(200).json(new ApiResponse(200, null, "Password Changes Successfully"));

    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const UpdateProfile = async (req, res) => {
    try {
        const { firstName, lastName, contact, gender } = req.body;
        const { _id } = req.user;

        const updateData = {};

        let userDetail = await auth_Model.findById(_id);

        // if(userDetail.contact){
        //     return res.status(401).json(new ApiError(401, "Duplicate Contact."));
        // }

        if (userDetail.profileImage) {
            await deleteFromCloudinary(userDetail.profileImage);
        }

        let image = null;

        if (req.file) {
            image = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "image" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(req.file.buffer);
            });
        }

        if (req.file) updateData.profileImage = image;
        if (contact) updateData.contact = parseInt(contact);
        if (gender) updateData.gender = gender;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (!lastName) updateData.lastName = ""

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update"
            });
        }

        let userData = await auth_Model.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true }
        );

        if (!userData) {
            return res.status(401).json(new ApiError(401, "Duplication Value"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Profile updated successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.message }]));
    }
};

const myProfile = async (req, res) => {
    try {
        const { _id } = req.user;

        const userDetail = await auth_Model.findById(_id);

        userDetail.password = undefined

        return res.status(200).json(new ApiResponse(200, userDetail, "SuccessFully"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const Signout = async (req, res) => {
    try {
        await res.clearCookie("AccessToken");
        await res.clearCookie("RefreshToken");

        return res.status(200).json(new ApiResponse(200, null, "Signout Successfully"))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
    }
}

const GoogleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        const client = new OAuth2Client(process.env.Google_ClientId)

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.Google_ClientId
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let nameArray = name.split(" ");

        let user = await auth_Model.findOne({ email });

        if (!user) {
            user = auth_Model({
                email: email,
                firstName: nameArray[0],
                lastName: (!nameArray[1]) ? "" : nameArray[1],
                profileImage: picture
            })

            await user.save();
        }

        await cookiesForUser(res, user);

        return res.status(200).json(new ApiResponse(200, user, "Successful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

export {
    Signup,
    Login,
    ForgotPassword,
    requestForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetForgotPassword,
    changePassword,
    Signout,
    UpdateProfile,
    myProfile,
    GoogleAuth
};