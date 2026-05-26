import mongoose, { Schema } from "mongoose";

const auth_Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage:{
        type: String
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        unique: true,
        sparse: true
    },
    gender: {
        type: String
    }
},
    { timestamps: true }
);

const authModel = mongoose.model("admin", auth_Schema);

export default authModel;