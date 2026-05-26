import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import ProductCard from "../../components/products/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectFade, Navigation, Pagination, EffectCoverflow } from "swiper/modules";

import gCrown from "../../assets/g-crown Image.jpeg";
// Pehle wale imports ke saath ye bhi add karein
import engagementRingsImg from "../../assets/homePage/engement_rings.jpg";
import weddingBandsImg from "../../assets/homePage/wedding_bands.jpg";
import classicSolitaireImg from "../../assets/homePage/classic_solitaire.jpg";
import vintageBandsImg from "../../assets/homePage/vintage_band.jpg";
import Icon1 from "../../assets/homePage/Icon1.png";
import Icon2 from "../../assets/homePage/Icon2.png";
import Icon3 from "../../assets/homePage/Icon3.png";
import Icon4 from "../../assets/homePage/Icon4.png";
import WomenImg from "../../assets/homePage/Women.png";
import MenImg from "../../assets/homePage/Men.png";
import KidImg from "../../assets/homePage/Kids.png";
import Necklace from "../../assets/homePage/necklace.png";
import { ProductContext } from "../../context/ProductContext.jsx";
import user1 from "../../assets/images/user1.jpg";
import user2 from "../../assets/images/user2.jpg";
import user3 from "../../assets/images/user3.jpg";
import user4 from "../../assets/images/user4.jpg";
import video1 from "../../assets/videos/video1.mp4";
import video2 from "../../assets/videos/video2.mp4";
import video3 from "../../assets/videos/video3.mp4";
import video4 from "../../assets/videos/video4.mp4";
import video5 from "../../assets/videos/video5.mp4";
import video6 from "../../assets/videos/video6.mp4";
import video7 from "../../assets/videos/video7.mp4";
import video8 from "../../assets/videos/video8.mp4";
import video9 from "../../assets/videos/video9.mp4";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000",
    title: "Traditional Indian Gifts",
    subtitle: "Handcrafted Heritage Art & Culture"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1548907040-4d42b52115ca?q=80&w=1000",
    title: "Premium Frames & Toys",
    subtitle: "For Lifelong Warm Festive Memories"
  }
];

const COLLECTIONS = [
  { 
    title: "Traditional Indian Gifts", 
    subtitle: "Exquisite handmade heritage curation", 
    image: engagementRingsImg, 
    isNew: true, 
    path: "/collections/traditional-indian-gifts" 
  },
  { 
    title: "Premium Photo Frames", 
    subtitle: "Preserve your most precious memories", 
    image: weddingBandsImg, 
    isNew: true, 
    path: "/collections/premium-photo-frames" 
  },
  { 
    title: "Traditional Indian Toys", 
    subtitle: "Generationally handcrafted wooden toys", 
    image: classicSolitaireImg, 
    isNew: true, 
    path: "/collections/traditional-indian-toys" 
  },
  { 
    title: "Festive Platters & Decor", 
    subtitle: "Auspicious accents for celebrations", 
    image: vintageBandsImg, 
    isNew: true, 
    path: "/collections/festive-platters" 
  },
];

const FEATURES = [
  { icon: Icon1, title: "Custom Gifting", desc: "Add handwritten wax-sealed notes and premium personalized engraving." },
  { icon: Icon2, title: "Flexible Exchanges", desc: "Effortless 30-day swap options for gift recipients for complete satisfaction." },
  { icon: Icon3, title: "Artisan Quality", desc: "Every hamper features certified gourmet treats and premium genuine products." },
  { icon: Icon4, title: "Fragile-Safe Shipping", desc: "Insured transit and careful climate-controlled handling straight to their door." },
];

const CURATED = [
  { title: "FOR HER", image: WomenImg, path: "/collections/for-her" },
  { title: "FOR HIM", image: MenImg, path: "/collections/for-him" },
  { title: "FESTIVE", image: KidImg, path: "/collections/festive" },
];

