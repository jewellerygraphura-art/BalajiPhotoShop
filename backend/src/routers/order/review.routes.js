import express from "express";
import Review from "../../models/order/Review.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {

    const { orderId, rating, comment } = req.body;

    const review = new Review({ orderId, rating, comment });
    await review.save();

    res.json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
