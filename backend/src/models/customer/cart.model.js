import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: "User"
    },
    cart: [{
        productId: {
            type: ObjectId,
            ref: "products"
        },
        quantity: Number,
        purity: String,
    }]
})

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;