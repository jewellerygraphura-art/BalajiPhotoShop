import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

const ProductCard = ({ product, allproducts }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorited = isFavorite(product._id);

  // Price formatting logic
  const salePrice = product?.price?.sale ?? 0;
  const mrpPrice = product?.price?.mrp ?? 0;

  const material = product?.attributes?.material || "";
  const color = product?.attributes?.color || "";

  const image =
    product?.productImage?.length > 0
      ? product.productImage[0]
      : "/placeholder.jpg";

  const rating = product?.rating?.avg || 0;
  const totalReviews = product?.rating?.totalReviews || 0;

  const cartItem = useMemo(
    () => cartItems.find((item) => item._id === product._id),
    [cartItems, product._id]
  );

  const quantity = cartItem?.quantity || 0;

  // ===== ADD TO CART =====
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.attributes.purity[0]);
  };

  // ===== INCREASE/DECREASE QUANTITY =====
  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, quantity - 1);
    }
  };

  // ===== FAVORITE TOGGLE WITH FRESH LOGIN CHECK =====
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    const result = await toggleFavorite(product, product.attributes.purity[0]);

    if (!result?.ok) {
      return;
    }

    toast.success(
      result.action === "removed"
        ? `💔 ${product.name} removed from wishlist`
        : `❤️ ${product.name} added to wishlist`,
      {
        toastId: `wishlist-${result.action}-${product._id}`,
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        style: {
          backgroundColor: '#08221B',
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      }
    );
  };

  const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      onClick={() =>
        navigate(`/product/${product._id}`, { state: { product, allproducts } })
      }
      className="group relative cursor-pointer rounded-xl bg-[#fff9e9] shadow-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
      >
        <Heart
          size={16}
          className={favorited ? "fill-red-500 text-red-500" : "text-[#08221B]"}
        />
      </button>

      {/* Product Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {rating > 0 ? (
          <div className="text-[#CBA135] text-xs">
            ★ {rating.toFixed(1)}
            <span className="text-[#08221B] text-[11px] ml-1">({totalReviews})</span>
          </div>
        ) : (
          <div className="text-[11px] text-gray-500 italic">No Reviews</div>
        )}

        <h3 className="font-serif text-[15px] text-[#08221B] leading-snug line-clamp-1">
          {capitalizeWords(product.name)}
        </h3>

        <p className="text-[11px] text-[#37654B]">
          {material} · {color}
        </p>

        {/* Price Display */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-bold text-[#08221B]">
              {/* UI fix: avoid showing 0 briefly */}
              ₹{salePrice === 0 ? "..." : salePrice.toLocaleString()}
            </p>
            {mrpPrice > salePrice && salePrice !== 0 && (
              <p className="text-xs text-[#37654B] line-through">
                ₹{mrpPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Cart Controls */}
        <div onClick={(e) => e.stopPropagation()} className="pt-3">
          {quantity > 0 ? (
            <div className="flex items-center justify-between rounded-lg border border-[#08221B]/20 bg-[#FFF9E9]">
              <button
                onClick={handleDecrease}
                className="h-10 w-10 flex items-center justify-center hover:bg-[#08221B] hover:text-white transition rounded-l-lg"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="h-10 w-10 flex items-center justify-center hover:bg-[#08221B] hover:text-white transition rounded-r-lg"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full h-10 bg-[#08221B] text-white text-xs tracking-widest uppercase rounded-lg hover:bg-black transition active:scale-95"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;