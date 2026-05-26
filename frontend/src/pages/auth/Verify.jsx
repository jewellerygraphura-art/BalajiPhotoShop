import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import modelImage from "../../assets/authPages/verifyModel.png";
import logo from "../../assets/authPages/logo.png";
import { axiosPostService } from "../../services/axios";
import { useLocation } from "react-router-dom";


export default function Verify() {

  let location = useLocation();

  let { path, client, otp, role} = location.state || {};

  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const [emailOtp, setEmailOtp] = useState(otp || "");
  const [enterOtp, setEnterOtp] = useState("")
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [adminSecurityKey, setAdminSecurityKey] = useState("");

  useEffect(() => {
    if (!path || !client?.email) {
      navigate("/signin", { replace: true });
    }
  }, [path, client, navigate]);

   const otpTimer = () => {
    setTimeout(() => {
      setEmailOtp("")
    },5*60*1000)
  }

  useEffect(() => {
    otpTimer();
  }, [emailOtp])


  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (role === "admin" && isOtpVerified) {
      const trimmedSecurityKey = adminSecurityKey.trim();

      if (!trimmedSecurityKey) {
        setIsLoading(false);
        return alert("Authorization Key is required");
      }

      const apiResponse = await axiosPostService(path, {
        ...client,
        securityKey: trimmedSecurityKey,
      });

      if (!apiResponse.ok) {
        setIsLoading(false);
        alert(apiResponse.data.message || "Signup Failed");
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/dashboard");
      }, 1500);

      return;
    }

    if (!emailOtp) {
      setIsLoading(false);
      return alert("OTP expired. Please resend OTP.");
    }

    if (`${emailOtp}` !== `${enterOtp}`) {
      setIsLoading(false);
      return alert("Incorrect Otp");
    }
    else {
      if (role === "admin") {
        setIsOtpVerified(true);
        setIsLoading(false);
        return;
      }

      const apiResponse = await axiosPostService(path, client);

      if (!apiResponse.ok) {
        setIsLoading(false);
        alert(apiResponse.data.message || "Signup Failed");
        return;
      }
      // Simulate API verification
      setTimeout(() => {
        setIsLoading(false);
        // REDIRECT TO COMING SOON
        if(role === "admin"){
          navigate("/admin/dashboard");
        }
        else{
          localStorage.setItem("access", "true");
          navigate("/coming-soon", {state: {email: apiResponse.data.data.email}});
        }
      }, 1500);
    }
  };

  const resendOtp = async (e) => {
    e.preventDefault();

    let email = client.email
    const endpoint = role === "admin" ? "/admin/auth/signupOtp" : "/customer/auth/signupOtp";
    const payload = { email };

    const apiResponse = await axiosPostService(
      endpoint,
      payload
    );
    if (!apiResponse.ok) {
      alert(apiResponse.data.message || "Failed to send OTP");
      return;
    }

    setEmailOtp(apiResponse?.data?.data || "")
  }

  return (
    <div className="flex h-screen w-full bg-[#fbf6ea] font-[Georgia] overflow-hidden flex-col md:flex-row">

      {/* LEFT IMAGE SECTION */}
      <div className="relative hidden w-[45%] lg:block overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={modelImage}
          alt="Balaji Gift Shop Model"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-9 border border-white/50 pointer-events-none z-10" />
        <div className="absolute inset-x-14 bottom-10 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-white/30 bg-white/10 p-8 backdrop-blur-sm"
          >
            <p className="text-[19px] leading-[1.6] tracking-wide text-white font-light drop-shadow-sm">
              Gifting is not just giving, it is remembered across generations. Balaji Gift Shop by Graphura crafts timeless hampers and traditional toys that become part of your legacy.
            </p>
          </motion.div>
          <div className="mt-8 flex items-center gap-2 px-1">
            <span className="h-1.5 flex-1 rounded-full bg-[#C9A23F] shadow-sm" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
            <span className="h-1.5 flex-1 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT - Added m-auto to fix the "zoomed" look */}
      <div className="flex w-full md:w-[55%] items-center justify-center bg-[#fbf6ea] p-4">
        <div className="w-full max-w-[28rem] px-4">

          {/* HEADER */}
          <div className="mb-9 text-left">
            <div className="mb-8 flex justify-start">
              <img src={logo} alt="logo" className="w-14 h-auto" />
            </div>

            <h1 className="text-3xl md:text-4xl font-medium text-[#1f3d2b] mb-2 tracking-tight">
              {role === "admin" && isOtpVerified ? "Verify Authorization Key" : "Verify Code"}
            </h1>

            <p className="text-sm md:text-base text-[#b08a2e] font-normal leading-relaxed">
              {role === "admin" && isOtpVerified ? (
                <>
                  OTP verified. Enter your authorization key to complete admin registration.
                </>
              ) : (
                <>
                  Please enter the code we just sent to email <br />
                  <span className="font-medium text-[#1f3d2b]">
                    {client?.email}
                  </span>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {!isOtpVerified && (
              <>
                {/* OTP LABEL */}
                <label className="mb-2 block text-sm font-medium text-[#1f3d2b]">Code*</label>

                {/* OTP INPUTS */}
                <div className="mb-9 flex gap-3 md:gap-4 justify-between md:justify-start">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      maxLength="1"
                      ref={(el) => (inputsRef.current[i] = el)}
                      onChange={(e) => {
                        handleChange(e, i)
                        const digits = inputsRef.current.map((input) => input.value || "").join("");
                        setEnterOtp(digits);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="h-10 w-10 md:h-13 md:w-13 text-xl text-center rounded border border-gray-300 focus:border-[#1f3d2b] outline-none bg-white transition-all shadow-sm"
                    />
                  ))}
                </div>
              </>
            )}

            {role === "admin" && isOtpVerified && (
              <div className="mb-9">
                <label className="mb-2 block text-sm font-medium text-[#1f3d2b]">Authorization Key*</label>
                <input
                  type="password"
                  value={adminSecurityKey}
                  onChange={(e) => setAdminSecurityKey(e.target.value)}
                  placeholder="Enter Authorization Key"
                  className="h-12 w-full rounded border border-gray-300 px-4 text-base focus:border-[#1f3d2b] outline-none bg-white transition-all shadow-sm"
                />
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-[#1f3d2b] py-3 text-white text-base font-semibold hover:bg-[#173022] transition-colors flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : role === "admin" && isOtpVerified ? "Complete Registration" : "Verify OTP"}
            </button>
          </form>

          {/* RESEND */}
          {!isOtpVerified && (
            <p className="mt-6 text-center text-sm font-normal text-gray-600">
              Didn’t Receive code?{" "}
              <button
                type="button"
                disabled={timer > 0}
                onClick={(e) => {
                  resendOtp(e);
                  setTimer(30);
                }}
                className={`font-medium underline underline-offset-4 transition-colors ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#1f3d2b] hover:text-[#b08a2e]"}`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
