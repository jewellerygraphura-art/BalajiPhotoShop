import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Headphones,
  Truck as ShippingIcon,
  ArrowLeft,
} from "lucide-react";

// import p1 from "../../assets/trackingPage/p1.jpg";
// import p2 from "../../assets/trackingPage/p2.jpg";
// import p3 from "../../assets/trackingPage/p3.jpg";
// import p4 from "../../assets/trackingPage/p4.jpg";

/* ================= DATA ================= */

// const steps = [
//   {
//     label: "Order Placed",
//     date: "20 December 2025",
//     time: "11:00 AM",
//     done: true,
//   },
//   {
//     label: "Accepted",
//     date: "20 December 2025",
//     time: "11:00 AM",
//     done: true,
//   },
//   {
//     label: "In Progress",
//     date: "Expected 20 December 2025",
//     done: false,
//   },
//   {
//     label: "On The Way",
//     date: "Expected 20 December 2025",
//     done: false,
//   },
//   {
//     label: "Delivered",
//     date: "Expected 20 December 2025",
//     done: false,
//   },
// ];



const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// const products = [
//   { img: p1, name: "Gold Earring", qty: 4 },
//   { img: p2, name: "Gold Earring", qty: 4 },
//   { img: p3, name: "Gold Earring", qty: 4 },
//   { img: p4, name: "Gold Earring", qty: 4 },
// ];

/* ================= MAIN ================= */

export default function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  // const orderId = location.state?.orderId || "GCROWN12345";

  const { orderId: displayOrderId } = useParams(); // <-- gets orderId from URL

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchOrder = async () => {
    const res = await axios.get(
      `/api/v1/customer/order/track-order/${encodeURIComponent(displayOrderId)}`
    );
    setOrderData(res.data);
    console.log(res.data)
    setLoading(false)
  };
  fetchOrder();
}, [displayOrderId]);


  if (loading) return <p className="text-center mt-20">Loading order...</p>;
  if (!orderData) return <p className="text-center mt-20">No order found</p>;


  return (
    <main className="min-h-screen bg-[#FBF6EA] px-4 sm:px-6 py-8 sm:py-12 font-cormorant text-[#0F241A]">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(`/track-order/${displayOrderId}`)}
          className="flex items-center gap-2 text-[#0F241A] mb-6 hover:text-[#CBA135] transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Tracking</span>
        </button>

        <h1 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-medium tracking-wide">
          Order Tracking
        </h1>

        <OrderStatus orderData={orderData} displayOrderId={displayOrderId} />
        <OrderInfo orderData={orderData} />
        <Products orderData={orderData} />
        <Services />
      </div>
    </main>
  );
}


/* ================= ORDER STATUS ================= */

