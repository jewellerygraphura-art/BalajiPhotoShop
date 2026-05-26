
import Address from "../../models/order/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const {
      firstName,
      lastName,
      country,
      address,
      city,
      state,
      zip,
      phone,
      email
    } = req.body;

    // Validate required fields
    if (
      !firstName || !lastName || !country || !address ||
      !city || !state || !zip || !phone || !email
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new address with userId
    const newAddress = new Address({
      userId: _id,   // attach addressing to the user
      firstName,
      lastName,
      country,
      address,
      city,
      state,
      zip,
      phone,
      email,
    });

    await newAddress.save();

    res.status(201).json({ message: "Address saved successfully", newAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAddresses = async (req, res) => {
  try {

    const { _id, role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not customer"))
    }

    const addresses = await Address.find({ userId: _id }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
