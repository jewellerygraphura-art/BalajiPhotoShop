
import Order from "../../models/order/Order.js";
// import { ApiError } from "../../utils/api-error.js";

const ALLOWED_STATUS_TRANSITIONS = {
  Confirmed: ["Accepted", "Cancelled"],
  Accepted: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Returned"],
  Delivered: ["Returned"],
  Returned: ["Refund Requested"],
  "Refund Requested": ["Refunded"],
  Refunded: [],
  Cancelled: []
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (startDate && endDate) {

      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setHours(23, 59, 59, 999); // ✅ fix

      query.date = {
        $gte: start,
        $lte: end,
      };
    }
    else if (startDate) {

      const start = new Date(startDate);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    const orders = await Order.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getOrdersById = async (req, res) => {
  try{

    console.log(req.params.orderId)
    const order = await Order.findOne({ displayOrderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({order: order})
  }
  catch(err){
    return res.status(500).json({error: err.message})
  }
}


export const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const currentStatus = order.orderStatus;

    if (currentStatus === status) {
      return res.status(200).json(order);
    }

    const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${currentStatus} to ${status}`,
        currentStatus,
        allowedNextStatuses
      });
    }


    order.orderStatus = status;
    order.statusText = `Your order is ${status}`;

    await order.save();

    const updatedOrder = await Order.findById(req.params.id);
    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
