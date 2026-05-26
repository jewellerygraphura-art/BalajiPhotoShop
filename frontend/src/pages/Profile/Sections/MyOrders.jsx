import React, { useEffect, useState } from "react";
import axios from "axios";
import Earing from "../../../assets/NewArrivalAssets/earrings-1.png";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showRefund, setShowRefund] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const navigate = useNavigate();

  const openInvoice = (orderId) => {
    window.open(`/api/orders/${orderId}/invoice`, "_blank");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/v1/customer/order", {
          withCredentials: true,
        });
        setOrderList(res.data);
      } catch (err) {
        console.log("MyOrders Fetch Error:", err);
      }
    };

    fetchOrders();
    const timer = setInterval(fetchOrders, 3000);
    return () => clearInterval(timer);
  }, []);

  const submitReview = async () => {
    if (!selectedProductId) {
      return alert("Product not selected for review");
    }

    if (!rating || !comment?.trim()) {
      return alert("Please add a rating and comment");
    }

    try {
      await axios.post(
        `/api/v1/customer/product/review?productId=${selectedProductId}`,
        { rating, title: "", comment },
        { withCredentials: true }
      );
      alert("Review added Successfully");
      setShowReview(false);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    }
  };

  const canReviewOrder = (orderStatus) => {
    return ["Confirmed", "Accepted", "Shipped", "Delivered"].includes(orderStatus);
  };

  const cancelOrder = (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setRefundOrderId(id);
    setShowRefund(true);
  };

  const submitRefund = async () => {
    if (!refundReason.trim()) return alert("Please enter refund reason");
    try {
      await axios.put(
        `/api/orders/refund/${refundOrderId}`,
        { reason: refundReason },
        { withCredentials: true }
      );
      alert("Refund request submitted successfully");
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === refundOrderId
            ? { ...o, orderStatus: "Refund Requested", statusText: "Refund request submitted. Waiting for approval." }
            : o
        )
      );
      setShowRefund(false);
      setRefundReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed");
    }
  };

  const filteredOrders =
    filter === "All"
      ? orderList
      : orderList.filter((o) => o.orderStatus === filter);

  const statusColors = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    Accepted: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-600 border-red-200",
    "Refund Requested": "bg-orange-50 text-orange-600 border-orange-200",
    Refunded: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .float-1 { animation: float 4s ease-in-out infinite; }
        .float-2 { animation: float2 5s ease-in-out infinite 1s; }
        .fade-up { animation: fadeSlideUp 0.5s ease forwards; }
        .fade-up-delay-1 { animation: fadeSlideUp 0.5s ease 0.1s forwards; opacity: 0; }
        .fade-up-delay-2 { animation: fadeSlideUp 0.5s ease 0.2s forwards; opacity: 0; }
        .fade-up-delay-3 { animation: fadeSlideUp 0.5s ease 0.3s forwards; opacity: 0; }
        .order-card { animation: fadeSlideUp 0.4s ease forwards; opacity: 0; }
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(27,48,34,0.25); }
      `}</style>

      <div className="font-serif max-w-5xl px-2 sm:px-0">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#1B3022] tracking-wide">
              My Orders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {orderList.length > 0
                ? `${orderList.length} order${orderList.length > 1 ? "s" : ""} placed`
                : "Track and manage your purchases"}
            </p>
          </div>

          <div className="relative">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none border border-[#1B3022]/20 px-4 py-2 pr-10 text-sm text-[#1B3022] bg-white focus:outline-none focus:border-[#1B3022] cursor-pointer"
            >
              <option value="All">All Orders</option>
              <option value="Accepted">Accepted</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refund Requested">Refund Requested</option>
              <option value="Refunded">Refunded</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-[#1B3022]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8 w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-[#1B3022]/5"></div>

              <div className="absolute top-6 left-1/2 -translate-x-1/2 float-1">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <rect x="8" y="28" width="56" height="36" rx="2" fill="#1B3022" opacity="0.9"/>
                  <rect x="8" y="28" width="56" height="12" rx="2" fill="#1B3022"/>
                  <rect x="28" y="28" width="16" height="12" rx="1" fill="#b8962e" opacity="0.7"/>
                  <path d="M4 20 L36 8 L68 20 L36 28 Z" fill="#2d5240"/>
                  <rect x="30" y="8" width="12" height="22" rx="1" fill="#b8962e" opacity="0.5"/>
                </svg>
              </div>

              <div className="absolute top-4 right-6 float-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L11.8 7.4H17.6L12.9 10.8L14.7 16.2L10 12.8L5.3 16.2L7.1 10.8L2.4 7.4H8.2L10 2Z" fill="#b8962e" opacity="0.6"/>
                </svg>
              </div>
              <div className="absolute bottom-10 left-4 float-1" style={{animationDelay: '2s'}}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L11.8 7.4H17.6L12.9 10.8L14.7 16.2L10 12.8L5.3 16.2L7.1 10.8L2.4 7.4H8.2L10 2Z" fill="#1B3022" opacity="0.4"/>
                </svg>
              </div>
            </div>

            <div className="fade-up">
              <h3 className="text-2xl font-medium text-[#1B3022] mb-3 tracking-wide">
                {filter === "All" ? "No Orders Yet" : `No ${filter} Orders`}
              </h3>
            </div>
            <div className="fade-up-delay-1">
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-2">
                {filter === "All"
                  ? "Your order history is empty. Start exploring our curated collection and place your first order."
                  : `You don't have any orders with "${filter}" status right now.`}
              </p>
            </div>
            <div className="fade-up-delay-2">
              <p className="text-[#b8962e] text-xs font-medium tracking-widest uppercase mb-8">
                Premium Curated Gifts Await
              </p>
            </div>
            <div className="fade-up-delay-3 flex gap-3">
              <button
                onClick={() => navigate("/collections")}
                className="btn-hover bg-[#1B3022] text-white px-8 py-3 text-sm tracking-widest uppercase"
              >
                Shop Now
              </button>
              {filter !== "All" && (
                <button
                  onClick={() => setFilter("All")}
                  className="btn-hover border border-[#1B3022] text-[#1B3022] px-6 py-3 text-sm tracking-widest uppercase"
                >
                  View All
                </button>
              )}
            </div>

            <div className="mt-12 flex items-center gap-4 opacity-30">
              <div className="h-px w-16 bg-[#1B3022]"></div>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L11.8 7.4H17.6L12.9 10.8L14.7 16.2L10 12.8L5.3 16.2L7.1 10.8L2.4 7.4H8.2L10 2Z" fill="#1B3022"/>
              </svg>
              <div className="h-px w-16 bg-[#1B3022]"></div>
            </div>
          </div>
        )}

        {/* ORDER CARDS */}
        {filteredOrders.map((order, index) => (
          <div
            key={order._id}
            className="order-card bg-white border border-gray-100 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className="bg-[#1B3022] text-white p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs opacity-50 tracking-wider uppercase mb-1">Order ID</p>
                <p className="text-sm font-medium break-all">{order.displayOrderId}</p>
              </div>
              <div>
                <p className="text-xs opacity-50 tracking-wider uppercase mb-1">Total</p>
                <p className="text-sm font-semibold text-[#e8c96a]">
                  ₹{Number(order.totalAmount || order.grandTotal || order.payableAmount || order.total || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-50 tracking-wider uppercase mb-1">Payment</p>
                <p className="text-sm">{order.method}</p>
              </div>
              <div>
                <p className="text-xs opacity-50 tracking-wider uppercase mb-1">Date</p>
                <p className="text-sm">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>

            <div className="p-4">
              {order.products.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-gray-50 py-3 last:border-0">
                  <img
                    src={item.productImage?.[0] || Earing}
                    alt={item.name}
                    className="w-16 h-16 object-cover border border-gray-100"
                  />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-medium text-[#1B3022] text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4 pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/70 border-t border-gray-100">
              <div>
                <span className={`px-3 py-1 text-xs border rounded-full font-medium ${statusColors[order.orderStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {order.orderStatus}
                </span>
                {order.statusText && (
                  <p className="text-xs italic text-gray-400 mt-1.5">{order.statusText}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/track-order/${order.displayOrderId}`)}
                  className="btn-hover bg-[#1B3022] text-white px-4 py-2 text-xs tracking-wider uppercase"
                >
                  Track Order
                </button>
                <button
                  onClick={() => openInvoice(order._id)}
                  className="btn-hover border border-[#1B3022]/30 text-[#1B3022] px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#1B3022]/5"
                >
                  Invoice
                </button>
                <button
                  onClick={() => {
                    if (!canReviewOrder(order.orderStatus)) {
                      alert("Review is available only for successfully purchased orders");
                      return;
                    }

                    if (!order.products?.[0]?.productId) {
                      alert("No product found for this order");
                      return;
                    }

                    setShowReview(true);
                    setSelectedProductId(order.products[0].productId);
                  }}
                  className="btn-hover bg-[#b8962e]/10 text-[#b8962e] border border-[#b8962e]/30 px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#b8962e]/20"
                >
                  Review
                </button>
                {order.orderStatus === "Confirmed" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="btn-hover text-red-500 border border-red-200 px-4 py-2 text-xs tracking-wider uppercase hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* REVIEW MODAL */}
        {showReview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[420px] p-8 relative shadow-2xl">
              <button onClick={() => setShowReview(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <div className="mb-1 text-xs text-[#b8962e] tracking-widest uppercase">Share Your Experience</div>
              <h2 className="text-xl font-medium text-[#1B3022] mb-6">Add a Review</h2>

              <label className="block text-xs text-gray-500 tracking-wider uppercase mb-1.5">Rating</label>
              <div className="flex gap-2 mb-5">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill={star <= rating ? "#b8962e" : "none"} stroke={star <= rating ? "#b8962e" : "#ccc"} strokeWidth="1">
                      <path d="M10 2L11.8 7.4H17.6L12.9 10.8L14.7 16.2L10 12.8L5.3 16.2L7.1 10.8L2.4 7.4H8.2L10 2Z"/>
                    </svg>
                  </button>
                ))}
              </div>

              <label className="block text-xs text-gray-500 tracking-wider uppercase mb-1.5">Your Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Tell us about your experience..."
                className="border border-gray-200 w-full p-3 mb-5 text-sm focus:outline-none focus:border-[#1B3022] resize-none"
              />
              <button onClick={submitReview} className="btn-hover bg-[#1B3022] text-white px-4 py-3 w-full text-sm tracking-widest uppercase">
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* REFUND MODAL */}
        {showRefund && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[420px] p-8 relative shadow-2xl">
              <button onClick={() => setShowRefund(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <div className="mb-1 text-xs text-orange-500 tracking-widest uppercase">Order Cancellation</div>
              <h2 className="text-xl font-medium text-[#1B3022] mb-2">Refund Request</h2>
              <p className="text-sm text-gray-400 mb-6">Please let us know the reason for your cancellation.</p>

              <label className="block text-xs text-gray-500 tracking-wider uppercase mb-1.5">Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={4}
                placeholder="Describe why you want to cancel..."
                className="border border-gray-200 w-full p-3 mb-5 text-sm focus:outline-none focus:border-[#1B3022] resize-none"
              />
              <button onClick={submitRefund} className="btn-hover bg-[#1B3022] text-white px-4 py-3 w-full text-sm tracking-widest uppercase">
                Submit Refund Request
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
