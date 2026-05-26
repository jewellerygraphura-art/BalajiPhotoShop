import express from "express";
import { getAllOrders, updateOrderStatus, getOrdersById } from "../../controllers/order/adminOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);
router.get("/search/:orderId", getOrdersById)

export default router;
