// src/components/admin/StatCard.jsx
import React from "react";

const StatCard = ({ label, value, icon: Icon, color = "text-blue-600", bg = "bg-blue-50" }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      {/* Icon */}
      <div className={`${bg} ${color} p-4 rounded-xl flex items-center justify-center`}>
        <Icon size={24} />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
