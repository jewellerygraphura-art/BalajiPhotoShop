import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Checkout() {

  const location = useLocation();
  const order = location.state?.order;

  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, isApprovedB2B } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentDrawer, setPaymentDrawer] = useState(false);

  const displayItems = useMemo(() => {
    if (order?.items) return order.items;
    return cartItems.map(item => {
      const variant = item.product.variants?.find(v => v.purity === item.purity);
      let price = Number(variant?.sale || item.product.price?.sale || 0);
      if (isApprovedB2B && item.product.b2bPrice?.sale) {
        price = Number(item.product.b2bPrice.sale);
      }
      return {
        productId: item.product._id,
        name: item.product.name,
        purity: item.purity,
        price,
        quantity: item.quantity,
        productImage: item.product.productImage?.[0]
      };
    });
  }, [order, cartItems, isApprovedB2B]);

  const GST_RATE = 0.18;

  const { subtotal, gst, shipping, discountAmount, total, discountPercent } = useMemo(() => {
  if (order) {
    return {
      subtotal: order.subtotal,
      shipping: order.shipping,
      discountAmount: order.discountAmount,
      discountPercent: order.discountPercent,
      gst: order.subtotal * GST_RATE,
      total: order.total + (order.subtotal * GST_RATE) // GST added afterward
    };
  }

  // fallback if no order state
  const sub = getCartTotal();
  const gstAmount = sub * GST_RATE;
  const ship = sub > 0 ? 12 : 0;
  return {
    subtotal: sub,
    discountAmount: 0,
    discountPercent: 0,
    shipping: ship,
    gst: gstAmount,
    total: sub + gstAmount + ship
  };
}, [order, getCartTotal]);


  const methods = [
    { name: "Razorpay", icon: "data:image/png;base64,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", link: "Linked" },
    { name: "Paypal", icon: "https://cdn-icons-png.flaticon.com/128/174/174861.png", link: "Linked" },
    { name: "Visa", icon: "https://cdn-icons-png.flaticon.com/128/16144/16144944.png", link: "**** 4331" },
    { name: "Google Pay", icon: "https://cdn-icons-png.flaticon.com/128/6124/6124998.png", link: "Not Linked" }
  ];

  const redirectToPaymentFail = (reason, method = "Payment") => {
    navigate("/payment-fail", {
      state: {
        reason: reason || "Payment could not be completed.",
        method,
      },
    });
  };

  const handleSubmit = async () => {
    if (!selectedAddress) {
      alert("Please select delivery address first");
      return;
    }

    try {
      setIsProcessing(true);

      const { data } = await axios.post(
        "/api/payment/create-order",
        { amount: total },
        { withCredentials: true }
      );

      const options = {
        key: "rzp_test_S2ZQ4KbV345VDy",
        amount: data.amount,
        currency: "INR",
        name: "Balaji Gift Shop",
        description: "Order Payment",
        order_id: data.id,

        handler: async (response) => {
          try {
            const formattedAddress = {
              fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
              mobile: selectedAddress.phone,
              addressLine: selectedAddress.address,
              city: selectedAddress.city,
              state: selectedAddress.state,
              pincode: selectedAddress.zip
            };

            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: cartItems.map(item => {
                let price = item.product.variants?.find(v => v.purity === item.purity)?.sale || 0;
                if (isApprovedB2B && item.product.b2bPrice?.sale) {
                  price = item.product.b2bPrice.sale;
                }
                return {
                  productId: item.product._id,
                  name: item.product.name,
                  price,
                  quantity: item.quantity,
                  productImage: item.product.productImage?.[0],
                  carat: item.purity
                };
              }),
              totalAmount: total,
              subtotal,
              gst,
              shipping,
              address: formattedAddress
            }, { withCredentials: true });

            if (!verifyRes?.data?.success) {
              redirectToPaymentFail(verifyRes?.data?.message || "Payment verification failed", "Razorpay");
              return;
            }

            clearCart();
            navigate("/order-success");
          } catch (verifyError) {
            redirectToPaymentFail(verifyError?.response?.data?.message || "Payment verification failed", "Razorpay");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            redirectToPaymentFail("Payment popup was closed before completion.", "Razorpay");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setIsProcessing(false);
        redirectToPaymentFail(
          response?.error?.description || response?.error?.reason || "Payment failed at gateway",
          "Razorpay"
        );
      });
      rzp.open();
      setIsProcessing(false);

    } catch (error) {
      console.log(error);
      redirectToPaymentFail(error?.response?.data?.message || "Payment request failed", "Razorpay");
      setIsProcessing(false);
    }
  };

  const handlePayPal = async () => {
    if (!selectedAddress) {
      alert("Please select delivery address first");
      return;
    }

    try {
      setIsProcessing(true);

      // 1) create PayPal order on backend
      const { data } = await axios.post(
        "/api/payment/createPaypal",
        { amount: total },
        { withCredentials: true }
      );

      // 2) redirect user to PayPal
      if (data?.approve_url) {
        window.location.href = data.approve_url;
      } else {
        redirectToPaymentFail("Unable to initiate PayPal payment", "Paypal");
      }

    } catch (error) {
      console.log(error);
      redirectToPaymentFail(error?.response?.data?.message || "PayPal payment failed", "Paypal");
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    axios.get("/api/addresses", {
      withCredentials: true
    })
      .then(res => setAddresses(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    const verify = async () => {
      try {
        const resp = await axios.post(
          "/api/payment/verifyPaypal",
          { token },
          { withCredentials: true }
        );

        if (resp.data.success) {
          clearCart();
          navigate("/order-success");
        } else {
          redirectToPaymentFail(resp?.data?.message || "PayPal verification failed", "Paypal");
        }
      } catch (err) {
        redirectToPaymentFail(err?.response?.data?.message || "PayPal verification failed", "Paypal");
      }
    };

    verify();
  }, []);


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FAF7ED] min-h-screen font-serif relative">

      {/* Loader */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C3A2C]/90 flex flex-col items-center justify-center text-white backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-[#D4AF37] rounded-full mb-4"
            />
            <p className="tracking-[0.4em] uppercase text-sm animate-pulse">
              Securing Your Elegance...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12 border-b border-[#E5DDCC] pb-6">
          <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-[#1C3A2C]">
            <ChevronLeft size={20} />
            <span>Return to Bag</span>
          </button>
          <h1 className="text-2xl text-[#1C3A2C] font-medium">Secure Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            {addresses.map(addr => (
              <div key={addr._id} className="border p-4 mb-3 bg-white flex justify-between">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => setSelectedAddress(addr)}
                  />
                  <div>
                    <p className="font-bold">{addr.firstName} {addr.lastName}</p>
                    <p>{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                    <p>{addr.phone}</p>
                  </div>
                </label>
              </div>
            ))}

            {/* Pay Button (Triggers Drawer) */}
            <button
              type="button"
              disabled={!selectedAddress}
              onClick={() => setPaymentDrawer(true)}
              className={`w-full py-5 ${!selectedAddress ? "bg-gray-400 cursor-not-allowed" : "bg-[#1C3A2C] text-white"}`}
            >
              Pay ₹{total.toFixed(2)}
            </button>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-10 border border-[#E5DDCC] bg-white p-8 shadow-sm">
              <h2 className="text-xl text-[#1C3A2C] mb-8 border-b border-[#E5DDCC] pb-4">Bag Summary</h2>

              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2">
                {displayItems.map(item => (
                  <div key={item.productId + item.purity} className="flex gap-4">
                    <img src={item.productImage} className="w-16 h-20 object-cover border border-[#E5DDCC]" alt="" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-[#1C3A2C]">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5">Purity: {item.purity} | Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-[#E5DDCC] pt-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>GST (18%)</span> <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 italic">
                  <span>Shipping</span> <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 italic">
                  <span>Discount</span> <span>₹{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#1C3A2C] border-t border-dashed border-[#E5DDCC] pt-4">
                  <span>Grand Total</span> <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Right Payment Drawer */}
      <AnimatePresence>
        {paymentDrawer && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-2xl z-[1000] p-6 flex flex-col"
          >
            <p className="text-lg font-semibold mb-5">Select Payment Method</p>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {methods.map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPaymentDrawer(false);
                    if (m.name === "Razorpay") {
                      handleSubmit();
                      return;
                    }

                    if (m.name === "Paypal") {
                      handlePayPal();
                      return;
                    }

                    redirectToPaymentFail(`${m.name} is currently unavailable`, m.name);
                  }}

                  className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={m.icon} className="w-8 h-8" />
                    <span className="font-medium">{m.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{m.link}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPaymentDrawer(false)}
              className="mt-4 w-full py-3 border border-gray-400 rounded-lg text-sm"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
