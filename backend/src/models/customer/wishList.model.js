import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const wishlistSchema = new Schema({
    customerId: {
        type: ObjectId,
        ref: "customer"
    },
    wishlist: [{
        productId:{
        type: ObjectId,
        ref: "product"
    },
        quantity: Number,
        purity: String,}
]
}, { timestamps: true });

wishlistSchema.index({ customerId: 1 });


const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;