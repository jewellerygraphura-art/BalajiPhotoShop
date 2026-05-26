import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
