import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { axiosPostService } from "../../services/axios";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, isApprovedB2B } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponError, setCouponError] = useState("");
  
  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { subtotal, shipping, discountAmount, total, itemsCount } = useMemo(() => {
    const original = getCartTotal();
    let discounted = original;
    appliedCoupons.forEach(c => {
      discounted = discounted - (discounted * (c.percent / 100));
    });
    const ship = discounted > 0 ? 12.00 : 0;
    return {
      subtotal: original,
      shipping: ship,
      discountAmount: original - discounted,
      total: discounted + ship,
      itemsCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    };
  }, [cartItems, appliedCoupons, getCartTotal]);

  // --- DELETE LOGIC ---
  const openDeleteModal = (id, purity) => {
    setItemToDelete({ id, purity });
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id, itemToDelete.purity);
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    if (appliedCoupons.find(c => c.code === code)) {
      setCouponError(`${code} already applied`);
      return;
    }
    try {
      const apiResponse = await axiosPostService("/customer/subscribe&coupon/useCoupon", { code });
      if (!apiResponse.ok) {
        setCouponError(apiResponse.data?.message || "Invalid Coupon");
        return;
      }
      setAppliedCoupons(prev => [...prev, { code, percent: apiResponse.data.data }]);
      setCouponInput("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Coupon Error");
    }
  };

  const handleConfirmOrder = () => {
    // Validate MOQ for wholesale order
    if (isApprovedB2B) {
      const invalidMoqItem = cartItems.find(item => item.product.b2bMoq && item.quantity < item.product.b2bMoq);
      if (invalidMoqItem) {
        alert(`Wholesale Order Error: The item "${invalidMoqItem.product.name}" requires a minimum order quantity of ${invalidMoqItem.product.b2bMoq} units.`);
        return;
      }
    }

    const invalidItem = cartItems.find(item => {
      const variant = item.product.variants.find(v => v.purity === item.purity);
      return item.quantity > (variant?.quantity || 0);
    });
    if (invalidItem) {
      alert(`Insufficient stock for Purity: ${invalidItem.purity}`);
      return;
    }
    const orderSnapshot = {
      items: cartItems.map(item => {
        let price = item.product.variants.find(v => v.purity === item.purity)?.sale || 0;
        if (isApprovedB2B && item.product.b2bPrice?.sale) {
          price = item.product.b2bPrice.sale;
        }
        return {
          productId: item.product._id,
          name: item.product.name,
          purity: item.purity,
          price,
          quantity: item.quantity,
          productImage: item.product.productImage?.[0],
          category: item.product.category
        };
      }),
      subtotal, shipping, discountAmount, total
    };
    navigate("/checkout", { state: { order: orderSnapshot } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7ED] min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag size={80} strokeWidth={1} className="text-[#1C3A2C] mx-auto mb-8" />
          <h2 className="text-4xl font-serif text-[#1C3A2C] mb-4">Your Treasury is Empty</h2>
          <button 
            onClick={() => navigate("/collections")} 
            className="bg-[#1C3A2C] text-white px-12 py-4 uppercase text-sm cursor-pointer hover:bg-[#2a5341] transition-colors shadow-lg"
          >
            Browse Collections
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FAF7ED] min-h-screen font-serif relative">
      
      {/* --- CONFIRM DELETE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 max-w-sm w-full shadow-2xl border border-[#E5DDCC] text-center rounded-sm"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl text-[#1C3A2C] mb-2 font-medium">Remove Item?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Are you sure you want to remove this piece from your collection? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-[#E5DDCC] text-[#1C3A2C] text-xs uppercase tracking-widest cursor-pointer hover:bg-gray-50 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white text-xs uppercase tracking-widest cursor-pointer hover:bg-red-700 transition-colors font-bold shadow-md"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="text-[13px] text-gray-400 mb-12">
          <Link to="/" className="hover:underline">Home</Link> / <span className="text-gray-600">Cart</span>
        </nav>

        <h1 className="text-center text-3xl md:text-4xl text-[#1C3A2C] font-medium mb-16 tracking-tight uppercase">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {isApprovedB2B && (
              <div className="mb-6 p-4 bg-[#F5EFE0] border-l-2 border-[#CBA135] text-[#1C3A2C] text-[11px] sm:text-xs uppercase tracking-widest font-bold flex items-center justify-between shadow-sm">
                <span>✨ Approved Wholesale Account — Wholesale prices and MOQs are active.</span>
              </div>
            )}
            <div className="border border-[#E5DDCC] p-4 md:p-8 bg-transparent shadow-sm">
              <div className="hidden md:grid grid-cols-12 text-[#1C3A2C] mb-6 border-b border-[#E5DDCC] pb-4 font-medium uppercase text-xs tracking-widest">
                <div className="col-span-6">Products</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const variant = item.product.variants.find(v => v.purity === item.purity);
                  let price = Number(variant?.sale || variant?.price || 0);
                  if (isApprovedB2B && item.product.b2bPrice?.sale) {
                    price = Number(item.product.b2bPrice.sale);
                  }
                  const maxStock = variant?.quantity || 0;
                  const minQty = (isApprovedB2B && item.product.b2bMoq) ? item.product.b2bMoq : 1;

                  return (
                    <motion.div
                      key={item.product._id + item.purity}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b border-[#FAF7ED] pb-6 last:border-0 pt-6 first:pt-0"
                    >
                      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                        <button 
                          onClick={() => openDeleteModal(item.product._id, item.purity)}
                          className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <X size={20} />
                        </button>
                        <img src={item.product.productImage?.[0]} className="w-20 h-24 object-cover border border-[#E5DDCC]" alt={item.product.name} />
                        <div>
                          <h3 className="text-md font-semibold text-[#1C3A2C]">{item.product.name}</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.product.category}</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            <p className="text-[10px] text-[#1C3A2C] font-bold uppercase tracking-tighter bg-[#E5DDCC]/30 px-2 py-0.5 inline-block">
                              Purity: {item.purity}
                            </p>
                            {isApprovedB2B && item.product.b2bMoq > 1 && (
                              <p className="text-[9px] text-white bg-[#CBA135] font-bold uppercase tracking-wider px-2 py-0.5 inline-block shadow-sm">
                                Min Qty: {item.product.b2bMoq}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 text-center text-[#1C3A2C]">
                        ₹{price.toLocaleString()}
                        {isApprovedB2B && item.product.b2bPrice?.sale && (
                          <span className="block text-[9px] text-[#CBA135] uppercase font-bold tracking-widest mt-0.5">Wholesale</span>
                        )}
                      </div>

                      <div className="col-span-4 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-[#E5DDCC] bg-white px-2 py-1">
                          <button
                            onClick={() => {
                              if (item.quantity > minQty) {
                                updateQuantity(item.product._id, item.purity, item.quantity - 1);
                              } else {
                                openDeleteModal(item.product._id, item.purity);
                              }
                            }}
                            className="p-1 cursor-pointer hover:text-red-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 text-sm font-sans font-medium">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.quantity < maxStock) {
                                updateQuantity(item.product._id, item.purity, item.quantity + 1);
                              } else {
                                alert(`Only ${maxStock} pieces available`);
                              }
                            }}
                            className="p-1 cursor-pointer hover:text-[#1C3A2C] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 text-right font-bold text-[#1C3A2C]">
                        ₹{(price * item.quantity).toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="mt-12 flex flex-wrap justify-between items-start gap-6">
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <div className="flex gap-2">
                  <input
                    type="text" value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="ENTER COUPON CODE"
                    className="bg-white border border-[#E5DDCC] px-4 py-3 md:w-64 outline-none focus:border-[#1C3A2C] text-xs tracking-widest"
                  />
                  <button onClick={handleApplyCoupon} className="bg-[#1C3A2C] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold cursor-pointer hover:bg-[#2a5341] transition-all shadow-md">
                    Apply
                  </button>
                </div>
                {couponError && <span className="text-red-600 text-[10px] italic mt-1">{couponError}</span>}
              </div>
              <button onClick={clearCart} className="text-[#1C3A2C] underline text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:text-red-700 transition-colors font-bold">
                Empty Bag
              </button>
            </div>
          </div>

          <aside className="w-full lg:w-80">
            <div className="border border-[#E5DDCC] p-8 bg-white sticky top-10 shadow-sm">
              <h2 className="text-xl mb-8 border-b border-[#E5DDCC] pb-4 font-medium text-[#1C3A2C] uppercase tracking-tighter">Order Review</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500 uppercase text-[11px] tracking-wider"><span>Items</span><span>{itemsCount}</span></div>
                <div className="flex justify-between text-gray-500 uppercase text-[11px] tracking-wider"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500 uppercase text-[11px] tracking-wider"><span>Shipping</span><span>{shipping > 0 ? `₹${shipping.toLocaleString()}` : "Complimentary"}</span></div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-bold uppercase text-[11px] tracking-wider">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-[#E5DDCC] pt-6 text-xl text-[#1C3A2C] font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleConfirmOrder}
                className="w-full bg-[#1C3A2C] text-white py-5 mt-10 text-xs font-bold uppercase tracking-[0.2em] shadow-xl cursor-pointer hover:bg-[#2a5341] transition-all"
              >
                Confirm Order
              </motion.button>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}