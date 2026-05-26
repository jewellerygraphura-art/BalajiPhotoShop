import React from "react";

export const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-center gap-4 sm:gap-5 bg-white rounded-xl px-4 py-4 sm:px-6 sm:py-5 shadow-sm hover:shadow-md transition-all">
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#1C3A2C] shrink-0">
      <img src={icon} alt="" className="w-5 h-5 sm:w-6 sm:h-6" loading="lazy" />
    </div>
    <div className="flex flex-col">
      <h4 className="text-[16px] sm:text-[18px] font-serif text-[#1C3A2C] leading-tight">
        {title}
      </h4>
      <p className="text-[12px] sm:text-[14px] font-sans text-[#1C3A2C]/80 leading-snug">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureCard;

