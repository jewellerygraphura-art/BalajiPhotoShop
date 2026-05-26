import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId},
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  country:   { type: String, required: true },
  address:   { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  zip:       { type: String, required: true },
  phone:     { type: String, required: true },
  email:     { type: String, required: true },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
