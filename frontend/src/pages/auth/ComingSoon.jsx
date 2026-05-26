import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import model from "../../assets/authPages/comingModel.png";

const LAUNCH_DATE = new Date("2025-12-31T00:00:00").getTime();

export default function ComingSoon() {
  const {email} = useLocation().state || {}
  const navigate = useNavigate();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(LAUNCH_DATE - now, 0);
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval); 
  }, []);

  const timerData = useMemo(() => [
    { label: "Day", value: time.days },
    { label: "Hour", value: time.hours },
    { label: "Minute", value: time.minutes },
    { label: "Second", value: time.seconds },
  ], [time]);

  const handleSkip = () => {
    navigate("/", {state: {welcomeMessage: true,userName: email}});
  };

 return (
  <main className="flex min-h-screen w-full bg-[#FDF9F0] font-serif overflow-hidden flex-col md:flex-row">
    
    {/* LEFT SECTION */}
    <section className="relative w-full md:w-[52%] h-[65vh] md:h-screen overflow-hidden">
      <img
        src={model}
        alt="Luxury Jewelry Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Left section ka baaki code yahan rahega */}
    </section>

    {/* RIGHT SECTION */}
    <section className="relative w-full md:w-[48%] flex flex-col items-center justify-center bg-[#FDF9F0] px-10 md:px-20">
      <button 
  onClick={handleSkip}
  className="absolute top-10 right-10 text-[16px] px-4 py-2 text-[#1c3a2c] underline underline-offset-4 tracking-widest font-medium hover:text-[#c9a23f] transition-colors"
>
  SKIP
</button>

      <div className="w-full max-w-[400px] flex flex-col items-center md:items-start">
        <p className="tracking-[0.4em] text-[11px] font-bold text-[#1c3a2c] uppercase mb-6">Coming Soon</p>
        <h1 className="text-[2.6rem] md:text-[3.2rem] leading-[1.2] text-[#c9a23f] mb-12 text-center md:text-left font-normal">
          Get notified when <br className="hidden md:block" /> we launch!
        </h1>

        {/* ⭐ YAHAN PE TIMER ADD KIYA ⭐ */}
        <div className="w-full flex justify-between items-center mb-10 py-6 border-y border-gray-200/60">
          {timerData.map((item, i) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center flex-1">
                <span className="text-4xl md:text-5xl font-light text-[#1c3a2c] tabular-nums leading-none">
                  {item.value.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1c3a2c] mt-4 font-bold opacity-80">
                  {item.label}
                </span>
              </div>
              {i !== 3 && <div className="h-10 w-[1px] bg-gray-300/50" />}
            </React.Fragment>
          ))}
        </div>

        <p className="text-[14px] text-[#1c3a2c] mb-6 font-medium opacity-80">
          Get notified when it goes live
        </p>
        
        {/* Email form */}
        <form className="flex w-full gap-4 items-stretch" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter Email Address" 
            className="w-full h-12 px-4 bg-white border border-gray-200 text-[13px] outline-none shadow-sm focus:border-[#c9a23f]" 
          />
          <button 
            type="submit" 
            className="h-12 px-8 bg-[#c9a23f] text-white text-[13px] font-semibold rounded-[2px] hover:bg-[#b08a2e]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </main>
);
}