const TESTIMONIALS = [
  {
    quote: "The hand-painted Rajasthani wooden toy pair is absolutely breathtaking.",
    author: "Sarah J.",
    image: user1,
    link: "/collections/traditional-indian-gifts",
    buttonText: "Shop Indian Gifts"
  },
  {
    quote: "Our family loved the heavy brass peacock photo frame we gifted them.",
    author: "Arjun & Meera",
    image: user2,
    link: "/collections/premium-photo-frames",
    buttonText: "Shop Photo Frames"
  },
  {
    quote: "The organic lacquer Channapatna stacking rings are extremely safe and beautiful.",
    author: "Kavya Desai",
    image: user3,
    link: "/collections/traditional-indian-toys",
    buttonText: "Shop Indian Toys"
  },
  {
    quote: "The hand-carved Maharaja rosewood frame looks perfect in our living room.",
    author: "Rohan Kapoor",
    image: user4,
    link: "/collections/festive-platters",
    buttonText: "Shop Home Decor"
  }
];  

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-14">
    <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#08221B]">{title}</h2>
    <div className="mx-auto mt-4 mb-6 w-24 h-1 bg-[#CBA135]" />
    {subtitle && <p className="text-[#08221B] text-xl md:text-2xl font-light max-w-2xl mx-auto italic">{subtitle}</p>}
  </div>
);

