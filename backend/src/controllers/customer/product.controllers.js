import productModel from "../../models/common/product.models.js";
import authModel from "../../models/customer/user.model.js";
import Order from "../../models/order/Order.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeCollectionKey = (value = "") => value.trim().toLowerCase().replace(/\s+/g, " ");

const COLLECTION_SECTION_KEYWORDS = {
  "engagement rings": ["engagement", "proposal", "solitaire", "bridal"],
  "wedding bands": ["wedding", "band", "bands", "bridal"],
  "classic solitaire": ["classic", "solitaire", "single stone", "timeless"],
  "vintage bands": ["vintage", "heritage", "victorian", "retro", "band", "bands"]
};

const buildSectionClauses = (keywords = []) => {
  return keywords.flatMap((keyword) => {
    const regex = new RegExp(escapeRegExp(keyword), "i");
    return [
      { productCollection: regex },
      { name: regex },
      { tags: regex }
    ];
  });
};

const buildCollectionSearchTerms = (collectionName = "", aliases = []) => {
  const normalizedInput = collectionName.trim().toLowerCase();

  const tokenTerms = normalizedInput
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  return Array.from(
    new Set([
      normalizedInput,
      ...aliases.map((alias) => alias.toLowerCase()),
      ...tokenTerms
    ].filter(Boolean))
  );
};

const buildCollectionFallbackQuery = (terms = []) => {
  return terms.flatMap((term) => {
    const regex = new RegExp(escapeRegExp(term), "i");

    return [
      { productCollection: regex },
      { name: regex },
      { category: regex },
      { tags: regex }
    ];
  });
};

const isRingIntentCollection = (collectionName = "") => {
  return /(engagement|wedding|vintage|classic|solitaire|ring|rings|band|bands)/i.test(
    collectionName
  );
};

const buildRingIntentFallbackQuery = () => {
  return [
    { category: /ring/i },
    { name: /ring|bands?|solitaire|engagement|wedding|vintage|classic/i },
    { productCollection: /bridal|wedding|classic|vintage|sovereign/i },
    { tags: /ring|bands?|solitaire|engagement|wedding|vintage|classic/i }
  ];
};

const COLLECTION_ALIASES = {
  "engagement": ["bridal", "daily", "wedding collection", "royal bridal", "nature inspired collection"],
  "engagement ring": ["bridal", "daily", "wedding collection", "royal bridal", "nature inspired collection"],
  "engagement rings": ["bridal", "daily", "wedding collection", "royal bridal", "nature inspired collection"],
  "wedding": ["wedding collection", "sovereign men's edit", "royal bridal"],
  "wedding band": ["wedding collection", "sovereign men's edit", "royal bridal"],
  "wedding bands": ["wedding collection", "sovereign men's edit", "royal bridal"],
  "classic": ["royal", "daily", "modern classics", "luxury line"],
  "classic solitaire": ["royal", "daily", "modern classics", "luxury line"],
  "solitaire": ["daily", "royal", "modern classics", "luxury line"],
  "vintage": ["gentleman's edit / signature series", "sovereign men's edit", "festive", "heritage luxe", "royal heritage"],
  "vintage band": ["gentleman's edit / signature series", "sovereign men's edit", "festive", "heritage luxe", "royal heritage"],
  "vintage bands": ["gentleman's edit / signature series", "sovereign men's edit", "festive", "heritage luxe", "royal heritage"],
  "traditional": ["gentleman's edit / signature series", "festive", "daily", "heritage luxe", "royal heritage"]
};

