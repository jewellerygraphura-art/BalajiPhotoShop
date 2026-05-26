import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Shield, Package, MapPin, Clock, Bell, CheckCircle, Phone, CreditCard, Star, Lock } from "lucide-react";

const SecureDelivery = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E8] to-[#FFF1D6]">
      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#CBA135]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#08221B]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed top-1/3 right-1/4 w-40 h-40 bg-[#CBA135]/10 rounded-full blur-2xl"></div>
      
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
            <div className="absolute top-0 left-0 w-40 h-40 border-2 border-[#CBA135] rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 border-2 border-[#CBA135] rounded-full translate-x-1/3 translate-y-1/3 animate-pulse"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#CBA135] to-[#DAA520] flex items-center justify-center shadow-2xl">
                <Truck size={60} className="text-[#08221B] animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white">
                <Shield size={16} className="text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                <MapPin size={16} className="text-white" />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-[#CBA135] mb-4">
                Insured Shipping
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
                Fully insured, climate-controlled shipping with real-time tracking to your door. 
                Your premium gift boxes and fragile decors reach their destination safely, every time.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Shield size={24} />, label: "Insurance", value: "100%", color: "from-blue-500/20" },
            { icon: <Clock size={24} />, label: "Express Delivery", value: "2-3 Days", color: "from-green-500/20" },
            { icon: <Package size={24} />, label: "Free Shipping", value: "₹5000+", color: "from-purple-500/20" },
            { icon: <MapPin size={24} />, label: "Real-time Track", value: "24/7", color: "from-orange-500/20" },
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

        {/* Tracking Timeline */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-[#CBA135]/20 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#08221B] to-[#1a3a30] flex items-center justify-center text-[#CBA135] text-2xl shadow-lg">
              📦
            </div>
            <h2 className="text-3xl font-cormorant font-bold text-[#08221B]">Delivery Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Order Confirmed", desc: "SMS & Email alert", icon: <Bell size={20} />, time: "Immediate" },
              { step: "02", title: "Fragile-Safe Packing", desc: "Double-boxed styling", icon: <Package size={20} />, time: "24 hrs" },
              { step: "03", title: "In Transit", desc: "Real-time tracking", icon: <Truck size={20} />, time: "2-3 days" },
              { step: "04", title: "Out for Delivery", desc: "Doorstep confirmation", icon: <Phone size={20} />, time: "Same day" },
              { step: "05", title: "Delivered Safely", desc: "OTP verification", icon: <CheckCircle size={20} />, time: "Secure" },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-gradient-to-b from-[#FFF8E8] to-white rounded-xl p-4 text-center shadow-md hover:shadow-xl transition-all border border-[#CBA135]/20 group-hover:-translate-y-1">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#08221B] text-[#CBA135] flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="text-[#CBA135] mb-1">{item.icon}</div>
                  <h3 className="font-bold text-[#08221B] text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  <span className="text-[10px] bg-[#CBA135]/10 text-[#08221B] px-2 py-0.5 rounded-full mt-2 inline-block">
                    {item.time}
                  </span>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <span className="text-[#CBA135] text-xl">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
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
                { icon: <Shield size={18} />, text: "100% insured shipping worldwide", highlight: true, badge: "Covered" },
                { icon: <MapPin size={18} />, text: "Real-time tracking via SMS and email", highlight: true, badge: "24/7" },
                { icon: <Lock size={18} />, text: "Signature luxury double-boxing and seals", highlight: true, badge: "Premium" },
                { icon: <CheckCircle size={18} />, text: "Signature required upon delivery", highlight: true, badge: "Secure" },
                { icon: <CreditCard size={18} />, text: "Free shipping on orders above ₹5000", highlight: true,badge: "Free Shipping" },
                { icon: <Clock size={18} />, text: "Express delivery available (2-3 business days)", highlight: true,badge: "Speedy" },
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
                  <span className="text-gray-700 flex-1">{item.text}</span>
                  {item.badge && (
                    <span className="text-xs bg-[#08221B] text-white px-2 py-1 rounded-full whitespace-nowrap">
                      {item.badge}
                    </span>
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
                { step: "01", title: "Order Confirmation", desc: "Instant SMS and email alert with order details", icon: <Bell size={20} />, time: "Immediate" },
                { step: "02", title: "Premium Packing", desc: "Gifts styled and secured in double-boxed premium packaging", icon: <Package size={20} />, time: "24 hrs" },
                { step: "03", title: "Real-time Tracking", desc: "Track your package every step of the way", icon: <MapPin size={20} />, time: "Live" },
                { step: "04", title: "Pre-delivery Call", desc: "Delivery agent calls before arrival", icon: <Phone size={20} />, time: "Same day" },
                { step: "05", title: "OTP Verification", desc: "Secure delivery with one-time password", icon: <Lock size={20} />, time: "Final" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#08221B]/20 to-transparent flex items-center justify-center font-bold text-[#08221B] shadow-md group-hover/item:scale-110 transition-transform border-2 border-[#CBA135]/30`}>
                      {item.step}
                    </div>
                    {i < 4 && (
                      <div className="absolute top-12 left-1/2 w-0.5 h-8 bg-gradient-to-b from-[#CBA135] to-transparent -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#CBA135]">{item.icon}</span>
                      <h3 className="font-bold text-[#08221B]">{item.title}</h3>
                      <span className="ml-auto text-xs bg-[#CBA135]/10 text-[#08221B] px-2 py-0.5 rounded-full">
                        {item.time}
                      </span>
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
              Insurance covers loss, theft, and damage during transit. Signature and OTP verification 
              mandatory for delivery. Free shipping applicable on orders above ₹5000. Express delivery 
              available at additional cost for select locations.
            </p>
            
            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-[#CBA135]/30">
              {[
                { icon: <Shield size={14} />, text: "100% Insured" },
                { icon: <MapPin size={14} />, text: "Real-time Track" },
                { icon: <Lock size={14} />, text: "OTP Required" },
                { icon: <Star size={14} />, text: "Signature Needed" },
              ].map((note, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <span className="text-[#CBA135]">{note.icon}</span>
                  <span className="text-xs text-white">{note.text}</span>
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
    <span>Shop Now for Premium Delivery</span>
    <Truck size={20} className="group-hover:translate-x-1 transition-transform" />
  </button>
  <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
    <Shield size={14} className="text-[#CBA135]" />
    Your order is safe with us - 100% insured delivery
  </p>
</div>
      </div>
    </div>
  );
};

export default SecureDelivery;