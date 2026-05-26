import Order from "../../models/order/Order.js";

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ displayOrderId: req.params.displayOrderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const steps = [
      { label: "Confirmed", done: true, date: order.date },
      { label: "Accepted", done: ["Accepted","Shipped","Delivered"].includes(order.orderStatus), date: order.date },
      { label: "Shipped", done: ["Shipped","Delivered"].includes(order.orderStatus), date: order.date },
      { label: "Delivered", done: order.orderStatus === "Delivered", date: order.date }
    ];

    res.status(200).json({
      orderId: order.displayOrderId,
      createdAt: order.date,
      total: order.total,
      orderStatus: order.orderStatus,
      steps,
      items: order.products.map(p => ({
        productName: p.name,
        quantity: p.qty,
        price: p.price,
        img: p.productImage
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
