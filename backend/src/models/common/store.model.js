import mongoose, { Schema } from "mongoose";

const showroomSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            index: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: "India"
        },
        timings: {
            open: {
                type: String,
                    required: true
            },
            close: {
                type: String,
                required: true
            }
        },
        phone: {
            type: String,
            required: true
        },
        seeDesignsImages: [String],
        navigateURL: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);


showroomSchema.index({ city: 1, state: 1, pincode: 1, name: 1 });
showroomSchema.index({ name: "text", address: "text" });

export default mongoose.model("Showroom", showroomSchema);
