import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import leftJewelry from "../../assets/storePage/leftJewelry.png";
import rightJewelry from "../../assets/storePage/rightJewelry.png";
import storeImg from "../../assets/storePage/storeImg.jpg";
import { axiosGetService } from "../../services/axios";


export default function FindStore() {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await axiosGetService("/customer/store");

        if (!apiResponse.ok) {
          alert(apiResponse.data.message || "Not Store Found");
          return
        }
        else {
          setStores(apiResponse.data.data)
        }
      }
    )()
  }, [])


  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const trimmed = query.trim();
    const isPin = /^\d{6}$/.test(trimmed);
    const parts = trimmed.split(" ");

    let api = "";

    if (parts.length === 2 && /^\d{6}$/.test(parts[1])) {
      api = `/customer/store/city-pincode?city=${parts[0]}&pincode=${parts[1]}`;
    } else if (isPin) {
      api = `/customer/store/pincode?pincode=${trimmed}`;
    } else {
      api = `/customer/store/city?city=${trimmed}`;
    }

    const apiResponse = await axiosGetService(api);
    setStores(apiResponse.ok ? apiResponse.data.data : []);
  };

  const fetchSuggestions = async () => {
    if (query.length < 2) return setSuggestions([]);
    const res = await axiosGetService(`/customer/store/suggest?keyword=${query}`);
    if (res.ok) setSuggestions(res.data.data);
  };

  useEffect(() => {
    const t = setTimeout(fetchSuggestions, 350);
    return () => clearTimeout(t);
  }, [query]);


  return (
    <section
      className="bg-[#FBF6EA] font-cormorant overflow-x-hidden selection:bg-[#08221B] selection:text-[#E6C77B]"
      aria-label="Find Store Page"
    >
      {/* ===== HERO / SEARCH BANNER ===== */}
      <header className="relative overflow-hidden bg-[radial-gradient(circle_at_center,#26483a_0%,#1C3A2C_100%)] py-20 lg:py-28">
        {/* Subtle vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"
        />

        {/* Decorative Jewelry */}
        <img
          src={leftJewelry}
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[320px] lg:h-[450px] opacity-90 object-contain"
        />
        <img
          src={rightJewelry}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[320px] lg:h-[450px] opacity-90 object-contain"
        />

        {/* Search Content */}
        <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
          <h1 className="text-[40px] md:text-[54px] text-[#CBA135] leading-tight mb-8 font-light">
            Find a <span className="italic">Balaji Gift</span> Shop
          </h1>

          <form className="space-y-4" role="search" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter city / pincode / locality"
                className="w-full bg-white px-6 py-4 text-center text-[17px] text-[#08221B]"
              />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border shadow z-20 text-left">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setQuery(s.city);
                        setSuggestions([]);
                      }}
                    >
                      {s.name} — {s.city} ({s.pincode})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="bg-gradient-to-r from-[#B49148] via-[#FFE577] to-[#BB9344] px-14 py-2.5 text-lg font-semibold text-[#08221B]">
              Check
            </button>
          </form>
        </div>
      </header>

      {/* ===== FOUND COUNT ===== */}
      <div className="py-16 flex justify-center">
        <div className="relative px-12 text-center">
          <span className="absolute left-0 top-1/2 h-[2px] w-8 bg-[#B1924E] -translate-y-1/2" />
          <h2 className="text-3xl md:text-[32px] text-[#08221B] font-medium">
            Found <span className="text-[#C9A24D]">{stores.length}</span> stores near you
          </h2>
          <span className="absolute right-0 top-1/2 h-[2px] w-8 bg-[#B1924E] -translate-y-1/2" />
        </div>
      </div>

      {/* ===== STORE LIST ===== */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((item, i) => (
            <article
              key={i}
              className="group bg-[#FBF6EA] border border-[#D6C8A5] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition hover:shadow-xl"
            >
              {/* Store Image */}
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={(item.seeDesignsImages.length === 0) ? storeImg : item.seeDesignsImages[0]}
                  alt="Balaji Gift Shop Interior"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="p-6 space-y-4 font-sans">
                <h3 className="text-xl font-semibold italic text-[#08221B] border-b border-gray-200 pb-2">
                  {item.name}
                </h3>

                <p className="text-[14px] text-[#5F5F5F] leading-relaxed">
                  {item.address}, {item.city}, {item.state} – {item.pincode}
                  {/* Shop No. LGF-058, Building No.1, Nirman Khand-I,
                  Gomti Nagar Scheme, Lucknow, Uttar Pradesh – 226010 */}
                </p>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#B1924E] uppercase tracking-wider">
                    Timings: {item.timings.open} – {item.timings.close}
                  </p>
                  <p className="text-sm font-medium text-[#08221B]">
                    📞 +91-{item.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  {/* <button className="flex-1 bg-[#1C4A3C] py-2.5 text-xs font-bold text-white uppercase transition hover:bg-[#08221B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08221B]">
                    See Designs
                  </button> */}

                  <button className="flex-1 border border-[#08221B] py-2.5 text-xs font-bold text-[#08221B] uppercase flex items-center justify-center gap-2 transition hover:bg-[#08221B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08221B]"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + (item.city || ""))}`)}>
                    <MapPin size={14} />
                    Navigate
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}