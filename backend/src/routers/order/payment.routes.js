import express from "express";
import { createOrder} from "../../controllers/order/payment.controller.js";
import {verifyPayment} from "../../controllers/order/payment.controller.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js"


const router = express.Router();
router.post("/create", createOrder);
router.post("/create-order", createOrder);
router.post("/verify",isAuth, verifyPayment);



export default router;
