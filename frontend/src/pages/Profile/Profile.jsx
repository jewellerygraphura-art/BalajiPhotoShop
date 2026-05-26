import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertTriangle } from "lucide-react";

import ProfileSidebar from '../../components/Profile/ProfileSide.jsx';
import PersonalInfo from "./Sections/PersonalInfo";
import MyOrders from "./Sections/MyOrders";
import Address from "./Sections/Address";
import Payment from "./Sections/Payment";
import Password from "./Sections/Password";
import FeatureCard from "../../components/common/FeatureCard";

import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";
import { axiosPostService } from "../../services/axios.js";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ["profile", "orders", "address", "password", "logout"];
  const getValidTab = (tab) => (validTabs.includes(tab) ? tab : "profile");

  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get("tab");
    return getValidTab(tabFromUrl);
  });

  const handleTabChange = (tab) => {
    const nextTab = getValidTab(tab);
    setActiveTab(nextTab);

    if (nextTab === "profile") {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ tab: nextTab }, { replace: true });
  };

  // Navigation helper defined inside component
  const handleLogout = async () => {
    // Add any cleanup logic here (clear localStorage, etc.)
    const apiResponse = await axiosPostService("/customer/auth/signout", {});

    if (!apiResponse.ok) {
      alert(apiResponse.data.message || "Logout Failed");
      return
    }
    else {
      localStorage.clear();
      localStorage.removeItem("balaji-gift-favorites");
      navigate("/signin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Senior Tip: Use a render map for better readability
  const TabContent = useMemo(() => {
    switch (activeTab) {
      case "profile": return <PersonalInfo />;
      case "orders": return <MyOrders />;
      case "address": return <Address />;
      // case "payment": return <Payment />;
      case "password": return <Password />;
      case "logout": return (
        <LogoutView
          onConfirm={handleLogout}
          onCancel={() => handleTabChange("profile")}
        />
      );
      default: return <PersonalInfo />;
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#FFF9E9] selection:bg-[#1B3022] selection:text-white">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row p-5 lg:p-10 gap-8 lg:gap-12">

        {/* Sidebar: Sticky on desktop for better UX */}
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 h-fit">
          <ProfileSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </aside>

        {/* Content Area with Fade Animation */}
        <section className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {TabContent}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <FeatureSection />
    </main>
  );
};

/**
 * Sub-component for Logout with Framer Motion Effects
 */
const LogoutView = ({ onConfirm, onCancel }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = () => {
    setIsLoggingOut(true);

    // Senior Tip: A 1.2s delay provides visual confirmation that 
    // the session is being cleared securely before redirecting.
    setTimeout(() => {
      onConfirm();
    }, 1200);
  };

  return (
    <div className="relative">
      {/* 1. Full-Screen Exit Animation */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#1B3022] flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#B38B59]/30 border-t-[#B38B59] rounded-full"
                />
              </div>
              <h2 className="text-2xl font-serif tracking-[0.2em] uppercase">Securing Session</h2>
              <p className="text-[#B38B59] mt-2 italic font-light">Clearing your data...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Simple Confirmation UI */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-serif max-w-md"
      >
        <h2 className="text-3xl font-medium text-[#1B3022] mb-2">Logout</h2>
        <p className="text-[#B38B59] mb-8 italic text-lg">Are you sure you want to logout?</p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="bg-[#1B3022] text-white px-10 py-3 text-sm font-medium hover:bg-black transition-all active:scale-95 disabled:opacity-50 min-w-[140px]"
          >
            YES, LOGOUT
          </button>

          <button
            onClick={onCancel}
            disabled={isLoggingOut}
            className="border border-[#1B3022] text-[#1B3022] px-10 py-3 text-sm font-medium hover:bg-[#1B3022] hover:text-white transition-all active:scale-95 disabled:opacity-50 min-w-[140px]"
          >
            CANCEL
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Cleanly separated Feature Section
 */
const FeatureSection = () => (
  <section className="bg-[#FFF9E9] px-4 sm:px-6 lg:px-12 xl:px-16 py-12 lg:py-20 border-t border-[#E5DDCC]/50">
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard icon={shippingIcon} title="Free Shipping" description="Free Shipping for Order above ₹ 2,000" />
      <FeatureCard icon={paymentIcon} title="Flexible Payment" description="Multiple Secure payment Options" />
      <FeatureCard icon={supportIcon} title="24x7 Support" description="We Support online all days" />
    </div>
  </section>
);

export default Profile;