const getAllProducts = async (req, res) => {
  try {
    let {
      collectionName,
      category,
      page = 1,
      limit = 10,
      productFor
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    let query = {
      deleted: { $ne: true },
      status: true
    };

    let normalizedCollectionName = "";
    let collectionAliases = [];

    if (collectionName) {
      normalizedCollectionName = normalizeCollectionKey(collectionName);
      const sectionKeywords = COLLECTION_SECTION_KEYWORDS[normalizedCollectionName] || [];
      collectionAliases = COLLECTION_ALIASES[normalizedCollectionName] || [];

      if (sectionKeywords.length) {
        query.$or = buildSectionClauses(sectionKeywords);
      } else if (collectionAliases.length) {
        query.$or = collectionAliases.map((alias) => ({
          productCollection: new RegExp(`^${escapeRegExp(alias)}$`, "i")
        }));
      } else {
        query.productCollection = new RegExp(`^${escapeRegExp(collectionName)}$`, "i");
      }
    }

    if (category) {
      query.category = new RegExp(`^${escapeRegExp(category)}$`, "i");
    }

    if (productFor) {
      query.productFor = {
        $in: [productFor.toLowerCase(), "both"]
      };
    }

    let activeQuery = query;
    let totalProducts = await productModel.countDocuments(activeQuery);

    if (collectionName && totalProducts === 0) {
      const fallbackTerms = buildCollectionSearchTerms(collectionName, collectionAliases);
      const fallbackClauses = buildCollectionFallbackQuery(fallbackTerms);

      if (fallbackClauses.length) {
        const { $or, productCollection, ...baseQuery } = query;
        activeQuery = {
          ...baseQuery,
          $or: fallbackClauses
        };

        totalProducts = await productModel.countDocuments(activeQuery);
      }

      if (totalProducts === 0 && isRingIntentCollection(collectionName)) {
        const ringFallbackClauses = buildRingIntentFallbackQuery();
        const { $or, productCollection, ...baseQuery } = query;

        activeQuery = {
          ...baseQuery,
          $or: ringFallbackClauses
        };

        totalProducts = await productModel.countDocuments(activeQuery);
      }
    }

    const products = await productModel
      .find(activeQuery)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            totalProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
            limit: limitNumber
          }
        },
        "Products fetched successfully"
      )
    );

  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message }])
    );
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productDetails = await productModel.findById(id);

    if (!productDetails) {
      return res.status(404).json(new ApiError(404, "Product not found."));
    }

    return res.status(200).json(new ApiResponse(200, productDetails, "Successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}

const newArrivalProducts = async (req, res) => {
  try {
    let productList = await productModel.find({
      deleted: { $ne: true },
      status: false
    }).sort({ createdAt: -1 }).lean();

    if (productList.length === 0) {
      return res.status(404).json(new ApiError(404, "No New Product Arrival"));
    }

    return res.status(200).json(new ApiResponse(200, productList, "Successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}

const addReview = async (req, res) => {
  try {
    const { productId } = req.query;
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    if (!productId) {
      return res.status(400).json(new ApiError(400, "Product id is required"));
    }

    let { title, comment, rating } = req.body;

    if (!title) {
      title = comment;
    }

    rating = Number(rating);

    if (!comment || !rating || rating < 1 || rating > 5) {
      return res.status(400).json(new ApiError(400, "Valid rating (1-5) and comment are required"));
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    const hasPurchasedProduct = await Order.exists({
      userId: _id,
      orderStatus: { $in: ["Confirmed", "Accepted", "Shipped", "Delivered"] },
      "products.productId": product._id
    });

    if (!hasPurchasedProduct) {
      return res.status(403).json(
        new ApiError(403, "You can review only products you purchased successfully")
      );
    }

    const alreadyReviewed = product.reviews.some(
      (review) => String(review.customerId) === String(_id)
    );

    if (alreadyReviewed) {
      return res.status(409).json(
        new ApiError(409, "You have already reviewed this product")
      );
    }

    const userDetail = await authModel.findById(_id);

    if (!userDetail) {
      return res.status(404).json(new ApiError(404, "Customer not found"));
    }

    product.reviews.push({
      customerId: _id,
      name: `${userDetail.firstName} ${userDetail.lastName}`,
      email: userDetail.email,
      title,
      comment,
      rating,
      media: userDetail.profileImage,
      createdAt: new Date()
    });

    const newReview = product.reviews[product.reviews.length - 1];

    product.rating.totalReviews = product.reviews.length;
    product.rating.avg =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.rating.totalReviews;

    await product.save();

    return res.status(200).json(
      new ApiResponse(200, newReview, "Review added successfully")
    );

  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sortBy = "newest" } = req.query;

    const product = await productModel.findById(productId).select("reviews");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = [...(product.reviews || [])];

    if (sortBy === "oldest") {
      reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highest") {
      reviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
      reviews.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else {
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export { getAllProducts, getProductById, addReview, getProductReviews, newArrivalProducts };
