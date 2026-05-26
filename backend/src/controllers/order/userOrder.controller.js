import Order from "../../models/order/Order.js";

const ORDER_STEPS = ['Order Placed', 'Accepted', 'In Progress', 'On The Way', 'Delivered'];

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(orderId)

        const order = await Order.findOne({ displayOrderId: orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        const steps = ORDER_STEPS.map((label, index) => {
  const stepDone = ORDER_STEPS.indexOf(label) <= ORDER_STEPS.indexOf(order.status);

  let date = "";
  let time = "";

  if (stepDone) {
    const created = new Date(order.createdAt);
    if (index === 0 || index === 1) {
      // Only first 2 steps get time
      date = created.toISOString().split('T')[0];
      const hours = created.getHours();
      const minutes = created.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      time = `${hour12}:${minutes} ${ampm}`;
    } else {
      date = created.toISOString().split('T')[0];
    }
  } else {
    const expectedDate = new Date(order.createdAt.getTime() + 24*60*60*1000 * index);
    date = `Expected ${expectedDate.toISOString().split('T')[0]}`;
  }

  return { label, done: stepDone, date, time };
});

        res.json({
            orderId: order.displayOrderId,
            status: order.orderStatus,
            createdAt: order.date,
            products: order.products,
            steps,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
