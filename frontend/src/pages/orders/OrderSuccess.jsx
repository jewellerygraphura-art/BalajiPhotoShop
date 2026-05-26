import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Download, Check, Package, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeatureCard from "../../components/common/FeatureCard";
import axios from "axios";

// Asset Imports
import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCelebration, setShowCelebration] = useState(true);
  const openInvoice = () => {
  window.open(`/api/orders/${order._id}/invoice`, "_blank");
};

const [order, setOrder] = useState(null);

useEffect(() => {
  axios.get("/api/orders",{withCredentials: true})
    .then(res => {
      if (res.data.length > 0) {
        setOrder(res.data[res.data.length - 1]); // ✅ latest
      }
    })
    .catch(err => console.log(err));
}, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide celebration and show page after 3 seconds
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7ED] flex flex-col items-center justify-center p-4 text-center">
        <ShoppingBag size={64} className="text-[#1C3A2C] mb-4 opacity-20" />
        <h2 className="text-2xl font-serif text-[#1C3A2C]">No Recent Order Found</h2>
        <Link to="/collections" className="mt-8 bg-[#1C3A2C] text-white px-8 py-3 uppercase tracking-widest text-sm">
          Go to Collections
        </Link>
      </div>
    );
  }

 const subtotal = Number(order.subtotal || 0);
const taxAmount = Number(order.gst || 0);
const shipping = Number(order.shipping || 0);
const grandTotal = Number(order.total || 0);



  return (
    <div className="bg-[#FAF7ED] min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showCelebration ? (
          /* --- CONGRATS ANIMATION STAGE --- */
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-[#1C3A2C] flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
              className="relative"
            >
              <Check size={100} className="text-[#D4AF37] mb-8" strokeWidth={1.5} />
              {/* Animated Sparkles around the checkmark */}
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 text-[#D4AF37]"
              >
                <Sparkles size={32} />
              </motion.div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-4"
            >
              Congratulations!
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[#FAF7ED] text-lg md:text-xl font-light tracking-widest uppercase opacity-80"
            >
              Your Order Has Been Successfully Placed
            </motion.p>

            {/* Subtle Gold Dust Particles (Visual Only) */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ y: -20, x: Math.random() * 100 + "%" }}
                   animate={{ y: "100vh" }}
                   transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
                   className="w-1 h-1 bg-[#D4AF37] rounded-full absolute"
                 />
               ))}
            </div>
          </motion.div>
        ) : (
          /* --- MAIN CONTENT STAGE --- */
          <motion.main 
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-12 lg:py-20 font-serif"
          >
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
              
              <header className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1C3A2C] mb-6">
                  <Check size={24} className="text-[#D4AF37]" strokeWidth={3} />
                </div>
                <h1 className="text-4xl text-[#1C3A2C] font-medium tracking-tight mb-3">
                  A New Legacy Begins
                </h1>
                <p className="text-gray-600 italic">Order confirmation details are listed below.</p>
              </header>

              {/* DYNAMIC META BAR */}
              <div className="bg-[#1C3A2C] p-6 md:p-8 rounded-sm shadow-xl flex flex-wrap justify-between items-center gap-6 border-b-4 border-[#D4AF37] mb-12">
                <MetaItem label="Order ID" value={order.displayOrderId} />

                    <MetaItem 
  label="Date" 
  value={
    order.date 
      ? new Date(order.date).toLocaleDateString("en-IN") 
      : order.createdAt 
        ? new Date(order.createdAt).toLocaleDateString("en-IN") 
        : "N/A"
  }
/>


                      <MetaItem 
                      label="Status" 
                        value={order.orderStatus} 
                        isStatus 
                      />

                <button  onClick={openInvoice}
                className="flex items-center gap-2 bg-[#D4AF37] text-[#1C3A2C] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all"
                >
                <Download size={14} />
                 Invoice
                </button>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <section className="lg:col-span-8">
                  <div className="bg-white border border-[#E5DDCC] p-6 md:p-10">
                    <h2 className="text-2xl text-[#1C3A2C] mb-8 font-medium flex items-center gap-3">
                      <Package size={22} /> Items Purchased
                    </h2>
                    
                    <div className="divide-y divide-[#FAF7ED]">
                      {order.products?.map((item) => (
                        <div key={item.id} className="flex items-center gap-6 py-6">
                   <img
  src={
    item.productImage && item.productImage[0]
      ? item.productImage[0]
      : "/src/assets/NewArrivalAssets/earrings-1.png"
  }
  alt={item.name}
  className="w-20 h-24 object-cover border border-[#E5DDCC]"
/>






                          <div className="flex-grow">
                            <h4 className="text-[#1C3A2C] font-semibold text-lg">{item.name}</h4>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">
                              {item.category || 'Jewellery'} | Qty: {item.qty}

                            </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[#1C3A2C] font-bold">
                             ₹{(subtotal.toLocaleString() || 0).toLocaleString()}
                                      </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="lg:col-span-4">
                  <div className="bg-white border border-[#E5DDCC] p-8 sticky top-10 shadow-sm">
                    <h3 className="text-[#1C3A2C] font-semibold mb-6 border-b border-[#FAF7ED] pb-2 text-lg">Order Summary</h3>
                    <div className="space-y-4 text-sm">
                      {/* <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="text-[#1C3A2C] font-medium">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>GST (18%)</span>
                        <span className="text-[#1C3A2C] font-medium">₹{taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-green-700 font-bold uppercase text-[10px] tracking-widest">Complimentary</span>
                      </div>
                      <div className="pt-6 mt-4 border-t border-[#E5DDCC] flex justify-between items-end">
                        <span className="text-base font-bold text-[#1C3A2C]">Total Amount</span>
                        <span className="text-2xl font-bold text-[#1C3A2C]">₹{grandTotal.toLocaleString()}</span>
                      </div> */}
                      <div className="flex justify-between text-gray-500">
  <span>Subtotal</span>
  <span>₹{subtotal.toLocaleString()}</span>
</div>

<div className="flex justify-between text-gray-500">
  <span>GST (18%)</span>
  <span>₹{taxAmount.toLocaleString()}</span>
</div>

<div className="flex justify-between text-gray-500">
  <span>Shipping</span>
  <span>₹{shipping.toLocaleString()}</span>
</div>

<div className="pt-6 mt-4 border-t flex justify-between">
  <span className="font-bold">Total Amount</span>
  <span className="font-bold">₹{grandTotal.toLocaleString()}</span>
</div>

                      

                    </div>

                    <div className="mt-10">
                      <button 
                        onClick={() => navigate("/collections")}
                        className="w-full bg-[#1C3A2C] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#152e23] transition-all shadow-lg"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </aside>
              </div>

              <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-[#E5DDCC]">
                <FeatureCard icon={shippingIcon} title="Insured Shipping" description="Secure delivery for your treasures" />
                <FeatureCard icon={paymentIcon} title="Secure Payment" description="SSL Encrypted transactions" />
                <FeatureCard icon={supportIcon} title="24/7 Support" description="Dedicated luxury concierge" />
              </section>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

const MetaItem = ({ label, value, isStatus }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-1">{label}</p>
    <p className={`text-sm md:text-base text-white ${isStatus ? 'flex items-center gap-2' : ''}`}>
      {isStatus && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      {value}
    </p>
  </div>
);