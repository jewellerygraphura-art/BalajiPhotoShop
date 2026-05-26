import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
// Senior Tip: Ensure these assets are correctly linked in your project structure
import modelImage from "../../assets/authPages/signUpModel.png";
import { axiosPostService } from "../../services/axios";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const navigate = useNavigate(); // Fixed: Added parentheses

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const validateForm = () => {

    if (!firstName.trim()) {
      alert("First Name is required");
      return false;
    }

    if (!lastName.trim()) {
      alert("Last Name is required");
      return false;
    }

    if (!email) {
      alert("Email is required");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return false;
    }

    if (!password) {
      alert("Password is required");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }

    if (!confirmPassword) {
      alert("Confirm password is required");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (!rememberMe) {
      alert("Please accept Terms & Conditions");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: "B2C"
      }
      await new Promise(resolve => setTimeout(resolve, 1500));

      const apiResponse = await axiosPostService(
        "/customer/auth/signupOtp",
        { email } // OTP only needs email
      );

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Failed to send OTP");
        return;
      }
      else {
        navigate("/verify", {
          state: {
            path: "/customer/auth/signup",
            client: formData,
            otp: apiResponse.data.data
          }
        });
      }

    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSignup = async (cred) => {
    try {
      const token = cred.credential;

      const apiResponse = await axiosPostService("/customer/auth/googleLogin", { token });

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "SignUp Failed");
        return
      }

      localStorage.setItem("access", "true");
      navigate("/", {
        state: { welcomeMessage: true, userName: apiResponse.data.data.email, isReturningUser: true }
      });
    }
    catch (err) {
      console.error(
        "❌ Google login failed:",
        err.response?.data || err.message
      );
    }
  }



  return (
    <section className="flex h-svh w-full overflow-hidden bg-[#FBF6EA] font-serif selection:bg-[#1E3A2F]/10">

      {/* LEFT IMAGE SECTION - Luxury Branding */}
      <div className="relative hidden w-[45%] lg:block overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={modelImage}
          alt="Balaji Gift Store"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-8 border border-white/40 pointer-events-none z-10" />

        <div className="absolute bottom-12 left-12 right-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-white/30 bg-white/10 p-8 backdrop-blur-md"
          >
            <p className="text-[18px] leading-[1.6] tracking-wide text-white font-light">
              Where premium curation meets contemporary gifting in every beautiful
              detail. <span className="font-semibold italic">Balaji Gift Store</span> curates
              experiences that reflect joy, warmth, and individuality.
            </p>
          </motion.div>

          {/* <div className="mt-6 flex items-center gap-3">
            <span className="h-1.5 flex-1 rounded-full bg-[#C9A23F]" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
          </div> */}
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex w-full flex-col overflow-y-auto bg-[#FBF6EA] px-8 lg:w-[55%] lg:px-16 xl:px-24">
        <div className="mx-auto my-auto w-full max-w-[480px] py-12">

          <header className="mb-10 text-left">
            <h1 className="text-[44px] md:text-[48px] font-normal leading-tight text-[#1E3A2F] tracking-tight">
              Sign Up
            </h1>
            <p className="mt-2 text-[15px] font-medium text-[#B08E42] tracking-wide">
              Fill your information below or register with your social account
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-[#1E3A2F] uppercase tracking-widest">
                  First Name*
                </label>
                <input
                  required
                  type="text"
                  placeholder="Bessie"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-gray-100 px-4 py-3.5 text-[15px] outline-none transition-all focus:border-[#CBA135] focus:ring-1 focus:ring-[#CBA135]/10"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-[#1E3A2F] uppercase tracking-widest">
                  Last Name*
                </label>
                <input
                  required
                  type="text"
                  placeholder="Cooper"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-gray-100 px-4 py-3.5 text-[15px] outline-none transition-all focus:border-[#CBA135] focus:ring-1 focus:ring-[#CBA135]/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-[#1E3A2F] uppercase tracking-widest">
                Email Address*
              </label>
              <input
                required
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-100 px-4 py-3.5 text-[15px] outline-none transition-all focus:border-[#CBA135] focus:ring-1 focus:ring-[#CBA135]/10"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-[#1E3A2F] uppercase tracking-widest">
                Password*
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-100 px-4 py-3.5 pr-12 text-[15px] outline-none transition-all focus:border-[#CBA135] focus:ring-1 focus:ring-[#CBA135]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A2F] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-[#1E3A2F] uppercase tracking-widest">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-100 px-4 py-3.5 pr-12 text-[15px] outline-none transition-all focus:border-[#CBA135] focus:ring-1 focus:ring-[#CBA135]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A2F] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 accent-[#1E3A2F] cursor-pointer focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="cursor-pointer text-[14px] font-semibold text-[#1E3A2F]">
                I agree to the <span className="underline decoration-[#CBA135]">Terms & Conditions</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="relative w-full bg-[#1C332A] py-4 text-[14px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#142620] disabled:opacity-80 disabled:cursor-not-allowed shadow-lg shadow-[#1E3A2F]/10 flex justify-center items-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" size={20} />
                    <span>Registering...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Create Account
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute w-full border-t border-gray-200"></div>
            <span className="relative bg-[#FBF6EA] px-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              or Join with
            </span>
          </div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center"
          >
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => console.log("❌ Google Login Failed")}
              shape="rectangular"
              size="large"
              theme="outline"
              width="100%"
              className="flex w-full items-center justify-center gap-3 border border-gray-200 bg-white py-3.5 text-[13px] font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
              </svg>
              Google
            </GoogleLogin>
          </motion.div>

          <footer className="mt-8 text-center text-[15px] text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-bold text-[#1E3A2F] underline underline-offset-8 transition-all hover:text-black"
            >
              Sign In
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default SignUp;