export default function HomeMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { products, fetchProducts } = useContext(ProductContext);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const allVideos = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
    video9
  ];

  useEffect(() => { fetchProducts(1, ""); }, [fetchProducts]);

  const featuredProducts = products ? products.slice(0, 6) : [];

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      toast("Welcome to Balaji Gift Store", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: { backgroundColor: '#08221B', color: '#CBA135', fontFamily: 'Cormorant Garamond, serif' },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.welcomeMessage) {
      toast.success(`Welcome to Balaji Gift Store, ${location.state.userName || 'User'}!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: { backgroundColor: '#08221B', color: '#CBA135', fontFamily: 'Cormorant Garamond, serif' },
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const goToPrevious = () => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const currentTestimonialData = TESTIMONIALS[currentTestimonial];

  // Navigation helper for service cards
  const handleServiceNavigation = (title) => {
    const routes = {
      "Custom Gifting": "/services/lifetime-service",
      "Flexible Exchanges": "/services/easy-exchange",
      "Artisan Quality": "/services/authenticity",
      "Fragile-Safe Shipping": "/services/secure-delivery"
    };
    
    if (routes[title]) {
      navigate(routes[title]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-[#FFF8E8] overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${gCrown})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 backdrop-blur-[7.5px]" />
        <div className="noise-overlay" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="font-cormorant text-4xl md:text-7xl font-bold text-[#CBA135] leading-tight mb-6">
            Premium Gifts Curated <br className="hidden md:block" /> for Every Celebration
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-10 tracking-wide italic">
            “Traditional hand-painted Indian toys, premium brass photo frames, and heritage gifts”
          </p>
          <a href="/collections">
            <button className="px-16 py-4 bg-gradient-to-r from-[#B49148] via-[#F8E48F] to-[#BB9344] text-[#08221B] font-bold text-lg rounded-sm hover:scale-105 transition-transform shadow-2xl">
              SHOP NOW
            </button>
          </a>
        </div>
      </section>

      {/* EXPLORE COLLECTIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <SectionHeader title="Explore Our Collections" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COLLECTIONS.map((item, i) => (
            <div key={i} className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-lg" onClick={() => { item.path && navigate(item.path); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08221B]/90 via-[#08221B]/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-cormorant font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{item.subtitle}</p>
                <button type="button" className="flex items-center gap-2 text-[#CBA135] text-sm font-bold tracking-tighter group-hover:gap-4 transition-all uppercase">
                  Shop Now <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRID IMAGE / SLIDER */}
      <section className="w-full bg-[#FFF7E8] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Swiper
            spaceBetween={30}
            effect={"fade"}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            className="mySwiper rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden h-[300px] sm:h-[450px] lg:h-[560px]"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="relative">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 sm:p-16">
                  <h2 className="text-white font-serif text-2xl sm:text-4xl lg:text-5xl mb-2 tracking-widest uppercase">{slide.title}</h2>
                  <div className="h-[2px] w-24 bg-[#CBA135] mb-4"></div>
                  <p className="text-[#EFDFB7] font-sans text-sm sm:text-lg tracking-wide italic">{slide.subtitle}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== TRUST & FEATURES - CLICKABLE CARDS (UPDATED) ===== */}
      <section className="bg-[#0F2D2A] py-20 border-y-8 border-[#CBA135]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {FEATURES.map((f, i) => (
              <div 
                key={i} 
                className="bg-[#183B32] p-10 rounded-xl text-center flex flex-col items-center border border-white/5 hover:bg-[#1d463c] transition-all cursor-pointer group"
                onClick={() => handleServiceNavigation(f.title)}
              >
                <div className="w-16 h-16 mb-6 rounded-full bg-[#CBA135] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <img src={f.icon} alt={f.title} className="w-12 h-12 object-bottom-right" />
                </div>
                <h3 className="text-white font-cormorant text-xl mb-3 font-semibold">{f.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                
                {/* Click indicator */}
                <span className="text-[#CBA135] text-xs font-bold uppercase tracking-wider mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </span>
              </div>
            ))}
          </div>
          
          {/* Stats section - unchanged */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center pt-10 border-t border-white/10">
            {[
              ["25+", "Years in Business"],
              ["10K+", "Happy Customers"],
              ["50+", "Master Artisans"],
              ["100%", "Satisfaction"],
            ].map(([val, lab], i) => (
              <div key={i}>
                <p className="text-[#CBA135] text-3xl font-bold mb-1">{val}</p>
                <p className="text-gray-400 text-xs tracking-widest uppercase font-medium">{lab}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MASTERPIECES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader title="Featured Masterpieces" />
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => { navigate("/collections"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-12 py-4 bg-[#08221B] text-white font-bold tracking-widest rounded shadow-xl hover:bg-[#0F3A30] transition-colors">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </section>

      {/* CURATED FOR YOU */}
      <section className="py-0 px-6 max-w-7xl mx-auto">
        <SectionHeader title="Curated For You" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CURATED.map((cat, i) => (
            <div key={i} className="group relative h-[500px] overflow-hidden rounded-3xl cursor-pointer" onClick={() => { cat.path && navigate(cat.path); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <img src={cat.image} alt={cat.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-cormorant text-3xl font-bold tracking-[0.2em] text-[#F4C430] drop-shadow-lg">{cat.title}</span>
            </div>
          ))}
        </div>
      </section>

    {/* USER STORIES / TESTIMONIALS */}
<section className="bg-[#FFF8E8] py-24 overflow-hidden">
  <SectionHeader
    title="User Stories"
    subtitle="“Stories of joy, beautiful memories, and the warm smiles Balaji Gifts brings to every celebration.”"
  />

  <div
    className="relative mx-auto max-w-7xl h-[650px] flex items-center justify-center"
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
  >
    {(() => {
      const prevIdx = (currentTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
      const nextIdx = (currentTestimonial + 1) % TESTIMONIALS.length;
      const prevData = TESTIMONIALS[prevIdx];
      const nextData = TESTIMONIALS[nextIdx];

      return (
        <>
          {/* LEFT BACKGROUND CARD (Soft Colorful & Blurr) */}
          <div className="hidden md:flex absolute left-4 lg:left-24 w-[340px] h-[480px] bg-white/90 rounded-2xl border border-gray-100 shadow-xl -rotate-6 z-10 flex-col items-center justify-center p-8 transition-all duration-700 blur-[1.5px] opacity-60 scale-95 origin-right">
            <img 
              src={prevData.image} 
              className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-[#CBA135]/20 shadow-sm" 
              alt="prev" 
            />
            <p className="text-[#08221B]/50 text-xs italic line-clamp-2 px-4 italic font-serif">
              "{prevData.quote}"
            </p>
            <h4 className="mt-4 font-bold text-[#08221B]/60 font-cormorant text-md uppercase tracking-wider">
              — {prevData.author}
            </h4>
          </div>

          {/* MAIN ACTIVE CARD (Fully Vibrant & Focused) */}
          <div
            key={currentTestimonial}
            className="relative w-[90%] md:w-[460px] h-[620px] bg-white rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] z-30 border border-[#CBA135]/30 p-10 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in duration-500 scale-100"
          >
            <div className="relative mb-8 group">
              {/* Gold Glow behind image */}
              <div className="absolute inset-0 bg-[#CBA135] rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={currentTestimonialData.image}
                alt={currentTestimonialData.author}
                className="relative w-52 h-52 rounded-full object-cover border-[6px] border-[#CBA135] shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="text-[#CBA135] text-6xl mb-4 font-serif leading-none italic">“</div>

            <p className="text-[#08221B] text-xl font-medium italic mb-8 leading-relaxed max-w-[85%]">
              {currentTestimonialData.quote}
            </p>

            <h4 className="font-bold text-[#08221B] font-cormorant text-3xl tracking-tight mb-2">
              — {currentTestimonialData.author}
            </h4>

            <button
              onClick={() => {
                navigate(currentTestimonialData.link);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-8 px-10 py-4 rounded-full bg-[#08221B] text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#CBA135] hover:shadow-2xl transition-all duration-300"
            >
              {currentTestimonialData.buttonText}
            </button>
          </div>

          {/* RIGHT BACKGROUND CARD (Soft Colorful & Blurr) */}
          <div className="hidden md:flex absolute right-4 lg:right-24 w-[340px] h-[480px] bg-white/90 rounded-2xl border border-gray-100 shadow-xl rotate-6 z-10 flex-col items-center justify-center p-8 transition-all duration-700 blur-[1.5px] opacity-60 scale-95 origin-left">
            <img 
              src={nextData.image} 
              className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-[#CBA135]/20 shadow-sm" 
              alt="next" 
            />
            <p className="text-[#08221B]/50 text-xs italic line-clamp-2 px-4 italic font-serif">
              "{nextData.quote}"
            </p>
            <h4 className="mt-4 font-bold text-[#08221B]/60 font-cormorant text-md uppercase tracking-wider">
              — {nextData.author}
            </h4>
          </div>

          {/* Navigation Arrows */}
          <button onClick={goToPrevious} className="absolute left-6 md:left-14 z-50 w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-[#08221B] hover:text-white transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={goToNext} className="absolute right-6 md:right-14 z-50 w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-[#08221B] hover:text-white transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      );
    })()}
  </div>
</section>

      {/* CUSTOMER MOMENTS VIDEO SLIDER - REEL STYLE */}
      <section className="bg-[#FFF8E8] py-16">
        <SectionHeader
          title="Customer Moments"
          subtitle="Real stories and moments from our happy customers"
        />

        <div className="max-w-7xl mx-auto px-4">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            // Responsive breakpoints taaki mobile aur desktop dono par sahi dikhe
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 10 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 30 },
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[EffectCoverflow, Autoplay, Navigation]}
            className="w-full py-10"
          >
            {allVideos.map((video, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                {/* Reel Container */}
                <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-[#08221B]">
                  <video
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Overlay to make it look like a phone screen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA BANNER */}
<section className="py-24 px-4 flex justify-center">
  <div 
    className="relative max-w-7xl w-full h-[350px] rounded-2xl overflow-hidden flex items-center px-10 md:px-20" 
    style={{ background: "radial-gradient(146% 146% at 146% -25%, #4A9874 0%, #1C3A2C 100%)" }}
  >
    <div className="max-w-xl z-10">
      {/* Spelling 'Jewellery' update ki gayi hai */}
      <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-[#E6C36A] leading-tight mb-8">
        Elevate Your Gifting <br /> with Balaji Gift Store
      </h2>

      {/* onClick mein path '/collections' update kiya gaya hai */}
      <button 
        className="px-10 py-4 bg-gradient-to-r from-[#C9A14A] via-[#E6C36A] to-[#B8903D] text-[#08221B] font-bold text-xl rounded-lg hover:scale-105 transition-transform shadow-xl" 
        onClick={() => { 
          navigate("/collections"); 
          window.scrollTo(0, 0); 
        }}
      >
        Browse Our Collections
      </button>
    </div>

    <img 
      src={Necklace} 
      alt="Luxury" 
      className="absolute right-0 top-0 h-[110%] w-auto object-contain hidden lg:block opacity-90 translate-y-[-5%]" 
    />
  </div>
</section>
</main>
  );
}