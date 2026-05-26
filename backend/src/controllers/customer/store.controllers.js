import Showroom from "../../models/common/store.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const getShowrooms = async (req, res) => {
    try {
        const store = await Showroom.find(
            { isDeleted: false }
        );
        return res.status(200).json(new ApiResponse(200, store, "Successfull"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const suggestions = async (req, res) => {
    try {
        const { keyword } = req.query;

        const store = await Showroom.find({
            isDeleted: false,
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { city: { $regex: keyword, $options: "i" } },
                { pincode: { $regex: keyword, $options: "i" } }
            ]
        }).limit(10);

        return res.status(200).json(new ApiResponse(200, store, "Successfull"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
};

const searchByCityPincode = async (req, res) => {
    try {
        const { city, pincode } = req.query;

        const store = await Showroom.find({
            city,
            pincode,
            isDeleted: false
        });

        return res.status(200).json(new ApiResponse(200, store, "Successfull"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
};

const searchByPincode = async (req, res) => {
    try {
        const { pincode } = req.query;

        const store = await Showroom.find({
            pincode,
            isDeleted: false
        });

        return res.status(200).json(new ApiResponse(200, store, "Successfull"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
};

const searchByCity = async (req, res) => {
    try {
        const { city } = req.query;

        const store = await Showroom.find({
            city: { $regex: city, $options: "i" },
            isDeleted: false
        }).sort({ name: 1 });

        return res.status(200).json(new ApiResponse(200, store, "Successfull"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
};

export {
    getShowrooms,
    suggestions,
    searchByCityPincode,
    searchByPincode,
    searchByCity,
};

