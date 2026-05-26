import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosGetService, axiosPutService, axiosPostService } from "../services/axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isApprovedB2B, setIsApprovedB2B] = useState(false);

  useEffect(() => {
    fetchCart();
    checkB2BStatus();
  }, []);

  const checkB2BStatus = async () => {
    try {
      const res = await axiosGetService("/customer/auth/myProfile");
      if (res.ok && res.data?.data) {
        const user = res.data.data;
        if (user.userType === "B2B" && user.businessDetails?.isApproved) {
          setIsApprovedB2B(true);
        } else {
          setIsApprovedB2B(false);
        }
      }
    } catch (err) {
      setIsApprovedB2B(false);
    }
  };

  const fetchCart = async () => {
    try {
      const apiResponse = await axiosGetService("/customer/cart/all");
      if (!apiResponse.ok) {
        console.log(apiResponse.data.message || "Please Login");
        return;
      } else {
        setCartItems(apiResponse.data?.data?.cart || []);
      }
    } catch (error) {
      console.error("Cart fetch failed:", error);
    }
  };

  // ===== ADD TO CART WITH NOTIFICATION =====
  const addToCart = async (product, quantity = 1, purity = null, options = {}) => {
    const { silent = false } = options;
    try {
      const apiResponse = await axiosPostService("/customer/cart/add", {
        productId: product._id,
        quantity,
        purity
      });

      if (!apiResponse.ok) {
        toast.error(apiResponse.data.message || "Please Login", {
          toastId: `cart-error-${product?._id || "unknown"}`,
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: { 
            backgroundColor: '#08221B', 
            color: '#CBA135',
            fontFamily: 'Cormorant Garamond, serif',
            borderRadius: '10px'
          },
          progressStyle: { backgroundColor: '#CBA135' }
        });
        return;
      } else {
        await fetchCart();

        if (!silent) {
          toast.success(`✨ ${product.name} added to cart!`, {
            toastId: `cart-add-${product._id}`,
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            icon: "🛒",
            style: {
              backgroundColor: '#08221B',
              color: '#CBA135',
              fontFamily: 'Cormorant Garamond, serif',
              borderRadius: '10px'
            },
            progressStyle: { backgroundColor: '#CBA135' }
          });
        }
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add item to cart", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { 
          backgroundColor: '#08221B', 
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      });
    }
  };

  // ===== REMOVE FROM CART WITH NOTIFICATION =====
  const removeFromCart = async (productId, purity) => {
    try {
      // Find item for notification
      const item = cartItems.find(item => item.product._id === productId && item.purity === purity);
      
      await axiosPutService("/customer/cart/remove", { productId, purity });
      await fetchCart();
      
      if (item) {
        toast.warn(`🗑️ ${item.product.name} removed from cart`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          icon: "🗑️",
          style: { 
            backgroundColor: '#08221B', 
            color: '#CBA135',
            fontFamily: 'Cormorant Garamond, serif',
            borderRadius: '10px'
          },
          progressStyle: { backgroundColor: '#CBA135' }
        });
      }
    } catch (error) {
      console.error("Remove failed:", error);
      toast.error("Failed to remove item", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { 
          backgroundColor: '#08221B', 
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      });
    }
  };

  // ===== UPDATE QUANTITY WITH NOTIFICATION =====
  const updateQuantity = async (productId, purity, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId, purity);
    }
    
    try {
      const item = cartItems.find(item => item.product._id === productId && item.purity === purity);
      const oldQuantity = item?.quantity || 0;
      
      await axiosPutService("/customer/cart/updateQuantity", {
        productId,
        purity,
        quantity,
      });
      await fetchCart();
      
      // Show notification only if quantity actually changed
      if (oldQuantity !== quantity) {
        toast.info(`📦 ${item?.product.name} quantity updated`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          icon: "📦",
          style: { 
            backgroundColor: '#08221B', 
            color: '#CBA135',
            fontFamily: 'Cormorant Garamond, serif',
            borderRadius: '10px'
          },
          progressStyle: { backgroundColor: '#CBA135' }
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update quantity", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { 
          backgroundColor: '#08221B', 
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      });
    }
  };

  // ===== CLEAR CART WITH NOTIFICATION =====
  const clearCart = async () => {
    try {
      await axiosPutService("/customer/cart/clear");
      setCartItems([]);
      
      toast.info("🛒 Cart cleared", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        icon: "🧹",
        style: { 
          backgroundColor: '#08221B', 
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      });
    } catch (error) {
      console.error("Clear failed:", error);
      toast.error("Failed to clear cart", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { 
          backgroundColor: '#08221B', 
          color: '#CBA135',
          fontFamily: 'Cormorant Garamond, serif',
          borderRadius: '10px'
        },
        progressStyle: { backgroundColor: '#CBA135' }
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.product;
      const variant = product?.variants?.find(v => v.purity === item.purity);
      let price = Number(variant?.sale || product?.price?.sale || 0);

      // Apply B2B pricing if wholesale partner is approved
      if (isApprovedB2B && product?.b2bPrice?.sale) {
        price = Number(product.b2bPrice.sale);
      }

      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isApprovedB2B,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};