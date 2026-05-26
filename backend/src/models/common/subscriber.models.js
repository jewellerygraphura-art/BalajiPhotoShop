import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  usedCodes: {
    type: [String],
    default: []
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const subscriberModel = mongoose.model("Subscriber", subscriberSchema);

export default subscriberModel;