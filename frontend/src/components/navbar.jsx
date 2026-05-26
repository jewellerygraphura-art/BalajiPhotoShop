import {
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  User,
  Menu,
  X,
  Package,
  Truck
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { axiosGetService } from "../services/axios";
import { Home, Layers, Gift, Sparkles, Store } from "lucide-react";

// ─── Debounce helper ────────────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── SearchBox (shared by desktop + mobile) ─────────────────────────────────
function SearchBox({ autoFocus = false, onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 250);

  // Fetch suggestions whenever debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;
    const fetchSuggestions = async () => {
      try {
        const res = await axiosGetService(
          `/common/suggestion?q=${encodeURIComponent(debouncedQuery.trim())}`
        );

        console.log(res)
        if (cancelled) return;
        // Accept array of strings OR array of objects with a `name` field
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        const names = raw
          .map((item) => (typeof item === "string" ? item : item?.name ?? ""))
          .filter(Boolean)
          .slice(0, 8);
        setSuggestions(names);
        setShowSuggestions(names.length > 0);
        setActiveSuggestion(-1);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    };

    fetchSuggestions();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const commit = (value) => {
    const q = (value ?? query).trim();
    if (!q) return;
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery("");
    onSearch(q);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === "Enter") commit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0) {
        commit(suggestions[activeSuggestion]);
      } else {
        commit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Highlight the matched portion of a suggestion
  const highlight = (text, q) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#CBA135] font-semibold">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center rounded-full bg-[#1A3528] border border-[#CBA135]/40 px-4 py-2 focus-within:border-[#CBA135] transition-colors duration-200"
    >
      <input
        autoFocus={autoFocus}
        type="search"
        name="global-product-search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        data-lpignore="true"
        data-form-type="other"
        inputMode="search"
        placeholder="Search Balaji Gift Store..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#CBA135]/50 placeholder:text-sm"
      />
      <Search
        size={17}
        className="text-[#CBA135] shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => commit()}
      />

      {/* ── Suggestions Dropdown ── */}
      {showSuggestions && (
        <ul className="absolute top-full left-0 mt-2 w-full rounded-xl bg-[#0F231C] border border-[#CBA135]/30 shadow-2xl overflow-hidden z-[9999]">
          {suggestions.map((name, i) => (
            <li
              key={i}
              onMouseDown={() => commit(name)}           // mousedown fires before blur
              onMouseEnter={() => setActiveSuggestion(i)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors
                ${i === activeSuggestion
                  ? "bg-[#1A3528] text-white"
                  : "text-[#CBA135]/90 hover:bg-[#1A3528] hover:text-white"
                }
                ${i !== suggestions.length - 1 ? "border-b border-[#CBA135]/10" : ""}
              `}
            >
              <Search size={13} className="shrink-0 opacity-50" />
              <span>{highlight(name, query)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) < 10) return;
      if (currentY > lastScrollY.current && currentY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  const handleSearch = useCallback((q) => {
    navigate(`/searchProduct?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
  }, [navigate]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-[#0F231C]
        transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-10">

          <div className="relative flex h-22 items-center justify-between">

            {/* MOBILE LEFT: Menu + Search toggle */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className="rounded-md p-2 text-white hover:bg-white/10"
              >
                <Menu size={26} />
              </button>
              <button
                aria-label="Search"
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                className="rounded-md p-2 text-[#CBA135] hover:bg-white/10"
              >
                <Search size={22} />
              </button>
            </div>

            {/* DESKTOP SEARCH — now uses SearchBox */}
            <div className="hidden lg:flex w-[320px] xl:w-105">
              <SearchBox onSearch={handleSearch} />
            </div>

            {/* LOGO */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-3/4">
              <img
                src={Logo}
                alt="Balaji Gift Store"
                className="h-16 md:h-18 lg:h-22 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            {/* ICONS */}
            <div className="flex items-center gap-2 lg:gap-3">
              <IconButton
                Icon={Heart}
                active={isActive("/favorites")}
                onClick={() => { navigate("/favorites"); window.scrollTo(0, 0); }}
                badge={favorites.length}
              />
              <IconButton
                Icon={ShoppingCart}
                active={isActive("/cart")}
                onClick={() => { navigate("/cart"); window.scrollTo(0, 0); }}
                badge={getCartCount()}
              />
                <div className="hidden lg:flex gap-3">
                  {/* Track Order with different icon and style */}
                  <button
                    onClick={() => { navigate("/track-order"); window.scrollTo(0, 0); }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer
                      ${isActive("/track-order")
                        ? "bg-[#CBA135] text-white"
      : "bg-[#1A3528] text-[#CBA135] border border-[#CBA135]/40 hover:border-[#CBA135]"
                      }`}
                  >
                  <Package size={18} />
                  {/* Optional badge if needed */}
                </button>
                <IconButton
                  Icon={User}
                  active={isActive("/profile")}
                  onClick={() => { navigate("/profile"); window.scrollTo(0, 0); }}
                />
              </div>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-3 px-1">
              <SearchBox autoFocus onSearch={handleSearch} />
            </div>
          )}

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center justify-between pb-4 text-base xl:text-lg">
            <div className="flex gap-30 xl:gap-40">
  <CustomNavLink label="Home" href="/" Icon={Home} />
   <CustomNavLink label="Collections" href="/collections" Icon={Layers} />
  <CustomNavLink label="Occasions" href="/occasions" Icon={Gift} />
 
</div>

<div className="flex gap-30 xl:gap-40">
  <CustomNavLink label="Coming Soon" href="/new-arrivals" Icon={Sparkles} />
<CustomNavLink label="About Us" href="/about" Icon={User} />
  <CustomNavLink label="Store" href="/store" Icon={Store} />
</div>
          </nav>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity
        ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[85%] max-w-[320px]
        bg-[#0F231C] text-white transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 h-22">
          <img src={Logo} alt="Logo" className="h-10" />
          <button onClick={() => setMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <nav className="px-6 pt-6 space-y-6 text-lg">
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Collections", href: "/collections" },
            { label: "Occasions", href: "/occasions" },
            { label: "Coming Soon", href: "/new-arrivals" },
            { label: "Store", href: "/store" },
            { label: "Track Order", href: "/track-order" },
          ].map((item) => (
            <RouterNavLink
              key={item.label}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block transition-colors ${isActive ? "text-white font-bold" : "text-[#CBA135] hover:text-white"}`
              }
            >
              {item.label}
            </RouterNavLink>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="flex justify-between">
            <MobileAction
              Icon={Heart}
              label="Wishlist"
              active={isActive("/favorites")}
              onClick={() => { setMenuOpen(false); navigate("/favorites"); }}
              badge={favorites.length}
            />
            <MobileAction
              Icon={ShoppingCart}
              label="Cart"
              active={isActive("/cart")}
              onClick={() => { setMenuOpen(false); navigate("/cart"); }}
              badge={getCartCount()}
            />
            <MobileAction
              Icon={User}
              label="Account"
              active={isActive("/profile")}
              onClick={() => { setMenuOpen(false); navigate("/profile"); }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IconButton({ Icon, onClick, badge = 0, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer
      ${active ? "bg-[#CBA135] text-white" : "bg-[#1A3528] text-[#CBA135] border border-[#CBA135]/40 hover:border-[#CBA135]"}`}
    >
      <Icon size={18} />
      {badge > 0 && (
        <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white
        ${active ? "bg-[#0F231C]" : "bg-[#CBA135]"}`}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

function MobileAction({ Icon, label, onClick, badge = 0, active = false }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1 text-sm">
      <div className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-colors
        ${active ? "bg-[#CBA135] text-white" : "bg-[#1A3528] text-[#CBA135]"}`}>
        <Icon size={20} />
        {badge > 0 && (
          <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white
          ${active ? "bg-[#0F231C]" : "bg-[#CBA135]"}`}>
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className={active ? "text-white font-bold" : "text-[#CBA135]"}>{label}</span>
    </button>
  );
}

function CustomNavLink({ label, href, Icon }) {
  return (
    <RouterNavLink
      to={href}
      className={({ isActive }) => `
        relative transition-all duration-300
        ${isActive ? "text-white font-medium" : "text-[#CBA135] hover:text-white"}
        after:absolute after:left-0 after:-bottom-1 after:h-0.5
        after:bg-[#CBA135] after:transition-all after:duration-300
        ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
      `}
    >
      {/* ✅ ONLY THIS ADDED */}
      {Icon && <Icon size={14} className="inline mr-1" />}
      {label}
    </RouterNavLink>
  );
}