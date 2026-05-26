import { ApiError } from "../utils/api-error.js";

const validateAdminSecurityKey = (req, res, next) => {
    const submittedKey = `${req.body?.securityKey || ""}`.trim();
    const configuredKey = `${process.env.securitykey || ""}`.trim();

    if (!configuredKey) {
        return res.status(500).json(new ApiError(500, "Admin security key is not configured"));
    }

    if (!submittedKey) {
        return res.status(400).json(new ApiError(400, "Security Key is required"));
    }

    if (submittedKey !== configuredKey) {
        return res.status(401).json(new ApiError(401, "Incorrect Security Key."));
    }

    return next();
};

export default validateAdminSecurityKey;
