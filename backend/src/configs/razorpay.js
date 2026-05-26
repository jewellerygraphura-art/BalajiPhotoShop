import Razorpay from "razorpay";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if keys exist
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("⚠️ Razorpay keys are missing in .env file!");
  process.exit(1); // stop the app if keys missing
}

console.log("RAZORPAY KEY ID:", process.env.RAZORPAY_KEY_ID);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;