import {Router} from "express";
import mongoose from "mongoose";
import userOrderModel from "../../models/order/userOrder.model.js";
import { getOrderById } from "../../controllers/order/userOrder.controller.js";
import { trackOrder } from "../../controllers/order/trackOrderController.js";
import { getAllOrders } from "../../controllers/order/order.controller.js";
const router = Router();

router.get("/all", getAllOrders)
router.get("/track-order/:displayOrderId", trackOrder);
router.get("/:orderId", getOrderById);



export default router;
