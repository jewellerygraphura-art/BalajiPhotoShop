import {Router} from "express";
import {getShowrooms,
    suggestions,
    searchByCityPincode,
    searchByPincode,
    searchByCity,} from "../../controllers/customer/store.controllers.js";

const router = Router();

router.route("/").get(getShowrooms);
router.route("/city").get(searchByCity);
router.route("pincode").get(searchByPincode);
router.route("city-pincode").get(searchByCityPincode);
router.route("/suggest").get(suggestions);

export default router;


