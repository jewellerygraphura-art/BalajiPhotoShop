import {Router} from "express";
import isAuth from "../../middlewares/requiredLogin.middleware.js";
import {subscribe,userCoupon} from "../../controllers/customer/subscriber.controllers.js";

const router = Router();

router.route("/subscribe").post(subscribe);
router.route("/useCoupon").post(isAuth, userCoupon);

export default router
