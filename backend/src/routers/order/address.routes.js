
import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} from "../../controllers/order/address.controller.js";

import isAuth from "../../middlewares/requiredLogin.middleware.js"

const router = express.Router();

router.post("/", isAuth, addAddress);
router.get("/", isAuth, getAddresses);
router.put("/:id", isAuth, updateAddress);
router.delete("/:id", isAuth, deleteAddress);

export default router;
