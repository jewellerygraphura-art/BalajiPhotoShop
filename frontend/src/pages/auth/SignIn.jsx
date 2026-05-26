import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import modelImage from "../../assets/authPages/signInModel.png";
import logo from "../../assets/authPages/logo.png";
import { axiosPostService, axiosPutService } from "../../services/axios";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleGoogleLogin = async (cred) => {
    try {
      const token = cred.credential;
      const apiResponse = await axiosPostService("/customer/auth/googleLogin", { token });

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "SignIn Failed");
      } else {
        localStorage.setItem("access", "true");
        navigate("/", {
          state: { welcomeMessage: true, userName: apiResponse.data.data.email, isReturningUser: true }
        });
      }
    } catch (error) {
      console.error("❌ Google login failed:", error.response?.data || error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const nameFromEmail = email.split('@')[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

      const apiResponse = await axiosPostService("/customer/auth/login", { email, password });

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "SignIn Failed");
      } else {
        localStorage.setItem("access", "true");
        navigate("/", {
          state: { welcomeMessage: true, userName: displayName, isReturningUser: true }
        });
      }
    } catch (error) {
      console.error("Auth failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();

    const normalizedEmail = email?.trim()?.toLowerCase();
    if (!normalizedEmail) return;

    setIsLoading(true);
    try {
      const apiResponse = await axiosPostService("/customer/auth/forgot-password/request", { email: normalizedEmail });
      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Otp Sending Failed");
      } else {
        setView("verify");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiResponse = await axiosPostService("/customer/auth/forgot-password/verify", {
        email: email?.trim()?.toLowerCase(),
        otp,
      });

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "OTP verification failed");
      } else {
        setView("reset");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const apiResponse = await axiosPutService("/customer/auth/forgot-password/reset", {
        email: email?.trim()?.toLowerCase(),
        password,
        confirmPassword,
      });

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Password Not Updated");
      } else {
        alert("Success! Your password has been updated.");
        setView("login");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-svh w-full overflow-hidden bg-[#FBF6EA] font-serif">
      {/* LEFT IMAGE SECTION */}
      <div className="relative hidden w-[45%] lg:block overflow-hidden bg-[#1E3A2F]">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={modelImage}
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-9 border border-white/50 pointer-events-none z-10" />
        <div className="absolute inset-x-14 bottom-10 z-20">
          <div className="rounded-lg border border-white/30 bg-white/10 p-8 backdrop-blur-sm">
            <p className="text-[19px] leading-[1.6] text-white font-light">
              Every gift at Balaji Gift Store is a symbol of joy, premium artistry, and heritage. Sourced carefully for your special moments, our hampers are made to celebrate relationships—forever.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="relative flex w-full flex-col overflow-y-auto lg:w-[55%] bg-[#FDF9F0]">
        {view !== "login" && (
          <button onClick={() => setView("login")} className="absolute left-8 top-10 flex items-center gap-2 text-[13px] font-bold text-[#1E3A2F] uppercase transition-colors hover:text-[#CBA135]">
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        )}

        <div className="m-auto w-full max-w-[500px] px-8 py-12 lg:px-12">
          <header className="mb-10 text-left">
            <img src={logo} alt="Balaji Gift Shop" className="mb-6 h-[80px] object-contain" />
            <h1 className="text-[44px] font-normal text-[#1E3A2F]">
              {view === "login" ? "Sign In" : view === "forgot" ? "Forgot Password" : view === "verify" ? "Verification" : "New Password"}
            </h1>
            <p className="mt-2 text-[16px] font-medium text-[#CBA135] uppercase tracking-wide">
              {view === "login" ? "Access your account" : view === "forgot" ? "Enter your email" : view === "verify" ? "Check your email" : "Reset your credentials"}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-bold text-[#1E3A2C]">Email Address*</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-3.5 outline-none focus:border-[#CBA135] transition-all" placeholder="Enter your email" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="block text-[14px] font-bold text-[#1E3A2C]">Password*</label>
                      <button type="button" onClick={() => setView("forgot")} className="text-[13px] font-bold underline text-[#1E3A2F] hover:text-[#CBA135]">Forgot?</button>
                    </div>
                    <div className="relative">
                      <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-3.5 outline-none focus:border-[#CBA135] transition-all" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A2F]">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="accent-[#1E3A2F]" />
                    <label htmlFor="remember" className="text-[14px] text-gray-600">Remember me</label>
                  </div>

                  <SubmitButton isLoading={isLoading} label="SIGN IN" />
                </form>

                <div className="relative my-10 flex items-center justify-center">
                  <div className="absolute w-full border-t border-gray-200"></div>
                  <span className="relative bg-[#FDF9F0] px-4 text-[12px] text-gray-400 uppercase">Or continue with</span>
                </div>

                <div className="flex justify-center items-center w-full mt-2">
                  {/* UPDATE: Wrapped GoogleLogin to fix width issues */}
                  <div className="w-full flex justify-center overflow-hidden min-h-[50px]">
                    <GoogleLogin 
                      onSuccess={handleGoogleLogin} 
                      onError={() => console.log("Login Failed")}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="100%" // Set to 100% to fill container
                    />
                  </div>
                </div>

                <footer className="mt-8 text-center text-[15px] text-gray-600">
                  Don't have an account?{" "}
                  <button className="font-bold text-[#1E3A2F] underline hover:text-[#CBA135]" onClick={() => navigate("/signup")}>Sign Up</button>
                  
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={() => navigate("/admin/login")}
                      className="text-[16px] text-gray-400/30 hover:text-gray-600 transition-all cursor-pointer select-none px-4 py-2"
                      aria-label="Admin Login"
                    >
                      .
                    </button>
                  </div>
                </footer>
              </motion.div>
            )}

            {view === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <form className="space-y-5" onSubmit={handleForgotPasswordRequest}>
                   <div className="space-y-2">
                    <label className="block text-[14px] font-bold text-[#1E3A2C]">Registered Email*</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-3.5 outline-none focus:border-[#CBA135]" placeholder="Enter email" />
                  </div>
                  <SubmitButton isLoading={isLoading} label="Send OTP" />
                </form>
              </motion.div>
            )}

            {view === "verify" && (
              <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <form className="space-y-8" onSubmit={handleVerifyOtp}>
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-[#CBA135]/10 text-[#CBA135]">
                      <ShieldCheck size={40} />
                    </div>
                    <p className="text-[15px] text-gray-600">Enter code sent to <b>{email}</b></p>
                  </div>
                  <input required type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white border-2 border-dashed border-gray-200 py-5 text-center text-[28px] font-bold tracking-[0.5em] outline-none focus:border-[#CBA135]" placeholder="000000" />
                  <SubmitButton isLoading={isLoading} label="Verify OTP" />
                </form>
              </motion.div>
            )}

            {view === "reset" && (
              <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <form className="space-y-5" onSubmit={handleResetPassword}>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-bold text-[#1E3A2C]">New Password*</label>
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-3.5 outline-none focus:border-[#CBA135]" placeholder="Min 8 characters" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-bold text-[#1E3A2C]">Confirm Password*</label>
                    <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-3.5 outline-none focus:border-[#CBA135]" placeholder="Confirm password" />
                  </div>
                  <SubmitButton isLoading={isLoading} label="Reset Password" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const SubmitButton = ({ isLoading, label }) => (
  <motion.button
    type="submit"
    disabled={isLoading}
    whileTap={{ scale: 0.98 }}
    className="h-[60px] w-full bg-[#1C332A] text-[15px] font-bold tracking-[0.2em] text-white hover:bg-[#142620] flex justify-center items-center shadow-md transition-all active:shadow-inner"
  >
    {isLoading ? <Loader2 className="animate-spin" /> : label}
  </motion.button>
);

export default SignIn;