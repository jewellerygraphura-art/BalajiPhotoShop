import express from "express";
import { updateOrderStatus } from "../../controllers/admin/order.controllers.js";

const router = express.Router();



router.patch("/:orderId/status", updateOrderStatus);

export default router;
