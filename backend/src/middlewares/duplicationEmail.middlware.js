import customerModel from "../models/customer/user.model.js";
import adminModel from "../models/admin/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const duplicateEmail = async (req, res, next) => {
    try {

        const { email } = req.body;

        let isEmailPresentCustomer = await customerModel.findOne({ email: email });
        let isEmailPresentAdmin = await adminModel.findOne({ email: email });

        if (!isEmailPresentAdmin && !isEmailPresentCustomer) {
            return next();
        }

        return res.status(401).json(new ApiError(401, "Email Already Registrated"));

    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

export default duplicateEmail;