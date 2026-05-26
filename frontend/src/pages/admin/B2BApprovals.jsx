import React, { useState, useEffect } from "react";
import { Check, X, ShieldAlert, Award, FileText, MapPin, Building, Calendar, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

export default function B2BApprovals() {
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "approved"
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === "pending" 
        ? "/api/v1/admin/b2b/pending" 
        : "/api/v1/admin/b2b/approved";
      
      const res = await axios.get(endpoint, { withCredentials: true });
      if (res.data?.success) {
        setAccounts(res.data.data || []);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error("Failed to load B2B accounts:", err);
      toast.error("Failed to retrieve wholesale accounts");
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeTab]);

  const handleApprove = async (userId) => {
    try {
      const res = await axios.put(`/api/v1/admin/b2b/${userId}/approve`, {}, { withCredentials: true });
      if (res.data?.success) {
        toast.success("✨ Wholesale account approved successfully!");
        fetchAccounts();
      } else {
        toast.error(res.data?.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve account");
    }
  };

  const handleReject = async (userId, isRevoking = false) => {
    const confirmMessage = isRevoking 
      ? "Are you sure you want to revoke this partner's wholesale pricing status?" 
      : "Are you sure you want to reject this wholesale account application?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await axios.put(`/api/v1/admin/b2b/${userId}/reject`, {}, { withCredentials: true });
      if (res.data?.success) {
        toast.info(isRevoking ? "Wholesale pricing status revoked" : "Wholesale application rejected");
        fetchAccounts();
      } else {
        toast.error(res.data?.message || "Rejection failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] space-y-8 font-serif">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#08221B] tracking-tight uppercase">Wholesale Approvals</h1>
          <p className="text-[#B38B59] text-sm mt-1 italic">Verify business details and approve wholesale B2B partner accounts.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#E5DDCC] pb-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-sm ${
            activeTab === "pending"
              ? "bg-[#CBA135] text-white"
              : "border border-[#1E3A2F]/20 text-[#1E3A2F] hover:bg-[#1E3A2F]/5"
          }`}
        >
          Pending Requests ({activeTab === "pending" ? accounts.length : "..."})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-sm ${
            activeTab === "approved"
              ? "bg-[#1E3A2F] text-white"
              : "border border-[#1E3A2F]/20 text-[#1E3A2F] hover:bg-[#1E3A2F]/5"
          }`}
        >
          Approved Partners ({activeTab === "approved" ? accounts.length : "..."})
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#CBA135]/30 border-t-[#CBA135] rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm tracking-widest">LOADING ACCOUNTS...</p>
        </div>
      ) : accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-[#E5DDCC] p-12 text-center rounded-sm max-w-lg mx-auto shadow-sm"
        >
          {activeTab === "pending" ? (
            <>
              <ShieldAlert size={48} className="text-[#CBA135] mx-auto mb-4" />
              <h3 className="text-lg text-[#1C3A2C] font-bold uppercase tracking-wider">No Pending Requests</h3>
              <p className="text-gray-500 text-sm mt-2 font-sans">All business account applications have been processed successfully.</p>
            </>
          ) : (
            <>
              <Award size={48} className="text-[#1E3A2F] mx-auto mb-4" />
              <h3 className="text-lg text-[#1C3A2C] font-bold uppercase tracking-wider">No Active B2B Partners</h3>
              <p className="text-gray-500 text-sm mt-2 font-sans">Once you approve pending requests, verified wholesale partners will appear here.</p>
            </>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {accounts.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#E5DDCC] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#CBA135]/50 transition-all rounded-sm"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2 border-b border-[#FAF7ED] pb-3 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#1C3A2C] tracking-wide">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans mt-0.5">
                        <Mail size={12} />
                        <span>{user.email}</span>
                      </div>
                      {user.contact && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans mt-0.5">
                          <Phone size={12} />
                          <span>{user.contact}</span>
                        </div>
                      )}
                    </div>
                    <span className="bg-[#FAF7ED] text-[#CBA135] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-[#E5DDCC] rounded-sm">
                      B2B REQUEST
                    </span>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-2 text-sm text-[#1C3A2C]">
                    <div className="flex items-start gap-2.5">
                      <Building size={16} className="text-[#CBA135] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Company Name</p>
                        <p className="font-semibold text-md">{user.businessDetails?.companyName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <FileText size={16} className="text-[#CBA135] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">GSTIN / Tax ID</p>
                        <p className="font-mono font-semibold tracking-wider">{user.businessDetails?.gstin || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-[#CBA135] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Registered Billing Address</p>
                        <p className="text-[#1E3A2F]/80 leading-relaxed font-sans text-xs">{user.businessDetails?.businessAddress || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-[#CBA135] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Registration Date</p>
                        <p className="text-xs font-semibold">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#FAF7ED] flex gap-3">
                  {activeTab === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="flex-1 bg-[#1E3A2F] text-white py-3 px-4 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all flex items-center justify-center gap-1.5 rounded-sm shadow-md"
                      >
                        <Check size={14} /> Approve Partner
                      </button>
                      <button
                        onClick={() => handleReject(user._id, false)}
                        className="border border-red-600 text-red-600 py-3 px-4 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 rounded-sm"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(user._id, true)}
                      className="w-full border border-red-600 text-red-600 py-3 px-4 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 rounded-sm shadow-sm"
                    >
                      <ShieldAlert size={14} /> Revoke Partnership
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
