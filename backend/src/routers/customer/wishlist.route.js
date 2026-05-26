import { Router } from "express";
import {
  addWishlist,
  removeWishlist,
  removeAll,
  getWishlist,
} from "../../controllers/customer/wishlist.controllers.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js";

const router = Router();

router.get("/all", isAuth, getWishlist);
router.get("/allitem", isAuth, getWishlist);

router.post("/add", isAuth, addWishlist);

router.put("/remove", isAuth, removeWishlist);
router.delete("/remove", isAuth, removeWishlist);

router.put("/removeall", isAuth, removeAll);
router.delete("/clear", isAuth, removeAll);

export default router;