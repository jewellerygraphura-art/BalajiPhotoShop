import wishlistModel from "../../models/customer/wishList.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import mongoose from "mongoose";

const addWishlist = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const { productId, quantity = 1, purity } = req.body;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const userWishlist = await wishlistModel.findOne({
      customerId: _id,
    });

    // 🔹 If wishlist does not exist → create new
    if (!userWishlist) {
      const newWishlist = await wishlistModel.create({
        customerId: _id,
        wishlist: [{ productId, quantity, purity }],
      });

      return res.status(200).json(
        new ApiResponse(200, newWishlist, "Added to wishlist")
      );
    }

    const existingItem = userWishlist.wishlist.find(
      (item) =>
        item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(409).json(
        new ApiError(409, "Product already in wishlist")
      );
    }

    // 🔹 Push new item
    userWishlist.wishlist.push({ productId, quantity, purity });

    await userWishlist.save();

    return res.status(200).json(
      new ApiResponse(200, userWishlist, "Added to wishlist")
    );

  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [
        { message: err.message, name: err.name }
      ])
    );
  }
};

const removeWishlist = async (req, res) => {
  try {
    const { productId} = req.body;
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(
        new ApiError(401, "You are not a customer")
      );
    }

    const wishlist = await wishlistModel.findOneAndUpdate(
      { customerId: _id },
      {
        $pull: {
          wishlist: {
            productId: new mongoose.Types.ObjectId(productId),
          }
        }
      },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json(
        new ApiError(404, "Wishlist not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, wishlist, "Removed from wishlist")
    );

  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message)
    );
  }
};

const removeAll = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const wishlist = await wishlistModel.findOne({ customerId: _id });

    if (!wishlist) {
      return res.status(404).json(
        new ApiError(404, "Wishlist not found")
      );
    }


    wishlist.wishlist = [];

    await wishlist.save();

    return res.status(200).json(
      new ApiResponse(200, null, "Wishlist cleared successfully")
    );

  } catch (err) {
    return res.status(500).json(
      new ApiError(
        500,
        err.message,
        [{ message: err.message, name: err.name }]
      )
    );
  }
};

const getWishlist = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(
        new ApiError(401, "You are not a customer")
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(_id);

    const pipeline = [
      { $match: { customerId: userObjectId } },

      { $unwind: "$wishlist" },

      {
        $lookup: {
          from: "products",
          localField: "wishlist.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          product: "$productDetails",
          quantity: "$wishlist.quantity",
          purity: "$wishlist.purity"
        }
      },

      {
        $group: {
          _id: null,
          wishlist: { $push: "$$ROOT" }
        }
      },

      { $project: { _id: 0, wishlist: 1 } }
    ];

    const result = await wishlistModel.aggregate(pipeline);

    const finalResult =
      result.length > 0 ? result[0] : { wishlist: [] };

    return res.status(200).json(
      new ApiResponse(
        200,
        finalResult,
        "Wishlist items fetched successfully"
      )
    );

  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message)
    );
  }
};

export { addWishlist, removeWishlist, removeAll, getWishlist };
