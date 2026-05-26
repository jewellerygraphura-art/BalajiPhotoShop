import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, Diamond, Truck, RefreshCw, X, Send, Calendar, User, Mail, Clock } from "lucide-react";
import {axiosPostService} from "../../services/axios"

const FAQ_DATA = [
  {
    category: "Materials & Quality",
    id: "quality",
    icon: <Diamond size={20} />,
    questions: [
      {
        q: "Are your wooden gifts and toys authentic and organic?",
        a: "Every handcrafted item at Balaji Gift Shop is ethically made from certified premium woods (like rosewood, mahogany, and organic Channapatna wood) and painted using non-toxic, organic vegetable dyes. We only partner with traditional Indian artisans who maintain the highest standards of safety and heritage quality."
      },
      {
        q: "Do you provide customization or personalization?",
        a: "Yes! We specialize in custom premium personalization, including gold-foil embossing on gift boxes, customized names or engravings on brass/rosewood photo frames, wax-seal wrapping, and personalized calligraphy cards."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    id: "shipping",
    icon: <Truck size={20} />,
    questions: [
      {
        q: "Is my fragile shipment insured?",
        a: "Absolutely. Every gift basket, photo frame, and artisanal package is carefully padded and fully insured by Balaji Gift Shop until the moment it is delivered and signed for. We use specialized fragile-safe delivery partners to ensure pristine arrival."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    id: "returns",
    icon: <RefreshCw size={20} />,
    questions: [
      {
        q: "What is your return or recipient exchange policy?",
        a: "We offer a 14-day exchange policy. If your recipient would prefer a different themed gift box, they can easily swap it using our flexible Recipient Exchange portal. Please note that personalized or customized engraved products are final sale."
      }
    ]
  }
];

const AccordionItem = ({ item, isOpen, onToggle, id }) => (
  <div className="border border-[#E5DDCC] bg-white overflow-hidden transition-all duration-300 hover:border-[#D4AF37] rounded-sm">
    <h3>
      <button
        id={`faq-header-${id}`}
        aria-controls={`faq-content-${id}`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full p-5 md:p-6 text-left flex justify-between items-center group outline-none focus:bg-gray-50 transition-colors"
      >
        <span className={`text-base md:text-lg transition-colors duration-300 font-serif font-medium ${isOpen ? 'text-[#D4AF37]' : 'text-[#1C3A2C]'}`}>
          {item.q}
        </span>
        <div className={`flex-shrink-0 ml-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? (
            <Minus size={18} className="text-[#D4AF37]" />
          ) : (
            <Plus size={18} className="text-gray-400 group-hover:text-[#1C3A2C]" />
          )}
        </div>
      </button>
    </h3>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`faq-content-${id}`}
          role="region"
          aria-labelledby={`faq-header-${id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-5 md:px-6 pb-6 md:pb-8 text-gray-600 font-sans leading-relaxed text-sm md:text-base border-t border-[#FAF7ED]">
            <p className="pt-6">{item.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // BUG FIX 1: loading state was used but never declared
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
  });

  const filteredFaqs = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();
    if (!lowerTerm) return FAQ_DATA;

    return FAQ_DATA.map(group => ({
      ...group,
      questions: group.questions.filter(item =>
        item.q.toLowerCase().includes(lowerTerm) ||
        item.a.toLowerCase().includes(lowerTerm)
      )
    })).filter(group => group.questions.length > 0);
  }, [searchTerm]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap(group =>
      group.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    )
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axiosPostService(
        "/inquiry/consultation",
          formData,
      );

      const data = await response.data;

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Consultation request sent successfully ✅");

      setFormData({
        name: "",
        email: "",
        preferredDate: "",
        preferredTime: "",
      });

      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // BUG FIX 2: return statement was placed OUTSIDE the function body (after the closing `}`),
  // making it unreachable dead code. Moved it inside the function.
  return (
    <div className="bg-[#FAF7ED] min-h-screen text-[#1C3A2C] selection:bg-[#D4AF37] selection:text-white">
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>

      {/* HERO SECTION */}
      <header className="bg-[#1C3A2C] pt-24 pb-16 md:pt-32 md:pb-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <HelpCircle className="text-[#D4AF37] mx-auto mb-6 w-10 h-10 md:w-14 md:h-14" strokeWidth={1} />
          <h1 className="text-3xl md:text-5xl lg:text-7xl text-white font-light tracking-tight mb-8 font-serif leading-tight">
            How can we <span className="italic text-[#D4AF37]">help you?</span>
          </h1>

          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
            <input
              type="search"
              placeholder="Search for gifts, toys, photo frames..."
              className="w-full bg-white/5 border border-white/20 rounded-none py-5 pl-12 pr-4 text-white font-sans text-sm md:text-base focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all placeholder:text-white/30"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </header>

      {/* CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((group, groupIdx) => (
            <section key={group.id} className="mb-16 md:mb-24 last:mb-0">
              <div className="flex items-center gap-4 mb-8 border-b border-[#E5DDCC] pb-4">
                <span className="text-[#D4AF37]">{group.icon}</span>
                <h2 className="text-sm md:text-base uppercase tracking-[0.4em] font-bold">{group.category}</h2>
              </div>

              <div className="space-y-5">
                {group.questions.map((item, qIdx) => {
                  const uniqueId = `${groupIdx}-${qIdx}`;
                  return (
                    <AccordionItem
                      key={uniqueId}
                      id={uniqueId}
                      item={item}
                      isOpen={activeId === uniqueId}
                      onToggle={() => setActiveId(activeId === uniqueId ? null : uniqueId)}
                    />
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-serif text-2xl italic">No matches found for your search.</p>
          </div>
        )}
      </main>

      {/* FOOTER CTA */}
      <footer className="bg-white border-t border-[#E5DDCC] py-20 md:py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-serif font-light mb-6 text-[#1C3A2C]">Still have questions?</h3>
          <p className="text-gray-500 font-sans mb-12 text-base md:text-lg leading-relaxed">
            Our personal concierge is available for one-on-one consultations regarding custom corporate gifting and bespoke hampers.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-stretch sm:items-center">
            <a
              href="tel:7378021327"
              className="bg-[#1C3A2C] text-white px-12 py-5 text-xs md:text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-all active:scale-[0.98] text-center no-underline shadow-lg shadow-[#1C3A2C]/10"
            >
              Contact Concierge
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-[#1C3A2C] text-[#1C3A2C] px-12 py-5 text-xs md:text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#1C3A2C] hover:text-white transition-all active:scale-[0.98]"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </footer>

      {/* APPOINTMENT FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1C3A2C]/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-[#FAF7ED] w-full max-w-xl p-8 md:p-14 shadow-2xl rounded-sm border border-[#E5DDCC]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-[#1C3A2C] hover:text-[#D4AF37] transition-colors"
                aria-label="Close modal"
              >
                <X size={28} />
              </button>

              <div className="text-center mb-12">
                <Calendar className="mx-auto text-[#D4AF37] mb-6" size={48} />
                <h2 className="text-3xl md:text-4xl font-serif text-[#1C3A2C] mb-4 font-medium">Book a Consultation</h2>
                <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto">Please leave your details below and our concierge will confirm your session.</p>
              </div>

              {/* BUG FIX 3: form was calling an inline alert handler instead of the defined onSubmit function */}
              <form className="space-y-8" onSubmit={onSubmit}>
                <div className="space-y-6">
                  <div className="relative group">
                    <User className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full bg-transparent border-b-2 border-[#E5DDCC] py-3 pl-10 text-[#1C3A2C] placeholder:text-gray-300 focus:outline-none focus:border-[#D4AF37] transition-all font-sans text-lg"
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b-2 border-[#E5DDCC] py-3 pl-10 text-[#1C3A2C] placeholder:text-gray-300 focus:outline-none focus:border-[#D4AF37] transition-all font-sans text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-0 top-3 text-[#D4AF37]" size={18} />
                        <input
                          required
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b-2 border-[#E5DDCC] py-2 pl-8 text-[#1C3A2C] focus:outline-none focus:border-[#D4AF37] transition-all font-sans"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Preferred Time</label>
                      <div className="relative">
                        <Clock className="absolute left-0 top-3 text-[#D4AF37]" size={18} />
                        <input
                          required
                          type="time"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b-2 border-[#E5DDCC] py-2 pl-8 text-[#1C3A2C] focus:outline-none focus:border-[#D4AF37] transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C3A2C] text-white py-5 uppercase tracking-[0.3em] text-xs font-bold flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-[0.97] shadow-xl shadow-[#1C3A2C]/20 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Request"}
                    {!loading && <Send size={16} />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
