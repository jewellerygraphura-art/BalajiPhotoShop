import { Router } from "express";
import productModel from "../../models/common/product.models.js";
import { ringProductsToSeed } from "../../utils/seedProducts.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";

const router = Router();

// Seed ring products for production (careful use only)
router.post("/seed-rings", async (req, res) => {
  try {
    const secret = req.query.secret;
    
    // Simple security check - use a secret in query param
    if (secret !== process.env.SEED_SECRET && secret !== "gcrown-seed-rings") {
      return res.status(403).json(new ApiError(403, "Unauthorized"));
    }

    // Check if products already exist
    const existingCount = await productModel.countDocuments({
      productCollection: { $in: ["Engagement Rings", "Wedding Bands", "Classic Solitaire", "Vintage Bands"] }
    });

    if (existingCount > 0) {
      return res.status(400).json(
        new ApiError(400, `Seed data already exists. Found ${existingCount} products in these collections.`)
      );
    }

    // Insert all products
    const inserted = await productModel.insertMany(ringProductsToSeed);

    return res.status(201).json(
      new ApiResponse(201, { count: inserted.length }, `Successfully seeded ${inserted.length} ring products`)
    );
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
});

export default router;
