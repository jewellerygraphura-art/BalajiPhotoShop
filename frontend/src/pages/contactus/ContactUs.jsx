import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ChevronRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { axiosPostService } from "../../services/axios";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosPostService(
        "/inquiry",
        form
      );

      console.log(response.data)

      if (response.data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#FAF7ED] min-h-screen font-serif text-[#1C3A2C]">
      {/* 1. MINIMALIST HEADER */}
      <header className="pt-20 pb-16 text-center border-b border-[#E5DDCC]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#D4AF37] block mb-4">
            Customer Care & Concierge
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">
            How may we <span className="italic">assist you?</span>
          </h1>
        </motion.div>
      </header>

      {/* 2. MAIN PRODUCTION CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* LEFT COLUMN */}
          <div className="lg:w-5/12 space-y-16">
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-8">Our Presence</h2>
              <div className="space-y-10">
                <ContactInfoBlock 
                  icon={<MapPin size={20} />} 
                  title="Balaji Gift Shop"
                  content="Graphura India Private Limited, near RSF, Pataudi, Gurgaon, Haryana 122503"
                  actionText="Get Directions"
                />
                <ContactInfoBlock 
                  icon={<Phone size={20} />} 
                  title="Private Consultations"
                  content="+91 7378021327"
                  actionText="Call Now"
                />
                <ContactInfoBlock 
                  icon={<Mail size={20} />} 
                  title="General Inquiries"
                  content="support@graphura.in"
                  actionText="Send Email"
                />
              </div>
            </section>

            <section className="p-8 bg-white border border-[#E5DDCC]">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C3A2C] mb-4">Business Hours</h2>
              <div className="space-y-2 text-sm text-gray-600 font-sans">
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span>Monday — Friday</span>
                  <span className="font-medium text-[#1C3A2C]">10:00 — 19:00</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span>Saturday</span>
                  <span className="font-medium text-[#1C3A2C]">11:00 — 17:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Sunday</span>
                  <span className="italic">By Appointment Only</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:w-7/12">
            <div className="bg-white border border-[#E5DDCC] p-8 md:p-16 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div 
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h3 className="text-2xl font-medium mb-10">Technical Inquiry</h3>

                    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField 
                          label="Your Name" 
                          placeholder="John Doe" 
                          required 
                          value={form.name}
                          onChange={(v) => setForm({...form, name: v})}
                        />
                        <InputField 
                          label="Email Address" 
                          type="email" 
                          placeholder="email@example.com" 
                          required 
                          value={form.email}
                          onChange={(v) => setForm({...form, email: v})}
                        />
                      </div>

                      <InputField 
                        label="Inquiry Subject" 
                        placeholder="Product Consultation, Order Status, etc."
                        value={form.subject}
                        onChange={(v) => setForm({...form, subject: v})}
                      />

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                          Message *
                        </label>
                        <textarea 
                          rows="5"
                          required
                          placeholder="How can we help you?"
                          className="w-full border-b border-[#E5DDCC] py-3 bg-transparent outline-none focus:border-[#1C3A2C] transition-all text-sm resize-none"
                          value={form.message}
                          onChange={(e) => setForm({...form, message: e.target.value})}
                        />
                      </div>

                      <button 
                        disabled={isSubmitting}
                        className="w-full bg-[#1C3A2C] text-white py-5 px-8 flex items-center justify-between group transition-all hover:bg-black disabled:opacity-50"
                      >
                        <span className="text-xs uppercase tracking-[0.3em] font-bold">
                          {isSubmitting ? "Processing..." : "Submit Inquiry"}
                        </span>
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center"
                  >
                    <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-medium mb-4">Inquiry Submitted</h3>
                    <p className="text-gray-500 font-sans max-w-sm mx-auto leading-relaxed">
                      Your message has been assigned to a concierge specialist. 
                      You will receive a response within 24 business hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-10 text-xs uppercase tracking-widest font-bold border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E5DDCC] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-2">Social Presence</p>
            <div className="flex gap-6 font-sans text-sm text-gray-500">
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Pinterest</a>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-sans tracking-wide">
            © 2026 BALAJI GIFT SHOP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- UI COMPONENTS --- */

const ContactInfoBlock = ({ icon, title, content, actionText }) => (
  <div className="flex gap-6 group">
    <div className="text-[#D4AF37] mt-1">{icon}</div>
    <div>
      <h4 className="text-sm font-bold mb-1">{title}</h4>
      <p className="text-gray-500 font-sans text-sm leading-relaxed mb-2">{content}</p>
      <button className="text-[10px] uppercase tracking-widest font-bold">
        {actionText}
      </button>
    </div>
  </div>
);

const InputField = ({ label, type = "text", placeholder, required, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
      {label} {required && "*"}
    </label>
    <input 
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-b border-[#E5DDCC] py-3 bg-transparent outline-none focus:border-[#1C3A2C] transition-all text-sm"
    />
  </div>
);