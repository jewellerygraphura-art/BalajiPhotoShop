import React, { useState } from "react";
import heroImg from "../../assets/aboutUs/heroImage.png";
import earRing from "../../assets/aboutUs/earRing.png";
import { axiosPostService } from "../../services/axios";
import { useToast } from "../../context/ToastContext";

const BalajiGiftShopSection = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      const apiResponse = await axiosPostService(
        "/customer/subscribe&coupon/subscribe",
        { email }
      );

      if (!apiResponse.ok) {
        showToast(apiResponse.data.message || "Failed", "error");
        return;
      }

      showToast(apiResponse.data.message);
      setEmail("");
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="bg-[#fff8e8] font-cormorant overflow-x-hidden">

      {/* ================= SECTION 1: HERO ================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left Image */}
        <div className="border-[8px] border-[#0F241A] bg-[#f3efe6] shadow-2xl h-[520px] flex items-center justify-center">
          <img
            src={heroImg}
            alt="Balaji Gourmet Hamper"
            className="h-[90%] w-auto object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="bg-white/60 backdrop-blur-sm border border-[#0F241A]/10 p-10 lg:p-14 shadow-xl max-w-xl mx-auto lg:mx-0">
          <p className="text-xl lg:text-2xl text-[#1a1a1a] leading-relaxed italic font-medium">
            "Born from Graphura’s passion for design and precision, Balaji Gift Shop
            draws inspiration from heritage and fine craftsmanship to curate timeless
            experiences of premium luxury."
          </p>

          <div className="mt-10 inline-flex items-center justify-center px-10 py-3
            bg-gradient-to-r from-[#B1924E] via-[#E9D392] to-[#B1924E]
            text-[#0F241A] text-xs sm:text-sm font-semibold uppercase tracking-[0.35em]
            shadow-md border border-[#B1924E]/60">
            Handcrafted • Premium • Timeless
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: HERITAGE ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-0 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left Text */}
        <div className="flex flex-col gap-8 text-[#1a1a1a] max-w-xl">
          <div className="space-y-6 text-lg lg:text-[22px] leading-[1.7] font-light">
            <p>
              Balaji Gift Shop by Graphura was born from a passion for design,
              precision, and curated gifting experiences.
            </p>
            <p>
              Each luxury hamper and handcrafted gift is thoughtfully curated and meticulously
              presented to celebrate life’s most meaningful moments.
            </p>
            <p>
              A gift is more than a present—it is an expression of identity,
              warmth, and legacy.
            </p>
            <p className="font-medium">
              Guided by trust, transparency, and innovation, Balaji Gift Shop continues
              to honor tradition.
            </p>
          </div>
        </div>

        {/* Right Image Arch */}
        <div className="relative flex justify-center lg:justify-end items-center min-h-[500px] lg:min-h-[650px]">
          <div className="relative w-full max-w-[360px] lg:max-w-[480px] aspect-[4/5.5]">
            <div className="absolute inset-0 bg-[#1C3A2C] rounded-t-full shadow-2xl" />
            <div className="absolute bottom-0 right-0 w-[85%] h-[90%] bg-[#CBA135] rounded-t-full" />

            <div className="absolute bottom-0 ml-10 left-0 w-[86%] h-[87%] bg-gray-100 rounded-t-full overflow-hidden border-[2px] border-[#0F241A] shadow-inner">
              <img
                src={earRing}
                alt="Balaji Curated Gifts"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#08221B,#4F7B62,#08221B)] pt-24 pb-24 px-6 -mt-[1px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-10">
          <div className="space-y-4">
            <span className="block text-sm font-bold uppercase tracking-[0.4em] text-[#EFDFB7]">
              OUR NEWSLETTER
            </span>

            <h2 className="mx-auto max-w-4xl text-[34px] md:text-[52px] text-[#EFDFB7] font-light">
              Subscribe To Our Newsletter
            </h2>

            <p className="mx-auto max-w-2xl text-lg font-light text-[#EFE3C2] opacity-90">
              Get 20% Off On Your First Order By Subscribing
            </p>
          </div>

          <form onSubmit={subscribe} className="mx-auto flex max-w-2xl flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter Email Address"
              required
              value={email}
              className="w-full bg-white px-8 py-4 text-lg outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#C9A24D] px-12 py-4 text-sm font-bold uppercase tracking-widest text-[#0F241A] hover:bg-[#D8B45A]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default BalajiGiftShopSection;