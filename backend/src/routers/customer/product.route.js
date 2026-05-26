import {Router} from "express";
import {getAllProducts, getProductById, addReview, getProductReviews, newArrivalProducts} from "../../controllers/customer/product.controllers.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js";

const router = Router();

router.route("/review").post(isAuth, addReview);
router.route("/all").get( getAllProducts);
router.route("/productId/:id").get(getProductById);
router.route("/newarrival").get(newArrivalProducts);
router.route("/:productId/reviews").get(getProductReviews);


export default router