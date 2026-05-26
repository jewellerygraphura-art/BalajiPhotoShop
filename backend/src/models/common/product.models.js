import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const product_Schema = new Schema({
    productImage:{ type: [String] },
    name: {
        type: String,
        required: true,
    },
    productFor:{
        type: String,
        enum: ["male", "female", "kid", "both"],
        default: "both",
        index: true
    },
    slug: {
        type: String,
    },

    category: {
        type: String,
    },
    productCollection: {
        type: String,
    },

    tags: {
        type: [String],
    },
    brand: {
        type: String
    },
    sku: {
        type: String,
        unique: true
    },
    attributes: {
        purity: [String],
        gemstone: String,
        color: String,
        material: String,
        weight: Number,
        brand: String
    },
    price: {
        mrp: Number,
        sale: Number,
        currency: {
            type: String,
            default: "INR"
        }
    },
    b2bPrice: {
        mrp: Number,
        sale: Number
    },
    b2bMoq: {
        type: Number,
        default: 1
    },
    stockStatus: {
        type: String,
        enum: ["In Stock", "Out of Stock"],
        default: "In Stock"
    },
    variants: [{
        purity: String,
        quantity: Number,
        weight: Number,
        price: Number,
        sale: Number,
    }],
    rating: {
        avg: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        customerId: {
            type: ObjectId,
            ref: "customer"
        },
        name: String,
        email: String,
        title: String,
        comment: String,
        rating: Number,
        media: [{
            type: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    description: String,
    additionalInfo: String,
    status: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

product_Schema.index({ slug: 1, unique: true });
product_Schema.index({ sku: 1, unique: true });
product_Schema.index({ category: 1 });
product_Schema.index({ productCollection: 1 });
product_Schema.index({ tags: 1 });
product_Schema.index({ "attributes.material": 1 });
product_Schema.index({ "attributes.gemstone": 1 });
product_Schema.index({ "attributes.purity": 1 });
product_Schema.index({ "attributes.brand": 1 });
product_Schema.index({ "attributes.weight": 1 });
product_Schema.index({ stockStatus: 1 });
product_Schema.index({ createdAt: -1 });
product_Schema.index({ "rating.avg": -1 });
product_Schema.index({ "reviews.rating": 1 });
product_Schema.index({ "reviews.createdAt": -1 });

product_Schema.index({
    category: 1,
    "attributes.material": 1,
    "attributes.gemstone": 1
});

product_Schema.index({
    category: 1,
    productCollection: 1,
    "price.sale": 1
});

product_Schema.index({
    tags: 1,
    productCollection: 1
});

product_Schema.index({
    "attributes.material": 1,
    "attributes.purity": 1
});

product_Schema.index({
    "attributes.weight": 1,
    "attributes.material": 1
});

product_Schema.index({
    category: 1,
    "rating.avg": -1
});

product_Schema.index({
    category: 1,
    tags: 1,
    "rating.avg": -1
});

product_Schema.index({
    "attributes.brand": 1,
    category: 1,
    productCollection: 1
});

product_Schema.index({
    "attributes.brand": 1,
    "price.sale": 1
});

product_Schema.index({
    "attributes.brand": 1,
    tags: 1
});

product_Schema.index({
    "attributes.brand": 1,
    "rating.avg": -1
});

product_Schema.index(
    { name: "text", description: "text", tags: "text" },
    { partialFilterExpression: { stockStatus: "In Stock" } }
);

product_Schema.index({
    status: 1,
    stockStatus: 1,
    category: 1,
    productCollection: 1,
    "price.sale": 1,
    "rating.avg": -1
});

product_Schema.index({
    status: 1,
    deleted: 1,
});


const product_Model = mongoose.model("product", product_Schema);

export default product_Model;



