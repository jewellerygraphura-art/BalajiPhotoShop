import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Scale, ShieldCheck, Truck, RotateCcw, Copyright, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-[#FAF7ED] min-h-screen font-serif text-[#1C3A2C] selection:bg-[#1C3A2C] selection:text-[#D4AF37]">
      {/* 1. PROGRESS BAR (User Experience for long text) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#D4AF37] origin-left z-50"
        style={{ scaleX }}
      />

      {/* 2. MINIMALIST HEADER */}
      <header className="bg-[#1C3A2C] text-amber-50 border-b border-[#E5DDCC] pt-32 pb-20 px-6 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Scale className="text-[#D4AF37] mx-auto mb-6" size={40} strokeWidth={1.5} />
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">Terms of <span className="italic">Service</span></h1>
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-400">Effective Date: January 07, 2026</p>
        </motion.div>
      </header>

      {/* 3. CORE LEGAL CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-24">
          
          {/* SECTION 1: INTRODUCTION */}
          <section className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <span className="text-[#D4AF37] text-xs font-bold font-sans">01.</span> Acceptance of Terms
            </h2>
            <p className="text-gray-600 font-sans leading-relaxed text-lg italic">
              "By accessing Balaji Gift Shop, you enter into a binding agreement governed by craftsmanship, transparency, and the following legal guidelines."
            </p>
            <p className="text-gray-600 font-sans leading-relaxed mt-4">
              This website is operated by Balaji Gift Shop Ltd. Throughout the site, the terms “we”, “us” and “our” refer to Balaji Gift Shop. We offer this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
          </section>

          {/* SECTION 2: LUXURY SPECIFIC POLICIES */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 bg-white border border-[#E5DDCC] shadow-sm">
              <ShieldCheck className="text-[#D4AF37] mb-6" size={28} />
              <h3 className="text-xl font-medium mb-4">Product Authenticity</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Every gemstone and metal sold on our platform is certified by international laboratories (GIA, IGI). We guarantee the 18K/22K purity as stated on the product hallmark.
              </p>
            </div>
            <div className="p-8 bg-white border border-[#E5DDCC] shadow-sm">
              <Truck className="text-[#D4AF37] mb-6" size={28} />
              <h3 className="text-xl font-medium mb-4">Insured Shipping</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                All gift shipments are fully insured by Balaji Gift Shop until the moment they are signed for by the client at the designated shipping address.
              </p>
            </div>
          </section>

          {/* SECTION 3: INTELLECTUAL PROPERTY */}
          <section className="prose prose-stone max-w-none border-t border-[#E5DDCC] pt-16">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <span className="text-[#D4AF37] text-xs font-bold font-sans">02.</span> Intellectual Property
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Copyright className="text-gray-300 shrink-0" size={15} />
              <p className="text-gray-600 font-sans leading-relaxed">
                All designs, bespoke patterns, brand photography, and the "Balaji Gift Shop" trademark are the exclusive property of Balaji Gift Shop. Any reproduction, distribution, or unauthorized use of our designs or visual assets without written consent will result in legal action under the Intellectual Property Rights Act.
              </p>
            </div>
          </section>

          {/* SECTION 4: USER RESPONSIBILITY */}
          <section className="prose prose-stone max-w-none border-t border-[#E5DDCC] pt-16">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <span className="text-[#D4AF37] text-xs font-bold font-sans">03.</span> Accuracy of Billing
            </h2>
            <p className="text-gray-600 font-sans leading-relaxed mb-6">
              You agree to provide current, complete, and accurate purchase and account information for all purchases. We reserve the right to refuse any order if we suspect fraudulent activity or if a pricing error has occurred on the storefront.
            </p>
            <div className="bg-[#1C3A2C] text-[#FAF7ED] p-6 flex gap-4 items-start">
              <AlertCircle size={20} className="text-[#D4AF37] shrink-0" />
              <p className="text-sm font-sans tracking-wide">
                <strong>Note:</strong> Pricing for gold and diamond products is subject to market fluctuations and may change without prior notice until the order is confirmed.
              </p>
            </div>
          </section>

          {/* SECTION 5: MODIFICATIONS */}
          <section className="border-t border-[#E5DDCC] pt-16 pb-20">
             <div className="max-w-2xl">
               <h2 className="text-2xl font-medium mb-4">Governing Law</h2>
               <p className="text-gray-600 font-sans leading-relaxed mb-8">
                 These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of Haryana, India, under the jurisdiction of the Gurugram courts.
               </p>
             </div>
          </section>
        </div>
      </main>

      {/* 4. FOOTER CALLOUT */}
      <footer className="bg-white py-20 border-t border-[#E5DDCC]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-sans text-gray-500 mb-6">Questions regarding our Terms of Service should be directed to:</p>
          <a 
            href="mailto:support@graphura.in" 
            className="text-xl font-sans font-light underline decoration-[#D4AF37] decoration-2 underline-offset-8 hover:text-[#D4AF37] transition-colors"
          >
            support@graphura.in
          </a>
        </div>
      </footer>
    </div>
  );
}