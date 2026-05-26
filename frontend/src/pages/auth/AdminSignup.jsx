import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, User, Mail, Lock } from "lucide-react";
import modelImage from "../../assets/authPages/signInModel.png";
import logo from "../../assets/authPages/logo.png";
import { axiosPostService } from "../../services/axios"

// Animation variants for a polished entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const AdminSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    let errors = [];

    if (!formData.name.trim()) errors.push("Full Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.password.trim()) errors.push("Password is required");

    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    const specialRegex = /[^A-Za-z0-9]/;
    if (formData.password && !specialRegex.test(formData.password)) {
      errors.push("Password must contain at least one special symbol (!,@,#,$ etc.)");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleAdminSignUp = async (e) => {
    e.preventDefault();

    if(!validatePassword()) return

    setIsLoading(true);
    const email = formData.email.trim().toLowerCase();

    const apiResponse = await axiosPostService("/admin/auth/signupOtp", { email });

    if (!apiResponse.ok) {
      const detailedError =
        apiResponse?.data?.errors?.[0]?.message ||
        apiResponse?.data?.message ||
        "Signup Failed";

      alert(detailedError);
      setIsLoading(false)
      return
    }
    else {
      setTimeout(() => {
        setIsLoading(false);

        // Optional: Save to localStorage for frontend persistence
        // localStorage.setItem("pendingAdmin", JSON.stringify(formData));

        // Redirect to Verify.jsx with state
        navigate("/verify", {
          state: {
            path: "/admin/auth/signup", 
            client: formData,           
            otp: apiResponse.data.data,
            role:"admin"       
          }
        });

      }, 1500);
    }
  };

  return (
    <section className="flex h-svh w-full overflow-hidden bg-[#FBF6EA] font-serif selection:bg-[#1E3A2F]/20">

      {/* LEFT IMAGE SECTION - Architectural Composition */}
      <div className="relative hidden w-[45%] lg:block overflow-hidden bg-[#1E3A2F]">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          src={modelImage}
          alt="Balaji Gift Shop Master Collection"
          className="h-full w-full object-cover object-center opacity-90 pointer-events-none"
        />
        <div className="absolute inset-10 border border-white/30 pointer-events-none z-10" />

        <div className="absolute inset-x-16 bottom-12 z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-white/20 bg-black/10 p-10 backdrop-blur-md"
          >
            <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Console Access</h2>
            <p className="text-[20px] leading-[1.6] tracking-wide text-white font-light antialiased">
              "Precision is the foundation of heritage." Oversee Balaji Gift Shop's master inventory and administrative operations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT FORM SECTION - Pixel Perfect Alignment */}
      <div className="relative flex w-full flex-col overflow-y-auto lg:w-[55%] bg-[#FDF9F0]">

        <nav className="absolute left-8 top-10 lg:left-14">
          <button
            onClick={() => navigate("/admin/login")}
            className="group flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#1E3A2F] transition-all hover:opacity-60"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Admin Login
          </button>
        </nav>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="m-auto w-full max-w-[560px] px-8 py-20 lg:px-16"
        >
          <header className="mb-12">
            <motion.div variants={itemVariants} className="mb-8 h-[70px]">
              <img src={logo} alt="Balaji Gift Shop" className="h-full object-contain" />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-[42px] font-normal leading-tight text-[#1E3A2F] tracking-tight">
              Administrator Registration
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-2 text-[15px] font-semibold text-[#CBA135] uppercase tracking-widest">
              Secure System Onboarding
            </motion.p>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleAdminSignUp}>
            {/* Full Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="fullName" className="block text-[11px] font-black uppercase tracking-[0.15em] text-[#1E3A2C]">Full Name*</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBA135]/50" size={16} />
                <input
                  id="fullName"
                  required
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alexander Crown"
                  className="w-full bg-white border border-gray-100 pl-12 pr-4 py-4 text-[15px] text-[#1E3A2F] outline-none transition-all focus:border-[#CBA135] focus:ring-4 focus:ring-[#CBA135]/5 shadow-sm"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-[0.15em] text-[#1E3A2C]">Work Email*</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBA135]/50" size={16} />
                <input
                  id="email"
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@balajigiftshop.com"
                  className="w-full bg-white border border-gray-100 pl-12 pr-4 py-4 text-[15px] text-[#1E3A2F] outline-none transition-all focus:border-[#CBA135] focus:ring-4 focus:ring-[#CBA135]/5 shadow-sm"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <div className="grid grid-cols-1 gap-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-[0.15em] text-[#1E3A2C]">System Password*</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBA135]/50" size={16} />
                  <input
                    id="password"
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-100 pl-12 pr-12 py-4 text-[15px] text-[#1E3A2F] outline-none transition-all focus:border-[#CBA135] focus:ring-4 focus:ring-[#CBA135]/5 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1E3A2F] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.99 }}
              className="relative h-[60px] w-full bg-[#1C332A] mt-4 text-[13px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#142620] disabled:opacity-80 shadow-xl shadow-[#1E3A2F]/10 flex justify-center items-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="animate-spin" size={20} />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Establish Admin Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <footer className="mt-16 text-center border-t border-gray-200/60 pt-10">
            <p className="text-[11px] text-gray-400 uppercase tracking-[0.4em] font-black opacity-80">
              Balaji Gift Shop Security Protocol • v4.0.2-LTS
            </p>
          </footer>
        </motion.main>
      </div>
    </section>
  );
};

export default AdminSignUp;