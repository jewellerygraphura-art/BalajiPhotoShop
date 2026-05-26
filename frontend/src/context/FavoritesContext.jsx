import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosPostService, axiosPutService, axiosGetService } from "../services/axios";
import { useToast } from "./ToastContext";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { showToast } = useToast();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("balaji-gift-favorites");
    if (!saved) return [];
    const ids = JSON.parse(saved);
    return ids.map(id => ({ _id: id }));
  });

  useEffect(() => {
    localStorage.setItem(
      "balaji-gift-favorites",
      JSON.stringify(favorites.map(f => f._id))
    );

  }, [favorites]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const isUnauthorizedError = (apiResponse) => {
    const statusCode = apiResponse?.data?.statusCode;
    const message = String(apiResponse?.data?.message || "").toLowerCase();
    return statusCode === 401 || message.includes("login") || message.includes("session expired");
  };

  const buildFavoriteFromProduct = (product, purity) => {
    const normalizedPurity = purity ? String(purity) : "";
    const variant = product?.variants?.find(
      (v) => String(v.purity) === normalizedPurity
    );

    return {
      _id: product?._id,
      slug: product?.slug,
      name: product?.name,
      category: product?.category,
      productImage: product?.productImage,
      stockStatus: product?.stockStatus,
      rating: product?.rating,
      price: {
        mrp: variant?.price ?? product?.price?.mrp ?? 0,
        sale: variant?.sale ?? product?.price?.sale ?? 0,
        currency: product?.price?.currency || "INR"
      },
      availableStock: variant?.quantity ?? 0,
      quantity: 1,
      purity: normalizedPurity,
    };
  };

  const normalizeWishlistItem = (item) => {
    const product = item?.product || item?.productId;

    if (!product?._id) {
      return null;
    }

    const variant = product?.variants?.find(
      (v) => String(v.purity) === String(item?.purity)
    );

    return {
      _id: product?._id,
      slug: product?.slug,
      name: product?.name,
      category: product?.category,
      productImage: product?.productImage,
      stockStatus: product?.stockStatus,
      rating: product?.rating,
      price: {
        mrp: variant?.price ?? product?.price?.mrp ?? product?.price?.sale ?? 0,
        sale: variant?.sale ?? product?.price?.sale ?? product?.price?.mrp ?? 0,
        currency: product?.price?.currency || "INR"
      },
      availableStock: variant?.quantity || 0,
      quantity: item?.quantity || 1,
      purity: item?.purity || "",
    };
  };

const fetchWishlist = async () => {
  try {
    const apiResponse = await axiosGetService(
      "/customer/wishlist/all"
    );

    if (!apiResponse.ok) {
      if (isUnauthorizedError(apiResponse)) {
        return;
      }
      showToast(apiResponse?.data?.message || "Failed to load wishlist", "error");
      return;
    }

    const list = apiResponse?.data?.data?.wishlist || [];

    const formatted = list
      .map(normalizeWishlistItem)
      .filter(Boolean);

    setFavorites(formatted);

  } catch (err) {
    console.log("Wishlist load error:", err);
  }
};

const toggleFavorite = async (product, productPurity) => {

  const productId = String(product._id || product.id);
  const purity = String(productPurity || "");

  if (!productId) {
    return { ok: false };
  }

  const exists = favorites.some(
    item =>
      String(item._id) === productId &&
      String(item.purity) === purity
  );

  if (!exists) {
    const optimisticItem = buildFavoriteFromProduct(
      { ...product, _id: productId },
      purity
    );

    setFavorites(prev => [
      ...prev,
      optimisticItem
    ]);

    const apiResponse = await axiosPostService(
      "/customer/wishlist/add",
      { productId, purity }
    );

    if (!apiResponse?.ok) {
      setFavorites(prev =>
        prev.filter(
          item =>
            !(String(item._id) === productId &&
              String(item.purity) === purity)
        )
      );

      if (isUnauthorizedError(apiResponse)) {
        showToast("You have to log in first", "error");
        return { ok: false };
      }

      showToast(apiResponse?.data?.message || "Failed to add wishlist item", "error");
      return { ok: false };
    }

    await fetchWishlist();
    return { ok: true, action: "added" };

  } else {

    const previous = favorites;

    setFavorites(prev =>
      prev.filter(
        item =>
          !(String(item._id) === productId &&
            String(item.purity) === purity)
      )
    );

    const apiResponse = await axiosPutService(
      "/customer/wishlist/remove",
      { productId, purity }
    );

    if (!apiResponse?.ok) {
      setFavorites(previous);

      if (isUnauthorizedError(apiResponse)) {
        showToast("You have to log in first", "error");
        return { ok: false };
      }

      showToast(apiResponse?.data?.message || "Failed to remove wishlist item", "error");
      return { ok: false };
    }

    await fetchWishlist();
    return { ok: true, action: "removed" };
  }
};

  const removeFromFavorites = async (productId, purity = "") => {
    const id = String(productId);
    const normalizedPurity = String(purity || "");
    const previous = favorites;

    setFavorites(prev => prev.filter(item => {
      if (String(item._id) !== id) return true;
      if (!normalizedPurity) return false;
      return String(item.purity) !== normalizedPurity;
    }));

    const apiResponse = await axiosPutService("/customer/wishlist/remove", {
      productId: id,
      purity: normalizedPurity,
    });

    if (!apiResponse.ok) {
      setFavorites(previous);
      showToast(apiResponse?.data?.message || "Failed to remove item", "error");
      return;
    }

    fetchWishlist();
  };

  const clearFavorites = async () => {
    const previous = favorites;
    setFavorites([]);

    const apiResponse = await axiosPutService("/customer/wishlist/removeall");

    if (!apiResponse.ok) {
      setFavorites(previous);
      showToast(apiResponse?.data?.message || "Failed to clear wishlist", "error");
      return;
    }
  };

  const isFavorite = (productId, purity) => {
    const id = String(productId);
    if (purity === undefined) {
      return favorites.some(item => String(item._id) === id);
    }

    const normalizedPurity = String(purity);
    return favorites.some(
      (item) => String(item._id) === id && String(item.purity) === normalizedPurity
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        removeFromFavorites,
        fetchWishlist,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
