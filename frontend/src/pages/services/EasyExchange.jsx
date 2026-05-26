import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Repeat, Calendar, CreditCard, Package, Store, CheckCircle, Shield, Sparkles } from "lucide-react";

const EasyExchange = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E8] to-[#FFF1D6]">
      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#CBA135]/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#08221B]/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[#08221B] mb-8 hover:text-[#CBA135] transition-all duration-300 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-xl w-fit border border-[#CBA135]/20"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#08221B] via-[#1a3a30] to-[#08221B] rounded-3xl p-8 md:p-12 mb-12 overflow-hidden shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 border-2 border-[#CBA135] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 border-2 border-[#CBA135] rounded-full translate-x-1/3 translate-y-1/3 animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#CBA135] to-[#DAA520] flex items-center justify-center shadow-2xl animate-pulse">
                <RefreshCw size={60} className="text-[#08221B] animate-spin-slow" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-[#08221B] font-bold text-sm">30</span>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-[#CBA135] mb-4">
                Flexible Exchanges
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
                Effortless 30-day exchange policy for gift recipients. 
                Want a different flavor, scent, or decor style? We make exchanges easy.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Calendar size={24} />, label: "Exchange Period", value: "30 Days", color: "from-blue-500/20" },
            { icon: <Repeat size={24} />, label: "Exchange Options", value: "Across Store", color: "from-green-500/20" },
            { icon: <CreditCard size={24} />, label: "Recipient Swap", value: "100% Free", color: "from-purple-500/20" },
            { icon: <Package size={24} />, label: "Store Credit", value: "Instant", color: "from-orange-500/20" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-[#CBA135]/20 group"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${stat.color} to-transparent flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <div className="text-[#CBA135]">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold text-[#08221B]">{stat.value}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* What's Included Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-[#CBA135]/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#CBA135] to-[#DAA520] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                ✓
              </div>
              <h2 className="text-3xl font-cormorant font-bold text-[#08221B]">What's Included</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: <Calendar size={18} />, text: "30-day exchange policy for gift recipients", highlight: true },
                { icon: <RefreshCw size={18} />, text: "Swap any hamper item for equal store value", highlight: true },
                { icon: <Sparkles size={18} />, text: "Upgrade gift boxes with simple price adjustments", highlight: true },
                { icon: <Repeat size={18} />, text: "Exchange across chocolates, decor, or gourmet treats", highlight: true },
                { icon: <Shield size={18} />, text: "Hassle-free no-questions-asked swap process", highlight: false },
                { icon: <CreditCard size={18} />, text: "Instant store credit or gift cards issued", highlight: false },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                    item.highlight ? 'bg-gradient-to-r from-[#CBA135]/10 to-transparent border-l-4 border-[#CBA135]' : ''
                  }`}
                >
                  <span className={`${item.highlight ? 'text-[#CBA135]' : 'text-[#08221B]'} mt-0.5`}>
                    {item.icon}
                  </span>
                  <span className="text-gray-700">{item.text}</span>
                  {item.highlight && (
                    <span className="ml-auto text-xs bg-[#CBA135] text-white px-2 py-1 rounded-full">Popular</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-[#CBA135]/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#08221B] to-[#1a3a30] flex items-center justify-center text-[#CBA135] text-2xl shadow-lg group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h2 className="text-3xl font-cormorant font-bold text-[#08221B]">How It Works</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { step: "01", title: "Initiate Swap", desc: "Contact Balaji Gift Store support within 30 days of delivery", icon: <Store size={20} />, color: "from-[#CBA135]/20" },
                { step: "02", title: "Pack Your Items", desc: "Keep original gift box, tags, and product in unused condition", icon: <Package size={20} />, color: "from-[#08221B]/20" },
                { step: "03", title: "Select Alternative", desc: "Choose your preferred alternative flavor or decor item", icon: <Sparkles size={20} />, color: "from-[#CBA135]/20" },
                { step: "04", title: "Hassle-Free Exchange", desc: "Swap processed immediately with doorstep pickup options", icon: <CreditCard size={20} />, color: "from-[#08221B]/20" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} to-transparent flex items-center justify-center font-bold text-[#08221B] shadow-md group-hover/item:scale-110 transition-transform border-2 border-[#CBA135]/30`}>
                      {item.step}
                    </div>
                    {i < 3 && (
                      <div className="absolute top-12 left-1/2 w-0.5 h-8 bg-gradient-to-b from-[#CBA135] to-transparent -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#CBA135]">{item.icon}</span>
                      <h3 className="font-bold text-[#08221B]">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Conditions with Style */}
        <div className="relative bg-gradient-to-r from-[#08221B] via-[#1a3a30] to-[#08221B] rounded-3xl p-8 overflow-hidden shadow-xl mb-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBA135] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CBA135] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <h3 className="text-2xl font-cormorant font-bold text-[#CBA135] mb-4 flex items-center gap-2">
              <Shield size={24} />
              Terms & Conditions
            </h3>
            <p className="text-gray-200 leading-relaxed mb-6">
              Items must be in original condition with all tags, seals, and original gift packaging intact. 
              Custom-printed corporate products, personalized greeting cards, and opened food items are excluded from exchanges.
            </p>
            
            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#CBA135]/30">
              {[
                { icon: <CheckCircle size={16} />, text: "Original Condition Required" },
                { icon: <CheckCircle size={16} />, text: "Tags & Packaging Intact" },
                { icon: <CheckCircle size={16} />, text: "Receipt Mandatory" },
              ].map((note, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-[#CBA135]">{note.icon}</span>
                  <span className="text-sm text-white">{note.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

       {/* Call to Action */}
<div className="text-center">
  <button
    onClick={() => navigate("/collections")}
    className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#B49148] via-[#F8E48F] to-[#BB9344] text-[#08221B] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all hover:scale-105 border border-[#CBA135]/30"
  >
    <span>Explore Collections for Exchange</span>
    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
  </button>
  <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
    <Shield size={14} className="text-[#CBA135]" />
    Gift with absolute peace of mind - 30-day recipient exchange guarantee
  </p>
</div>
      </div>
    </div>
  );
};

export default EasyExchange;