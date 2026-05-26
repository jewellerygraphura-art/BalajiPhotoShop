import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import FooterBg from "../assets/footerAssests/background.png";
import { axiosGetService } from "../services/axios";

// 1. DATA CONFIGURATION (Same as before)
const FOOTER_DATA = {
  shop: {
    title: "Shop",
    links: [
      { name: "Coming Soon", path: "/new-arrivals" },
      { name: "Premium Photo Frames", path: "/collections/premium-photo-frames" },
      { name: "Traditional Indian Toys", path: "/collections/traditional-indian-toys" },
      { name: "Traditional Indian Gifts", path: "/collections/traditional-indian-gifts" },
      { name: "Festive Platters", path: "/collections/festive-platters" },
      { name: "Collections", path: "/collections" },
    ],
  },
  info: {
    title: "Information",
    links: [
      { name: "About Us", path: "/about" },
      { name: "Our Stores", path: "/store" },
      { name: "Coming Soon", path: "/new-arrivals" },
    ],
  },
  customerCare: {
    title: "Customer Care",
    links: [
      { name: "Contact Us", path: "/contact" },
      { name: "Track Order", path: "/track-order" },
      { name: "FAQs", path: "/faqs" },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      /* ✅ FIX: Added bg-[#1C3A2C] and min-w-full to prevent white gaps */
      className="relative w-full text-[#CBA135] overflow-hidden bg-[#1C3A2C]"
    >
      {/* BACKGROUND LAYER */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `
            linear-gradient(212.33deg, rgba(28,58,44,0.6) 19.6%, #1C3A2C 79.92%),
            url(${FooterBg})
          `,
        }}
        role="presentation"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-8">
        <h2 id="footer-heading" className="sr-only">Footer</h2>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND SECTION */}
          <section className="flex flex-col">
            <h3 className="text-lg font-serif font-bold tracking-widest text-[#CBA135] mb-6">
              BALAJI GIFT STORE
              <span className="block text-[10px] font-sans tracking-[0.3em] opacity-80 mt-1">
                PREMIUM GIFTING
              </span>
            </h3>
            <p className="text-sm leading-relaxed text-[#EFDFB7]/90 max-w-xs mb-8">
              Curating premium gifts since 2024. We bring together
              exceptional craftsmanship and elegant artistry to create gift
              hampers that celebrate your special moments.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon Icon={FaFacebookF} label="Facebook" href="https://www.facebook.com/share/19nKAMTopZ/" />
              <SocialIcon Icon={FaInstagram} label="Instagram" href="https://www.instagram.com/graphura.in?igsh=MXNqNmtidzljNDJlag==" />
              <SocialIcon Icon={FaTwitter} label="Twitter" href="https://share.google/w9KeZZ72v8KQxGpFn" />
            </div>
          </section>

          {/* DYNAMIC COLUMNS */}
          <FooterColumn data={FOOTER_DATA.shop} onLinkClick={scrollToTop} />
          <FooterColumn data={FOOTER_DATA.info} onLinkClick={scrollToTop} />
          <FooterColumn data={FOOTER_DATA.customerCare} onLinkClick={scrollToTop} />
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-8 border-t border-[#CBA135]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#FFF9EA]/60 tracking-wider text-center md:text-left">
            © {currentYear} Graphura India Private Limited. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-[#EFDFB7]/40">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-[#CBA135] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-[#CBA135] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Sub-Components ---------------- */

function FooterColumn({ data, onLinkClick }) {
  return (
    <nav className="flex flex-col">
      <h3 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase text-[#CBA135]">
        {data.title}
      </h3>
      <ul className="space-y-4">
        {data.links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              onClick={onLinkClick}
              className="group text-sm text-[#EFDFB7] transition-all duration-300 hover:text-white flex items-center"
            >
              <span className="h-[1px] w-0 bg-[#CBA135] mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialIcon({ Icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full
        bg-[#0F231C]/60 border border-[#CBA135]/20 text-[#FAF7F2]
        transition-all duration-300
        hover:bg-[#CBA135] hover:text-[#0F231C] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#CBA135]/20"
    >
      <Icon size={16} />
    </a>
  );
}