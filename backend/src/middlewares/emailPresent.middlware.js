import customerModel from "../models/customer/user.model.js";
import adminModel from "../models/admin/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const customerEmail = async (req, res, next) => {
    try {
        const rawEmail = req.body?.email;
        const email = rawEmail?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json(
                new ApiError(400, "Email is required")
            );
        }

        const isEmail = await customerModel.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!isEmail) {
            return res.status(404).json(
                new ApiError(404, "Email not Found.")
            );
        }

        req.body.email = isEmail.email;

        return next();

    } 
    catch (err) {
        if (res.headersSent) return;
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
};



const adminEmail = async (req, res, next) => {
    try {
        const rawEmail = req.body?.email;
        const email = rawEmail?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json(
                new ApiError(400, "Email is required")
            );
        }

        const isEmail = await adminModel.findOne({
            email: new RegExp(`^${escapeRegExp(email)}$`, "i")
        });

        if (!isEmail) {
            return res.status(404).json(
                new ApiError(404, "Email not Found.")
            );
        }

        req.body.email = isEmail.email;

        return next();

    } 
    catch (err) {
        if (res.headersSent) return;
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
}


export { customerEmail, adminEmail };