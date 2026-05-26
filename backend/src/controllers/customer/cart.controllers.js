import cart from "../../models/customer/cart.model.js";
import authModel from "../../models/customer/user.model.js";
import productModel from "../../models/common/product.models.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import mongoose from "mongoose";

const addItem = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const { productId, quantity = 1, purity } = req.body;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    // Verify B2B MOQ requirements
    const userDetail = await authModel.findById(_id);
    const isApprovedB2B = userDetail && userDetail.userType === "B2B" && userDetail.businessDetails?.isApproved;

    if (isApprovedB2B) {
      const product = await productModel.findById(productId);
      if (product && product.b2bMoq && quantity < product.b2bMoq) {
        return res.status(400).json(new ApiError(400, `Minimum order quantity for this product is ${product.b2bMoq} units.`));
      }
    }

    const userCart = await cart.findOne({ userId: _id });

    if (!userCart) {
      const newCart = await cart.create({
        userId: _id,
        cart: [{ productId, quantity, purity }]
      });

      return res.status(200).json(new ApiResponse(200, newCart, "Added to cart"));
    }

    // Check if product exists in cart already
    const existingItem = userCart.cart.find(
      (item) => item.productId.toString() === productId && item.purity === purity
    );

    if (existingItem) {
      // update quantity
      existingItem.quantity = quantity;
    } else {
      // push new item
      userCart.cart.push({ productId, quantity, purity });
    }

    await userCart.save();

    return res.status(200).json(new ApiResponse(200, userCart, "Added to cart"));
  }
  catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message, name: err.name }])
    );
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { _id, role } = req.user;
    let { productId, purity, quantity } = req.body;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    if (!productId) return res.status(400).json({ message: "Product ID required" });
    if (quantity === undefined) return res.status(400).json({ message: "Quantity required" });

    // Verify B2B MOQ requirements
    if (quantity > 0) {
      const userDetail = await authModel.findById(_id);
      const isApprovedB2B = userDetail && userDetail.userType === "B2B" && userDetail.businessDetails?.isApproved;

      if (isApprovedB2B) {
        const product = await productModel.findById(productId);
        if (product && product.b2bMoq && quantity < product.b2bMoq) {
          return res.status(400).json(new ApiError(400, `Minimum order quantity for this product is ${product.b2bMoq} units.`));
        }
      }
    }

    const userCart = await cart.findOne({ userId: _id });

    if (!userCart) return res.status(404).json({ message: "Cart not found" });

    productId = productId.toString();

    const itemIndex = userCart.cart.findIndex(
      (c) => c.productId.toString() === productId && c.purity === purity
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity <= 0) {
      userCart.cart.splice(itemIndex, 1);
    } else {
      userCart.cart[itemIndex].quantity = quantity;
    }

    await userCart.save();

    return res.status(200).json({ success: true, message: "Updated", data: userCart });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const userCart = await cart.findOne({ userId: _id });

    if (!userCart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    userCart.cart = [];
    await userCart.save();

    return res.status(200).json(new ApiResponse(200, userCart, "Cart cleared"));
  }
  catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message, name: err.name }])
    );
  }
};

const removeItem = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const { productId, purity } = req.body;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const userCart = await cart.findOne({ userId: _id });

    if (!userCart) return res.status(404).json(new ApiError(404, "Cart not found"));

    userCart.cart = userCart.cart.filter(
      (item) => !(item.productId.toString() === productId && item.purity === purity)
    );

    await userCart.save();

    return res.status(200).json(new ApiResponse(200, userCart, "Item removed"));
  }
  catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message, name: err.name }])
    );
  }
};

const getItems = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const userObjectId = new mongoose.Types.ObjectId(_id);

    const pipeline = [
      { $match: { userId: userObjectId } },

      { $unwind: "$cart" },

      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

      // 6. Shape the output
      {
        $project: {
          _id: 0,
          product: "$productDetails",
          quantity: "$cart.quantity",
          purity: "$cart.purity"
        }
      },

      {
        $group: {
          _id: null,
          cart: { $push: "$$ROOT" }
        }
      },

      { $project: { _id: 0, cart: 1 } }
    ];

    const result = await cart.aggregate(pipeline);

    const finalResult = result.length > 0 ? result[0] : { cart: [] };

    res.status(200).json(
      new ApiResponse(200, finalResult, "Cart items fetched successfully")
    );

  } catch (err) {
    res.status(500).json(new ApiError(500, err.message));
  }
};

export { addItem, updateItemQuantity, clearCart, removeItem, getItems };
