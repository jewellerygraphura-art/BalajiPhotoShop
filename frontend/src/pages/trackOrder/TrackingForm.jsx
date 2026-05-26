import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  Package,
  AlertCircle,
  ArrowRight,
  HelpCircle
} from "lucide-react";

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler optimized to prevent unnecessary re-renders
  const handleTrack = useCallback(async (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();

    if (!cleanId) {
      setError("Please enter a valid Order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setOrderData(null);


    try {

      const res = await axios.get(`/api/v1/customer/order/track-order/${encodeURIComponent(orderId)}`);
      setOrderData(res.data);

      // await new Promise((resolve) => setTimeout(resolve, 800));

      // navigate(`/track-id`);

      navigate(`/track-order/${encodeURIComponent(orderId)}`);


    }
    catch (err) {
      console.error(err);
      setError("Unable to find this order. Please check the ID and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);


  return (
    <main className="bg-[#FFF9E9] min-h-screen antialiased selection:bg-[#1C3A2C] selection:text-white">

      {/* Dynamic Header Section */}
      <header className="relative bg-[#1C3A2C] pt-32 pb-40 px-6 overflow-hidden">
        {/* Subtle Texture Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')" }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#CBA135] uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
              Logistics Portal
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-amber-50 tracking-tight leading-tight">
              Track your <span className="italic font-serif">shipment</span>
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Interactive Tracking Card */}
      <section className="max-w-[800px] mx-auto px-6 -mt-24 relative z-20 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl shadow-black/5 p-8 md:p-12 border border-[#E5DDCC]/50"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-[#FFF9E9] rounded-full flex items-center justify-center text-[#1C3A2C] mb-4">
              <Package size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#08221B]">
              Enter Your Reference Number
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-sm">
              Check the status of your order using the unique ID sent to your email.
            </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-5">
            <div className="relative group">
              <label
                htmlFor="order-id"
                className="text-[10px] uppercase tracking-widest font-bold text-[#1C3A2C] absolute -top-2.5 left-4 bg-white px-2 z-10"
              >
                Order Identity
              </label>
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CBA135] transition-colors" size={18} />
                  <input
                    id="order-id"
                    type="text"
                    spellCheck="false"
                    autoComplete="off"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="e.g. ORD-77291"
                    className="w-full border-2 border-[#1C3A2C]/10 rounded-xl pl-12 pr-4 py-4 text-lg outline-none focus:border-[#1C3A2C] transition-all bg-[#FBFBFB]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#08221B] text-white px-8 py-4 rounded-xl font-bold tracking-widest hover:bg-black hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      TRACK NOW <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100"
                >
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Contextual Support */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 hover:text-[#1C3A2C] cursor-help transition-colors">
              <HelpCircle size={16} />
              <span className="text-xs">Where can I find my ID?</span>
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-tighter text-gray-400">Systems Operational</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Detailed Tracking View (Placeholder for visual context) */}
      {/* In production, this would be a separate route showing a timeline */}

    </main>
  );
};

export default OrderTracking;