function OrderStatus({ orderData, displayOrderId }) {
  const buildSteps = () => {
    let baseSteps = [...orderData.steps];

    // If refund requested
    if (orderData.orderStatus === "Refund Requested") {
      baseSteps.push({
        label: "Refund Requested",
        done: true,
        date: orderData.refundRequest?.requestedAt || new Date()
      });

      baseSteps.push({
        label: "Refund Processing",
        done: false
      });
    }

    if (orderData.orderStatus === "Refunded") {
      baseSteps.push({
        label: "Refund Requested",
        done: true,
        date: orderData.refundRequest?.requestedAt
      });

      baseSteps.push({
        label: "Refund Successful",
        done: true,
        date: orderData.refundDate
      });
    }

    return baseSteps;
  };

  const steps = buildSteps();

  return (
    <section className="mx-auto mb-8 sm:mb-14">
      <h2 className="mb-2 text-lg sm:text-xl font-semibold">Order Status</h2>
      <p className="mb-6 text-sm text-gray-600">
        Order ID : <span className="font-medium">#{displayOrderId}</span>
      </p>

      <div className="rounded-lg border border-[#CFC7B5] bg-white px-4 sm:px-6 py-8 sm:py-10 shadow-sm">
        <div
          className="relative flex flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-6"
          role="progressbar"
        >
          {steps.map((step, i) => {
            const isCompleted = step.done;
            const isLast = i === steps.length - 1;

            let displayDate = "";
            if (isCompleted && step.date) {
              displayDate = formatDate(step.date);
            } else if (!isCompleted) {
              const estDate = new Date(orderData.createdAt);
              estDate.setDate(estDate.getDate() + (i * 2));
              displayDate = `Expected ${formatDate(estDate)}`;
            }

            return (
              <div
                key={i}
                className="relative flex-1 min-w-[120px] sm:min-w-[140px] text-center"
              >
                {/* CONNECTOR */}
                {!isLast && (
                  <span
                    className={`hidden sm:block absolute top-[14px] left-[60%] h-[2px] w-[80%] ${
                      isCompleted ? "bg-[#1F3B2D]" : "bg-[#D6D6D6]"
                    }`}
                  />
                )}

                {/* STEP DOT */}
                <div
                  className={`relative z-10 mx-auto mb-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border transition-all ${
                    isCompleted
                      ? "bg-[#C9A24D] border-[#C9A24D] shadow-md"
                      : "bg-[#E0E0E0] border-[#CFC7B5]"
                  }`}
                >
                  {isCompleted && <Check size={16} className="text-white" />}
                </div>

                <p
                  className={`text-xs sm:text-sm font-medium ${
                    !isCompleted ? "text-gray-400" : ""
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                  {displayDate}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================= ORDER INFO ================= */

function OrderInfo({ orderData }) {
  return (
    <section className="mx-auto mb-8 sm:mb-14 rounded-lg border border-[#CFC7B5] bg-white shadow-sm overflow-hidden">
      <h3 className="border-b border-[#CFC7B5] px-4 sm:px-6 py-4 font-semibold text-lg">
        Order Information
      </h3>

      <div className="divide-y divide-[#E2DCCB]">
        <InfoRow label="Order Date" value={formatDate(orderData.createdAt)} />
        <InfoRow label="Estimated Delivery"
          value={formatDate(
            new Date(new Date(orderData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
          )} />
        <InfoRow label="Payment Method" value={orderData.method || "Razorpay"} />
      </div>

      <div className="flex justify-between bg-[#0F241A] px-4 sm:px-6 py-4 font-medium text-white">
        <span>Total :</span>
        <span>₹ {orderData.total ? orderData.total.toLocaleString('en-IN') : "0"}</span>
      </div>
    </section>
  );
}

/* ================= PRODUCTS ================= */

function Products({ orderData }) {
  return (
    <section className="mx-auto mb-12 sm:mb-16 rounded-lg border border-[#CFC7B5] bg-white shadow-sm overflow-hidden">
      <h3 className="border-b border-[#CFC7B5] px-4 sm:px-6 py-4 font-semibold text-lg">
        Products
      </h3>

      <div className="divide-y divide-[#E2DCCB]">
        {orderData.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <img
              src={item.img || p1}
              alt={item.productName}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base">{item.productName}</p>
              <p className="text-xs sm:text-sm text-gray-600">
                {item.category || "Jewellery"} | {item.quantity} Qty.
              </p>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              ₹ {item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= SERVICES ================= */

function Services() {
  return (
    <section className="mx-auto grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
      <Service
        icon={<ShippingIcon size={20} />}
        title="Free Shipping"
        desc="Free Shipping for Order above ₹ 2,000"
      />
      <Service
        icon={<CreditCard size={20} />}
        title="Flexible Payment"
        desc="Multiple secure payment options"
      />
      <Service
        icon={<Headphones size={20} />}
        title="24x7 Support"
        desc="We support online all days"
      />
    </section>
  );
}

/* ================= SMALL COMPONENTS ================= */

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between px-6 py-4 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Service = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-[#CFC7B5] shadow-sm hover:shadow-md transition-shadow">
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#0F241A] text-white flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-medium text-sm sm:text-base">{title}</p>
      <p className="text-xs sm:text-sm text-gray-600">{desc}</p>
    </div>
  </div>
);