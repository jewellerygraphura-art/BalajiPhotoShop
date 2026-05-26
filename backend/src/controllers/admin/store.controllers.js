import Showroom from "../../models/common/store.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import {cloudinary, deleteFromCloudinary} from "../../configs/cloudinary.js";

const addShowroom = async (req, res) => {
    try {

        const { name, address, city, state, pincode, country, phone, navigateURL } = req.body;



        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        let image = [];

        for (const file of req.files) {
            const upload = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "store" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({
                            url: result.secure_url,
                            public_id: result.public_id
                        });
                    }
                );
                stream.end(file.buffer);
            });

            image.push(upload.url); // <-- IMPORTANT CHANGE
        }

        const showroom = Showroom(
            {
                name: name,
                address: address,
                city: city,
                state: state,
                pincode: pincode,
                country: country,
                timings: {
                    open: req.body["timings.open"],
                    close: req.body["timings.close"],
                },
                phone: phone,
                navigateURL: navigateURL,
                seeDesignsImages: image
            }
        );

        await showroom.save();

        return res.status(201).json(new ApiResponse(200, null, "Successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getShowrooms = async (req, res) => {
    try {
        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const store = await Showroom.find({});
        return res.status(200).json(new ApiResponse(200, store, "Successfull"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const softDeleteShowroom = async (req, res) => {
    try {
        const { id } = req.query;

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        await Showroom.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date()
        });

        return res.status(200).json({ success: true, message: "Soft deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const hardDeleteShowroom = async (req, res) => {
    try {
        const { id } = req.query;

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        let store = Showroom.findById(id);

        if (store.seeDesignsImages?.length) {
            await Promise.all(
                store.seeDesignsImages.map(imgUrl => deleteFromCloudinary(imgUrl))
            );
        }

        await Showroom.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Hard deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export { addShowroom, getShowrooms, softDeleteShowroom, hardDeleteShowroom };

