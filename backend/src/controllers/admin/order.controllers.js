import userOrderModel from "../../models/order/userOrder.model.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

       const ORDER_STEPS = [
      "Order Placed",
      "Accepted",
      "In Progress",
      "On The Way",
      "Delivered",
    ];

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!ORDER_STEPS.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowed: ORDER_STEPS,
      });
    }

    const order = await userOrderModel.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentIndex = ORDER_STEPS.indexOf(order.status);
    const newIndex = ORDER_STEPS.indexOf(status);

    if (newIndex < currentIndex) {
      return res.status(400).json({
        message: "Cannot move order status backwards",
      });
    }

    order.status = status;
    await order.save();

    return res.json({
      message: "Order status updated",
      orderId: order.orderId,
      status: order.status,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("ADMIN ORDER UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



