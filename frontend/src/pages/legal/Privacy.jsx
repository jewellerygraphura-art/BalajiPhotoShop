import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Eye, Database, Globe, FileText, ChevronRight, Mail } from "lucide-react";

const SECTIONS = [
  {
    id: "data-collection",
    title: "Data Collection",
    icon: Database,
    content: "We collect information you provide directly to us when you create an account, make a purchase, or request a consultation. This includes your name, billing/shipping address, payment details, and email address. For gift customization, we may also store specific preferences and recipient details."
  },
  {
    id: "security",
    title: "Security Measures",
    icon: Lock,
    content: "All transactions are processed through secure, encrypted gateways. We use Industry Standard SSL (Secure Sockets Layer) technology to protect your data. Your credit card information is never stored on our servers; it is handled by PCI-compliant payment processors like Razorpay or Stripe."
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Eye,
    content: "Our website uses cookies to enhance your shopping experience—for example, remembering items in your cart. We also use analytics to understand how visitors interact with our gift collections to improve site performance."
  },
  {
    id: "third-parties",
    title: "Third-Party Sharing",
    icon: Globe,
    content: "We do not sell your personal information. We only share data with trusted partners essential to our service: logistics providers (for delivery), insurance companies (for high-value shipping), and payment processors."
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const activeData = SECTIONS.find((s) => s.id === activeSection);

  // Intersection Observer could be added here for "scroll-to-active" behavior in a long-form page.

  return (
    <div className="bg-[#FAF7ED] min-h-screen font-serif text-[#1C3A2C] selection:bg-[#D4AF37] selection:text-white">
      {/* 1. HERO SECTION */}
      <header className="bg-[#1C3A2C] pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]" 
          aria-hidden="true"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <ShieldCheck className="text-[#D4AF37] mx-auto mb-6 w-12 h-12 md:w-16 md:h-16" strokeWidth={1} />
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-light tracking-tight leading-tight">
            Privacy & <span className="italic text-[#D4AF37]">Data Security</span>
          </h1>
          <p className="text-[#D4AF37]/80 mt-6 font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
            Last Updated: January 07, 2026
          </p>
        </motion.div>
      </header>

      {/* 2. MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* NAVIGATION SIDEBAR / MOBILE TABS */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-12">
            <h2 className="hidden lg:block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 px-4">
              Policy Navigation
            </h2>
            
            {/* Mobile Horizontal Scroll Container */}
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar gap-2 lg:gap-1 border-b lg:border-b-0 border-[#E5DDCC]">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    aria-current={isActive ? "step" : undefined}
                    className={`flex-shrink-0 lg:w-full flex items-center justify-between p-4 transition-all duration-300 border-b-2 lg:border-b-0 lg:border-l-2 whitespace-nowrap lg:whitespace-normal ${
                      isActive 
                      ? "bg-white border-[#D4AF37] shadow-sm text-[#1C3A2C]" 
                      : "border-transparent text-gray-400 hover:text-[#1C3A2C] hover:bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
                      <span className="text-xs md:text-sm font-sans font-bold tracking-wide uppercase">
                        {section.title}
                      </span>
                    </div>
                    <ChevronRight size={14} className={`hidden lg:block transition-transform ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                  </button>
                );
              })}
            </nav>
            
            <div className="hidden lg:block mt-12 p-8 bg-white border border-[#E5DDCC] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FAF7ED] rotate-45 translate-x-8 -translate-y-8 border-b border-[#E5DDCC]" />
              <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-[#1C3A2C]">Legal Compliance</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Adhering strictly to the Information Technology Act (India) and global standards. We value your trust as much as our craftsmanship.
              </p>
            </div>
          </aside>

          {/* 3. DYNAMIC CONTENT AREA */}
          <section className="w-full lg:w-2/3 bg-white border border-[#E5DDCC] shadow-xl shadow-[#1C3A2C]/5 min-h-[400px] md:min-h-[600px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12 lg:p-20"
              >
                <div className="flex items-center gap-4 mb-10 border-b border-[#FAF7ED] pb-6">
                  <div className="p-3 bg-[#FAF7ED] text-[#D4AF37]">
                    <activeData.icon size={24} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-medium m-0 tracking-tight">
                    {activeData.title}
                  </h3>
                </div>
                
                <div className="text-gray-600 font-sans leading-relaxed md:leading-loose text-base md:text-lg space-y-8">
                  <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#D4AF37] first-letter:mr-2 first-letter:float-left">
                    {activeData.content}
                  </p>
                  
                  <div className="pt-8 border-t border-[#FAF7ED]">
                    <h4 className="text-[#1C3A2C] font-serif text-xl mb-4">Client Commitment</h4>
                    <p className="text-base italic text-gray-500 border-l-2 border-[#D4AF37] pl-6 py-2 bg-[#FAF7ED]/50">
                      "At Balaji Gift Shop, discretion is our hallmark. We treat your personal data with the same meticulous care we use to curate our bespoke collection."
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {["AES-256 Encryption", "PCI-DSS Compliance", "GDPR Readiness", "Instant Data Erasure"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#1C3A2C]/70">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* 4. CALL TO ACTION / FOOTER */}
      <footer className="bg-white border-t border-[#E5DDCC] py-24 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h3 className="text-2xl md:text-3xl font-light mb-6">Concerns or Inquiries?</h3>
          <p className="text-gray-500 font-sans mb-10 text-sm md:text-base leading-relaxed">
            Our Data Protection Officer is dedicated to ensuring your rights are upheld. Reach out for data access requests or security clarifications.
          </p>
          <a 
            href="mailto:privacy@balajigiftshop.com"
            className="group inline-flex items-center gap-3 bg-[#1C3A2C] text-white px-10 py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-[#1C3A2C]/20"
          >
            <Mail size={16} className="group-hover:rotate-12 transition-transform" />
            Email Privacy Team
          </a>
        </div>
      </footer>
    </div>
  );
}