import React from "react";
import { Check } from "lucide-react";

import CancelIcon from "../../assets/orderCancel/orderCancel.png";
import GoldEaring from "../../assets/orderCancel/GoldEaring.jpg";
import GoldEaring2 from "../../assets/orderCancel/GoldEaring2.jpg";
import GoldEaring3 from "../../assets/orderCancel/GoldEaring3.jpg";
import GoldEaring4 from "../../assets/orderCancel/GoldEaring.jpg";
import FootIcon from "../../assets/orderCancel/FootIcon.png";
import FootIcon2 from "../../assets/orderCancel/FootIcon2.png";
import FootIcon3 from "../../assets/orderCancel/FootIcon3.png";

const orderProducts = [
  {
    id: 1,
    name: "Gold Earring",
    qty: "1 Qty",
    price: "$450.00",
    image: GoldEaring,
  },
  {
    id: 2,
    name: "Gold Earring",
    qty: "1 Qty",
    price: "$450.00",
    image: GoldEaring2,
  },
  {
    id: 3,
    name: "Gold Earring",
    qty: "1 Qty",
    price: "$450.00",
    image: GoldEaring3,
  },
  {
    id: 4,
    name: "Gold Earring",
    qty: "1 Qty",
    price: "$450.00",
    image: GoldEaring4,
  },
];

export default function OrderCancel() {
  return (
    <main className="bg-[#FFF8E8] min-h-screen py-20">
      <div className="max-w-[900px] mx-auto px-4">
        {/* CANCEL ICON */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 rounded-full bg-[#C9A14A] flex items-center justify-center">
            <img
              src={CancelIcon}
              alt="Order Success"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* HEADING */}
        <h1 className="text-center font-['Cormorant_Garamond'] text-[52px] font-semibold text-[#1C3A2C]">
          Your order is cancelled
        </h1>
        <p className="text-center text-sm text-[#1C3A2C] mt-1 text-[25px] font-bold">
          Your order was cancelled as per your request.
        </p>

        {/* ORDER META BAR */}
        {/* ORDER META BAR */}
        <div className="mt-10 bg-[#1C3A2C] rounded-md grid grid-cols-1 md:grid-cols-5 text-white px-6 py-4 gap-4 text-sm">
          <Meta label="Order ID" value="SSICTT456AD" />
          <Meta label="Payment Method" value="Paypal" />
          <Meta label="Transaction ID" value="SSICTT456AD" />
          <Meta label="Estimated Delivery Date" value="NA" />
          <Meta label="Order Status" value="Cancelled" />
        </div>

        {/* ORDER DETAILS */}
        <div className="mt-10 border border-[#E5E1D8] rounded-md p-6">
          <h2 className="font-medium text-[#0E2A21] mb-4 text-[28px]">
            Order Details
          </h2>
          <div className="mx-auto mt-4 mb-4 w-[810px] h-0.5 bg-[#D0D0D0]" />
          <h2 className="font-medium text-[#0E2A21] mb-2 text-[20px]">
            Products:
          </h2>

          {/* PRODUCT ROW */}
          {orderProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-4 last:border-none"
            >
              <div className="flex items-center gap-4">
                {/* PRODUCT IMAGE */}
                <div className="w-14 h-14 rounded overflow-hidden bg-[#EDE7DA]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* PRODUCT INFO */}
                <div>
                  <p className="font-medium text-[#0E2A21] text-[16px]">
                    {product.name}
                  </p>
                  <p className="text-[#1C3A2C] text-[16px]">
                    Earring · {product.qty}
                  </p>
                </div>
              </div>

              {/* PRICE */}
              <p className="font-medium text-[16px]">{product.price}</p>
            </div>
          ))}

          {/* SUMMARY */}
          <div className="mt-6 space-y-3 text-sm text-[16px]">
            <div className="mx-auto mt-4 mb-4 w-[810px] h-0.5 bg-[#D0D0D0]" />
            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span>$450.00</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>$450.00</span>
            </div>
            <div className="flex justify-between">
              <span>Coupon Discount</span>
              <span>$450.00</span>
            </div>
            <div className="mx-auto mt-4 mb-4 w-[810px] h-0.5 bg-[#D0D0D0]" />
            <div className="flex justify-between font-medium pt-4 text-[20px]">
              <span>Total</span>
              <span>$450.00</span>
            </div>
          </div>
        </div>

        {/* CANCELLATION STATUS BOX */}
        <div className="mt-8 border border-[#E6C36A] rounded-md bg-[#FFF3CC] p-4">
          <p className="text-center font-medium text-[#1C3A2C]">
            Order Cancelled
          </p>
          <p className="text-center text-[#C9A14A] text-sm">
            Your order was cancelled as per your request.
          </p>

          <div className="mt-6 flex justify-between text-sm">
            <div className="text-center">
              <p className="font-medium text-[#1C3A2C]">Order Confirmed</p>
              <p className="text-[#666]">November 27, 2025</p>
            </div>

            <div className="text-center">
              <p className="font-medium text-red-600">Cancelled</p>
              <p className="text-[#666]">November 27, 2025</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button className="text-[#1C3A2C] underline text-sm">
              See all updates
            </button>
          </div>
        </div>

        {/* FEATURES */}
        {/* TRUST INFO SECTION */}
        <div className="mt-20 bg-[#FFF8E8] py-12">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-4">
            {/* FREE SHIPPING */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C3A2C] flex items-center justify-center">
                <img src={FootIcon} alt="Free Shipping" className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-[#1C3A2C] text-[18px] font-bold">
                  Free Shipping
                </p>
                <p className="text-[#1C3A2C] text-[14px] font-bold">
                  Free Shipping for Order above ₹ 2,000
                </p>
              </div>
            </div>

            {/* FLEXIBLE PAYMENT */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C3A2C] flex items-center justify-center">
                <img
                  src={FootIcon2}
                  alt="Flexible Payment"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="font-medium text-[#1C3A2C] text-[18px] font-bold">
                  Flexible Payment
                </p>
                <p className="text-[#1C3A2C] text-[14px] font-bold">
                  Multiple Secure payment Options
                </p>
              </div>
            </div>

            {/* 24x7 SUPPORT */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C3A2C] flex items-center justify-center">
                <img src={FootIcon3} alt="24x7 Support" className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-[#1C3A2C] text-[18px] font-bold">
                  24×7 Support
                </p>
                <p className="text-[#1C3A2C] text-[14px] font-bold">
                  We Support online all days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
