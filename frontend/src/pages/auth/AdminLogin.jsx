import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";
import modelImage from "../../assets/authPages/signInModel.png";
import logo from "../../assets/authPages/logo.png";
import { axiosPostService, axiosPutService } from "../../services/axios";

const AdminSignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  // UI State
  const [step, setStep] = useState("login"); // 'login' | 'forgot' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // For reset step
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [sendOtp, setSendOtp] = useState()

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    securityKey:"",
    otp: ""
  });

  // Handle input changes centrally
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const resetFormSecurity = () => {
    setFormData(prev => ({ ...prev, password: "", newPassword: "", confirmPassword: "", otp: "" }));
    setShowPassword(false);
    setShowNewPassword(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      let adminData = {
        email: formData.email,
        password: formData.password

      }

      const apiResponse = await axiosPostService("/admin/auth/login", adminData);

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Invalid credentials provided.");
        return
      } else {
        // localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
        localStorage.setItem("adminToken", "succesfully");
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      const apiResponse = await axiosPostService("/admin/auth/forgetPasswordOtp", { email: formData.email });
      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Failed to send verification code.");
        return
      } else {
        setStep("otp");
        setSendOtp(apiResponse.data.data)
        setResendTimer(60);
      }
    } catch (error) {
      console.error("OTP Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (sendOtp !== formData.otp) {
        alert("The code entered is incorrect.");
        return
      } else {

        const adminData ={
          email: formData.email,
          password: formData.newPassword,
          securityKey: formData.securityKey
        }

        const apiResponse = await axiosPutService("/admin/auth/forgetPassword", adminData);

        if (!apiResponse.ok) {
          alert(apiResponse.data.message || "Password Not Change.");
          return
        } else {
          alert("Account secured. Password updated successfully.");
          navigate("/admin/dashboard");
        localStorage.setItem("adminToken", "succesfully");
        }
      }
    } catch (error) {
      console.error("Verification Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-svh w-full overflow-hidden bg-[#FBF6EA] font-serif selection:bg-[#1E3A2F]/30 text-[#1E3A2F]">

      {/* Left Panel: Brand Experience */}
      <div className="relative hidden w-[45%] lg:block overflow-hidden bg-[#1E3A2F]">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={modelImage}
          alt="Luxury Watch Collection"
          className="h-full w-full object-cover object-center grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/80 via-transparent to-transparent" />
        <div className="absolute inset-10 border border-white/20 pointer-events-none" />

        <div className="absolute inset-x-14 bottom-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <h2 className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#CBA135]">Secure Access</h2>
            <p className="text-lg leading-relaxed text-white/90 font-light italic">
              {step === "login"
                ? "“Precision is not just a metric; it is our heritage.” — Authorized Personnel Portal."
                : "Security protocols active. Follow the recovery steps to regain system access."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Auth Engine */}
      <div className="relative flex w-full flex-col overflow-y-auto bg-[#FDF9F0] lg:w-[55%]">

        <nav className="absolute left-8 top-10 lg:left-12">
          <button
            onClick={() => {
              if (step === "login") navigate("/signin");
              else { setStep("login"); resetFormSecurity(); }
            }}
            className="group flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] transition-all hover:text-[#CBA135]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {step === "login" ? "User Sign In" : "Return to Login"}
          </button>
        </nav>

        <main className="m-auto w-full max-w-[480px] px-8 py-24">
          <header className="mb-12">
            <motion.img
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              src={logo} alt="Brand Logo" className="mb-10 h-16 w-auto object-contain"
            />
            <h1 className="text-4xl font-normal tracking-tight lg:text-5xl">
              {step === "login" ? "Admin Login" : step === "forgot" ? "Reset Access" : "Identity Check"}
            </h1>
            <div className="mt-4 h-px w-12 bg-[#CBA135]" />
          </header>

          <AnimatePresence mode="wait">
            {step === "login" && (
              <motion.form
                key="login" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6" onSubmit={handleAdminLogin}
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-70">Corporate Email</label>
                  <input
                    id="email" required type="email" value={formData.email} onChange={(e) => handleChange(e)}
                    className="auth-input w-full border-b border-gray-200 bg-transparent py-4 outline-none transition-all focus:border-[#CBA135]"
                    placeholder="name@balajigiftshop.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-70">Security Token</label>
                    <button type="button" onClick={() => { setStep("forgot"); resetFormSecurity(); }} className="text-[10px] font-bold uppercase text-[#CBA135] hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <input
                      id="password" required type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange}
                      className="auth-input w-full border-b border-gray-200 bg-transparent py-4 outline-none transition-all focus:border-[#CBA135]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CBA135]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <SubmitButton isLoading={isLoading} text="Authorize Session" />
              </motion.form>
            )}

            {step === "forgot" && (
              <motion.form
                key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6" onSubmit={handleRequestOtp}
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-70">Verify Email</label>
                  <input id="email" required type="email" value={formData.email} onChange={handleChange} className="auth-input w-full border-b border-gray-200 bg-transparent py-4 outline-none focus:border-[#CBA135]" />
                </div>
                <label htmlFor="adminSecretKey" className="text-[11px] font-bold uppercase tracking-widest opacity-70">Authorization Key*</label>
                <div className="relative">
                  <input
                    id="securityKey"
                    required
                    name="securityKey"
                    type="password"
                    value={formData.securityKey}
                    onChange={handleChange}
                    placeholder="Secret Key"
                    className="auth-input w-full border-b border-gray-200 bg-transparent py-4 outline-none focus:border-[#CBA135]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-70">New Password</label>
                    <div className="relative">
                      <input
                        id="newPassword"

                        required
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="auth-input w-full border-b border-gray-200 bg-transparent py-4 pr-10 outline-none focus:border-[#CBA135]"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CBA135]">
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-70">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        required
                        type={showNewPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="auth-input w-full border-b border-gray-200 bg-transparent py-4 pr-10 outline-none focus:border-[#CBA135]"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CBA135]">
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <SubmitButton isLoading={isLoading} text="Request OTP" />
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-8 text-center" onSubmit={handleFinalVerify}
              >
                <div className="rounded-xl bg-[#1E3A2F]/5 py-8">
                  <ShieldCheck className="mx-auto mb-4 text-[#CBA135]" size={40} />
                  <p className="text-xs uppercase tracking-widest opacity-60">Verification code sent to email</p>
                  <input
                    id="otp" required type="text" maxLength={6} value={formData.otp} onChange={handleChange}
                    className="mt-6 bg-transparent text-center text-4xl tracking-[0.4em] font-light outline-none"
                    placeholder="000000"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span className="opacity-50">Expires in: {resendTimer}s</span>
                  <button
                    disabled={resendTimer > 0}
                    onClick={() => { setResendTimer(60); }}
                    className="flex items-center gap-2 text-[#CBA135] disabled:opacity-30"
                  >
                    <RefreshCw size={12} /> Resend Code
                  </button>
                </div>
                <SubmitButton isLoading={isLoading} text="Finalize Recovery" />
              </motion.form>
            )}
          </AnimatePresence>

          <footer className="mt-20 border-t border-gray-100 pt-8 text-center">
            {step === "login" && (
              <div className="mb-6">
                <button onClick={() => navigate("/admin/signup")} className="text-[13px] font-bold uppercase tracking-widest hover:text-[#CBA135]">
                  Request Administrative Access
                </button>
              </div>
            )}
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">System Architecture v4.0.2 / Encrypted</p>
          </footer>
        </main>
      </div>
    </section>
  );
};

const SubmitButton = ({ isLoading, text }) => (
  <motion.button
    whileHover={{ backgroundColor: "#142620" }}
    whileTap={{ scale: 0.99 }}
    className="flex h-[64px] w-full items-center justify-center bg-[#1E3A2F] text-[12px] font-bold uppercase tracking-[0.3em] text-white shadow-lg transition-all disabled:opacity-50"
    disabled={isLoading}
  >
    {isLoading ? <Loader2 className="animate-spin" size={20} /> : text}
  </motion.button>
);

export default AdminSignIn;