import express from "express";
import {
  getAllOrders,
  getOrders,
  createOrder,
  updateOrderStatus,
  generateInvoice,
  saveOrder,
  cancelOrder,
  requestRefund,
  processRefund
} from "../../controllers/order/order.controller.js";
import { trackOrder } from "../../controllers/order/trackOrderController.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js"

const router = express.Router();

router.get("/track-order/:displayOrderId", trackOrder);

router.get("/all", getAllOrders)
router.get("/", isAuth, getOrders);
router.post("/create",isAuth, createOrder);
router.put("/:id/status",isAuth, updateOrderStatus);
router.get("/:id/invoice", generateInvoice);
router.post("/save", isAuth, saveOrder);
router.put("/cancel/:id",isAuth, cancelOrder);
router.put("/refund/:orderId", requestRefund);
router.post("/process-refund/:orderId", isAuth, processRefund);


export default router;
