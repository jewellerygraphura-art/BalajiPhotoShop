import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";
import FeatureCard from "../../components/common/FeatureCard";
import { useToast } from "../../context/ToastContext";
import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, clearFavorites, fetchWishlist } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const itemRefs = useRef({});

  const hasValidRating = (rating) => {
    const avg = Number(rating?.avg ?? 0);
    const totalReviews = Number(rating?.totalReviews ?? 0);
    return avg > 0 && totalReviews > 0;
  };

  /* =======================
     HANDLERS
  ======================= */

  const handleAddToCart = (product) => {

    const element = itemRefs.current[product._id];
    if (element) {
      element.classList.add(
        "opacity-0",
        "translate-x-4",
        "transition-all",
        "duration-500"
      );
    }

    setTimeout(() => {

      addToCart(product, 1, product.purity);

      removeFromFavorites(product._id);

    }, 400);
  };

  const handleAddAllToCart = () => {
    if (favorites.length === 0) return;

    favorites.forEach((item) => {
      addToCart(item, 1, item.purity, { silent: true });
    });

    clearFavorites();

    showToast("All items moved to cart");
  };

  const handleClearWishlist = () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;
    clearFavorites();
    showToast("Wishlist cleared");
  };

  useEffect(() => {
    fetchWishlist();
  }, []);


  /* =======================
     EMPTY STATE (PROFESSIONAL VERSION)
  ======================= */

  if (favorites.length === 0) {
    return (
      <div className="bg-[#FFF9E9] min-h-[75vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">

          {/* Minimal Icon Representation */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-20 h-20 border border-[#1C3A2C]/20 rounded-full animate-ping [animation-duration:3s]" />
            <Heart className="w-10 h-10 text-[#1C3A2C] stroke-[1px] opacity-70" />
          </div>

          {/* Sophisticated Typography */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-cormorant font-light tracking-wide text-[#1C3A2C]">
              Your Favorite Collection
            </h1>
            <div className="h-[1px] w-10 bg-[#1C3A2C]/30 mx-auto" />
            <p className="text-[11px] text-gray-500 font-light tracking-[0.2em] uppercase leading-relaxed max-w-xs mx-auto">
              Your wishlist is currently empty. Begin adding pieces to your collection.
            </p>
          </div>

          {/* Action with refined border transition */}
          <div className="pt-6">
            <button
              onClick={() => navigate("/collections")}
              className="relative group px-10 py-4 border border-[#1C3A2C] text-[#1C3A2C] text-[10px] tracking-[0.4em] uppercase font-medium transition-all duration-700 hover:text-white overflow-hidden"
            >
              <span className="relative z-10">Discover Collections</span>
              <div className="absolute inset-0 bg-[#1C3A2C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            </button>
          </div>

          {/* Secondary Nav */}
          <div className="pt-12 flex justify-center gap-10 border-t border-[#1C3A2C]/5">
            <button onClick={() => navigate("/collections")} className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#1C3A2C] transition-colors">New Arrivals</button>
            <button onClick={() => navigate("/collections")} className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#1C3A2C] transition-colors">Best Sellers</button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     MAIN UI
  ======================= */

  return (
    <div className="bg-[#FFF9E9] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4 border-b border-[#1C3A2C]/10 pb-6">
          <h1 className="text-4xl font-cormorant font-bold text-[#1C3A2C]">
            Wishlist
          </h1>

          <div className="flex items-center gap-8">
            <button
              onClick={handleClearWishlist}
              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>

            <button
              onClick={handleAddAllToCart}
              className="px-8 py-3 bg-[#08221B] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-all"
            >
              Add All To Cart
            </button>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-[40px_1fr_140px_140px_160px] text-[11px] uppercase tracking-[0.1em] text-gray-400 font-medium mb-6 px-4">
          <span />
          <span>Product Details</span>
          <span>Price</span>
          <span>Stock Status</span>
          <span />
        </div>

        {/* ITEMS */}
        <div className="flex flex-col gap-1">
          {favorites.map((product) => (
            <div
              key={product._id}
              ref={(el) => (itemRefs.current[product._id] = el)}
              className="grid grid-cols-1 md:grid-cols-[40px_1fr_140px_140px_160px] items-center gap-4 p-4 bg-white/30 border border-transparent hover:border-[#1C3A2C]/10 hover:bg-white/60 transition-all duration-300 group"
            >
              {/* remove item */}
              <button
                onClick={() => removeFromFavorites(product._id)}
                className="hidden md:block text-gray-300 hover:text-red-500 transition-colors"
              >
                <span className="text-xl leading-none">×</span>
              </button>

              {/* Image + Name */}
              <div
                className="flex items-center gap-6 cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="w-20 h-24 overflow-hidden bg-gray-100">
                  <img
                    src={
                      (product.productImage && product.productImage.length > 0)
                        ? product.productImage[0]
                        : "/fallback.jpg" // or placeholder
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                </div>

                <div>
                  <p className="font-cormorant text-xl text-[#1C3A2C] font-semibold uppercase tracking-tight">
                    {product.name}
                  </p>

                  <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                    {product.category}
                  </p>

                  {/* optional rating */}
                  {hasValidRating(product.rating) && (
                    <p className="text-[10px] text-yellow-600">
                      ★ {product.rating.avg} ({product.rating.totalReviews})
                    </p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-[#1C3A2C] text-[12px] tracking-tighter">
                {product.price?.sale ? (
                  <>
                    <span className="font-semibold">
                      ₹{product.price.sale.toLocaleString()}
                    </span>
                    <span className="line-through text-gray-400 ml-2 text-[11px]">
                      ₹{product.price.mrp.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>₹{product.price?.mrp?.toLocaleString()}</span>
                )}
              </div>

              {/* Stock */}
              <span
                className={`text-[10px] uppercase tracking-widest font-semibold ${product.stockStatus === "In Stock"
                  ? "text-green-700"
                  : "text-red-700"
                  }`}
              >
                {product.stockStatus}
              </span>

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(product)}
                className="py-3 border border-[#08221B] text-[#08221B] text-[10px] tracking-[0.2em] uppercase hover:bg-[#08221B] hover:text-white transition-all duration-500"
              >
                Add To Cart
              </button>
            </div>
          ))}

        </div>

        {/* FEATURES */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#1C3A2C]/5 pt-16">
          <FeatureCard icon={shippingIcon} title="Complimentary Shipping" description="On all orders exceeding ₹ 2,000" />
          <FeatureCard icon={paymentIcon} title="Secure Checkout" description="Fully encrypted payment processing" />
          <FeatureCard icon={supportIcon} title="Personal Assistance" description="Dedicated support available 24/7" />
        </section>
      </div>
    </div>
  );
}