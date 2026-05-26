import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const location = useLocation();

  const reason = location.state?.reason || "Payment could not be completed.";
  const method = location.state?.method || "Payment";

  return (
    <main className="bg-[#FFF8E8] min-h-screen py-12 sm:py-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E5DDCC] shadow-sm p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle size={42} className="text-red-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C3A2C] mb-2">Payment Failed</h1>
          <p className="text-[#B45309] text-sm sm:text-base mb-2">Method: {method}</p>
          <p className="text-gray-600 text-sm sm:text-base mb-8">{reason}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/checkout")}
              className="flex items-center justify-center gap-2 bg-[#1C3A2C] text-white py-3 px-6 font-semibold tracking-widest uppercase text-xs hover:bg-black transition-colors"
            >
              <RefreshCw size={16} />
              Retry Payment
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="flex items-center justify-center gap-2 border-2 border-[#1C3A2C] text-[#1C3A2C] py-3 px-6 font-semibold tracking-widest uppercase text-xs hover:bg-[#1C3A2C] hover:text-white transition-colors"
            >
              <ShoppingBag size={16} />
              Back To Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
