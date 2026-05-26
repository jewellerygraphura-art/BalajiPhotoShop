import auth_Model from "../../models/customer/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

// Fetch pending B2B accounts requiring approval
const getPendingB2BUsers = async (req, res) => {
    try {
        const pendingUsers = await auth_Model.find({
            userType: "B2B",
            "businessDetails.isApproved": false
        }).select("-password");

        return res.status(200).json(new ApiResponse(200, pendingUsers, "Pending B2B users retrieved successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
};

// Fetch approved B2B accounts
const getApprovedB2BUsers = async (req, res) => {
    try {
        const approvedUsers = await auth_Model.find({
            userType: "B2B",
            "businessDetails.isApproved": true
        }).select("-password");

        return res.status(200).json(new ApiResponse(200, approvedUsers, "Approved B2B users retrieved successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
};

// Approve B2B Business Account
const approveB2BUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await auth_Model.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        if (user.userType !== "B2B") {
            return res.status(400).json(new ApiError(400, "User is not a B2B registrant"));
        }

        user.businessDetails.isApproved = true;
        user.businessDetails.approvedAt = new Date();
        await user.save();

        return res.status(200).json(new ApiResponse(200, user, "Business account approved successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
};

// Reject / Revoke B2B Business Account
const rejectB2BUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await auth_Model.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        if (user.userType !== "B2B") {
            return res.status(400).json(new ApiError(400, "User is not a B2B registrant"));
        }

        user.businessDetails.isApproved = false;
        user.businessDetails.approvedAt = null;
        await user.save();

        return res.status(200).json(new ApiResponse(200, user, "Business account rejected/revoked successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
};

export {
    getPendingB2BUsers,
    getApprovedB2BUsers,
    approveB2BUser,
    rejectB2BUser
};
