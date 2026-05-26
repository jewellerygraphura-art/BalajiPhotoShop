import React, { useRef } from "react";

const menu = [
  { id: "profile", label: "Personal Information" },
  { id: "orders", label: "My Orders" },
  { id: "address", label: "Manage Address" },
  // { id: "payment", label: "Payment Method" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

const ProfileSide = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef(null);

  // Smooth scroll logic for mobile
  const handleTabClick = (id, e) => {
    setActiveTab(id);
    if (e.target) {
      e.target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div className="relative w-full mt-4 lg:mt-5">
      {/* Scroll Container 
        - no-scrollbar: Scrollbar hide karne ke liye
        - snap-x: Smooth movement ke liye
      */}
      <div 
        ref={scrollRef}
        className="flex flex-row lg:flex-col gap-3 lg:gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar snap-x sticky top-0 bg-[#FFF9E9] z-20 lg:static"
      >
        {menu.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={(e) => handleTabClick(item.id, e)}
              className={`
                /* Base Transitions */
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                flex items-center justify-center lg:justify-start shrink-0 snap-center
                
                /* Mobile: Pill Design */
                text-[13px] px-6 py-2.5 rounded-full border whitespace-nowrap
                
                /* Desktop: Clean Row Design */
                lg:w-full lg:rounded-none lg:border-0 lg:border-l-[3px] lg:px-8 lg:py-4 lg:text-[15px] cursor-pointer
                
                ${isActive 
                  ? "bg-[#0c2213] text-white border-[#1B3022] shadow-md lg:bg-[#1B3022]/5 lg:text-[#1B3022] lg:border-[#1B3022] lg:font-bold lg:shadow-none" 
                  : "bg-white text-gray-500 border-gray-100 lg:bg-transparent lg:border-transparent lg:hover:bg-gray-50 hover:text-gray-800"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Fade-out Hint (Right side) */}
      <div className="absolute right-0 top-0 h-[42px] w-12 bg-gradient-to-l from-[#FFF9E9] via-[#FFF9E9]/50 to-transparent pointer-events-none lg:hidden z-30" />
    </div>
  );
};

export default ProfileSide;