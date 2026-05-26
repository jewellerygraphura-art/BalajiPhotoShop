import {Router} from "express";
import {addItem, updateItemQuantity, clearCart, removeItem, getItems} from "../../controllers/customer/cart.controllers.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js";

const router = Router();

router.route("/add").post(isAuth, addItem);
router.route("/remove").put(isAuth, removeItem);
router.route("/updateQuantity").put(isAuth, updateItemQuantity);
router.route('/clear').put(isAuth, clearCart);
router.route("/all").get(isAuth, getItems);

export default router;

