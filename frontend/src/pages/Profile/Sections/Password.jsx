import React, { useState } from "react";
import { axiosPutService, axiosPostService } from "../../../services/axios";
import { Eye, EyeOff, X, Mail, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Password = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingForgotPassword, setIsResettingForgotPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- VALIDATIONS ---
  const validatePassword = () => {
    let errors = [];
    if (!oldPassword?.trim()) errors.push("Current password is required");
    if (!newPassword?.trim()) errors.push("New password is required");
    if (newPassword?.length < 8) errors.push("Password must be at least 8 characters");
    if (!/[^A-Za-z0-9]/.test(newPassword)) errors.push("Add at least one special symbol (!@#$)");
    if (newPassword !== confirmPassword) errors.push("Passwords do not match");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  // --- HANDLERS ---
  const handleUpdate = async () => {
    if (!validatePassword()) return;
    try {
      setIsUpdating(true);
      const response = await axiosPutService("/customer/auth/changePassword", {
        oldPassword, newPassword, confirmPassword
      });

      if (response.ok) {
        setShowSuccess(true);
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        alert(response.data.message || "Failed to change password");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForgotModalState = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setIsSendingReset(false);
    setIsVerifyingOtp(false);
    setIsResettingForgotPassword(false);
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    resetForgotModalState();
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const normalizedEmail = forgotEmail?.trim()?.toLowerCase();

    if (!normalizedEmail) return alert("Please enter your email");
    
    try {
      setIsSendingReset(true);
      const response = await axiosPostService("/customer/auth/forgot-password/request", { email: normalizedEmail });
      
      if (response.ok) {
        setForgotStep("verify");
        alert("Password reset OTP sent to your email.");
      } else {
        alert(response.data.message || "Email not found");
      }
    } catch (err) {
      alert("Service unavailable. Try later.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleForgotPasswordVerify = async (e) => {
    e.preventDefault();

    const normalizedEmail = forgotEmail?.trim()?.toLowerCase();

    if (!normalizedEmail) {
      alert("Email is required");
      setForgotStep("email");
      return;
    }

    if (!forgotOtp || String(forgotOtp).trim().length !== 6) {
      alert("Please enter valid 6 digit OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const response = await axiosPostService("/customer/auth/forgot-password/verify", {
        email: normalizedEmail,
        otp: String(forgotOtp).trim(),
      });

      if (!response.ok) {
        alert(response?.data?.message || "Incorrect OTP");
        return;
      }

      setForgotStep("reset");
    } catch (err) {
      alert("Service unavailable. Try later.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleForgotPasswordReset = async (e) => {
    e.preventDefault();

    const normalizedEmail = forgotEmail?.trim()?.toLowerCase();

    if (!normalizedEmail) {
      alert("Email is required");
      setForgotStep("email");
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(forgotNewPassword)) {
      alert("Add at least one special symbol (!@#$)");
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsResettingForgotPassword(true);

      const response = await axiosPutService("/customer/auth/forgot-password/reset", {
        email: normalizedEmail,
        password: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      });

      if (!response.ok) {
        alert(response?.data?.message || "Failed to reset password");
        return;
      }

      alert("Password reset successfully.");
      closeForgotModal();
    } catch (err) {
      alert("Service unavailable. Try later.");
    } finally {
      setIsResettingForgotPassword(false);
    }
  };

  const EyeIcon = ({ isVisible, toggle }) => (
    <button 
      type="button"
      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer transition-opacity"
      onClick={toggle}
    >
      {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  );

  return (
    <div className="font-serif w-full max-w-4xl animate-fadeIn relative p-4">
      
      {/* --- FORGOT PASSWORD MODAL --- */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={closeForgotModal} className="absolute right-4 top-4 text-gray-400 hover:text-black cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-[#1B3022]/10 rounded-full flex items-center justify-center mx-auto text-[#1B3022]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-medium text-[#1B3022]">Reset Password</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your registered email. Verify OTP, then create your new password.
                </p>
                
                {forgotStep === "email" && (
                  <form onSubmit={handleForgotPassword} className="space-y-4 pt-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="email" 
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-100 outline-none focus:border-[#1B3022] text-sm"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>
                    <button 
                      disabled={isSendingReset}
                      className="w-full bg-[#1B3022] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#2a4532] transition-all disabled:opacity-50"
                    >
                      {isSendingReset ? "Sending..." : "Send OTP"}
                    </button>
                  </form>
                )}

                {forgotStep === "verify" && (
                  <form onSubmit={handleForgotPasswordVerify} className="space-y-4 pt-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">OTP</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-3 border border-gray-100 outline-none focus:border-[#1B3022] text-sm"
                        placeholder="Enter 6 digit OTP"
                      />
                    </div>

                    <button 
                      disabled={isVerifyingOtp}
                      className="w-full bg-[#1B3022] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#2a4532] transition-all disabled:opacity-50"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotStep("email")}
                      className="w-full border border-[#1B3022] text-[#1B3022] py-3 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#1B3022]/5 transition-all"
                    >
                      Change Email / Resend OTP
                    </button>
                  </form>
                )}

                {forgotStep === "reset" && (
                  <form onSubmit={handleForgotPasswordReset} className="space-y-4 pt-4 text-left">

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">New Password</label>
                      <input
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-100 outline-none focus:border-[#1B3022] text-sm"
                        placeholder="Min 8 chars + symbol"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-100 outline-none focus:border-[#1B3022] text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button 
                      disabled={isResettingForgotPassword}
                      className="w-full bg-[#1B3022] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#2a4532] transition-all disabled:opacity-50"
                    >
                      {isResettingForgotPassword ? "Updating..." : "Reset Password"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotStep("email")}
                      className="w-full border border-[#1B3022] text-[#1B3022] py-3 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-[#1B3022]/5 transition-all"
                    >
                      Change Email / Resend OTP
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-xl space-y-8">
        {/* Current Password */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-800">Current Password *</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-100 bg-white outline-none focus:border-[#1B3022] shadow-sm text-sm"
              placeholder="••••••••"
            />
            <EyeIcon isVisible={showOld} toggle={() => setShowOld(!showOld)} />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => {
                resetForgotModalState();
                setIsForgotModalOpen(true);
              }}
              className="text-[11px] text-[#1B3022] underline cursor-pointer hover:font-bold transition-all uppercase tracking-tighter"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-800">New Password *</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-100 bg-white outline-none focus:border-[#1B3022] shadow-sm text-sm"
              placeholder="Min 8 chars + symbol"
            />
            <EyeIcon isVisible={showNew} toggle={() => setShowNew(!showNew)} />
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-800">Confirm New Password *</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-100 bg-white outline-none focus:border-[#1B3022] shadow-sm text-sm"
              placeholder="Repeat New Password"
            />
            <EyeIcon isVisible={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
          </div>
        </div>

        {/* Update Button */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-fit bg-[#1B3022] text-white py-3.5 px-12 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#253d2c] transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? "Processing..." : showSuccess ? "Updated! ✓" : "Update Password"}
          </button>
          
          <AnimatePresence>
            {showSuccess && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-600 text-[10px] font-bold uppercase tracking-widest italic"
              >
                ✓ Your security settings have been saved.
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Password;