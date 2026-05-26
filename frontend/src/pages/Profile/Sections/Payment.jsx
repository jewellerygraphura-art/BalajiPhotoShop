import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';

const Payment = () => {

  const { state } = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);

  const {
    selectedAddress,
    cartItems,
    subtotal,
    gst,
    shipping,
    total
  } = state || {};

  const methods = [
    { name: 'Razorpay', icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAA0lBMVEX///8zlf8HJlQAGU+Rmqykyvctkv7///0AI1Irkf4AG04kkP77/f4nk/4AFUz4+fswlvwAIFBerP3s9fzi7/wcjf7q8/xBnPylz/tLovwAIVHp7PEAAEMAJ1gAF05krvoADUp+i6PT6fyu0vnJ3/mRwve12ftRpPxZpvd4s/eXx/qFvfrE4PlAnfvK2/HV6/zc4elYaIegqLfJztdrd5IvRWx0svqutsQjOF0gOmY8TXAdL1ZPYH/FytR3hZ4AAEhEWoCJk6UVNmRlcpAAADwHhvyO2HAVAAAHSUlEQVR4nO2dfVfaShDGSdANIQlB3gRRQV6Ul1KpqCit1rb3fv+vdMPuEgKZCazn3AbOzu+PVhHOWefsPjvz7GTNZAiCIAiCIAjiqLFqaY/gmOkUKXyfxu0WG1bagzhWrF6JsT6F71NY5b5hG8VO2uM4Um7PHcMwJuW0x3GUlPssCJ5hP9PaVcf9creceobh3KY9lCPEb1X53DOMYiXtsRwd1m1DTL2ABkmfIpWWw1bRYy2SPiX8rhcGj6RPlftJJHgkfWqUu8WN6LGBn/aQjgerd1c1NmBDkr59cUce24ye4ZymPaijoTdxjG0ckr79KI/jwaO1uydWB5h6weSrpz2wo6A89oDgGYZ3n/bIjoF6wwajZ5xTxbaTzsDe3nAlZFbtxO3FspW19HXTHt2BY1VKVSx4gfRR2pJIuX+OqJ6QPjftAR40lRKUrYSwAUkfjt/HVY9TJelDsb6AiXKUIqUtGOXhruAFFVvagzxUrF4xacsQUMUGY1WGcI22tXa/pj3Qg8Sq7zH1luGjziqA2jh5v11h0xlbHLebmChHw0fSF6O2fZiRAJlVW1jdnbneGjKrNrEqrf2nHrUXbFEeGXuqHsejii3Kl323DAk1lUYox49wd0BNpWt6jf23DAErkfRJakMHnXoM+QkVvCs6+NRjbFiC40edVRILah8QVAc96xkMH2ulPexDwUfml8GqIz9TK9LaTeQeDpBRbSyrsi4cW6+X9rAPhRHo7dlOfbm1Wn04GyTpk1igNeqUhCHgwmdtNvn0En8QX552sS9/WoZXNiPpk1TOY7ExWmFB1oV3ZY8qNklM3OxGLywo3BYifeTTC9zG1tq1nyOhqcBr125RP72gtxkgu9iN1rJf4RM3yvpW9KLiZnvDDR/FqsPSR0bzimFE3JzBdjbXgis26opcMYlMvfF6Uk35v/FdWYR5ROETdEJxcwbrDXf67YH/34Olj9FjgJJTuTqZMwpbHf2bq/Zs+YU1gqWP0pYV0qxipbUF0HwsnD01l19Zz2DW55VSG+6BYfG0xT6vh+vWPzHzZv6df11DpI/SFsl9lW+klTB6s0U7Z5qFOf8Gq9ios0oytg1WXG8Z/rfChRlwxjdeF/PpSfoE/sR2Suvqf/aSXQbPzL1y6UPWrkFnbJJKdRLZMt4v+dQzzewNf6EDpy02PcIr6UYm0kNOTL2AK562ZOqIT09mlaQS5nrNm2xuFb2LBfdTkDM2kr4Y/vx7wQzJP/IXkYqN2gu2mf0o5NbRM69P+Ks9xOujzqoN3JvrvBml8MZfP0WMZjKrokz/FDaCZ+aE9GVa4MZLazeK//5zc+qZYcWGrF26anPNtH1tbtMWFRtiVlFTaYj/3s7Fomf+FFnfKWJWUdYnmT8V4sEzc09C+qizKpHme/YMiN5K+nxE+sin58yfslDwAukTPj1mVpFPHzB9zINTbyl93Kyy4DM26qwK8B8utrOVtfRdcelDWoNsyvoyzcUlFrxQ+u7JrIJxT9ro1Au4FGkLIn2G7m7L/KOdELxA+sTb4DM2R/fWoJM2tmUIzj7425CKjY21lr75ImndLskKswrprGI6S1/zsXCxI3pmm5tVWGeVxmmLP3+BarRNci/8vUh7AWtpe2dV87G9c+oFacs3/masvUBXs8qav+6eegHXyRWbpmbVbLHP1DNXPr0LG826St/bZXK2EpL7zdsLyg1439Wys2r6kVCjbSKPKDtw1lfV0G3xb2BbD+RCVGy3dMYmmT/tSpSja1d0RWKdVXe67bv+r92JcoSzH/xTmPQ9p/zb/G3eMEcZQZpViPRpd8vwu1r0zLxoL+gijxJp5rb4v4FjyARyL6IhfAhXbLpdkztLdvbik+8P/xhSsbFxyr/O32a+V522JvuLf+wrLH2ebv30jwo5y5J2cj+9ZhWb+1sterkFl74MfO0r0y3re/uc9CFNpbZuPv1cMXwF4dN34YqNaZf1qUqfyPoGYPS066zynxSzPvEsjIWcsemW9SlLnzCrakjJodvavVGs2GR7wS1yxqbZLcPNK7W1a2bFszDI7QV3mhW8U8WS40ycsSFdkYZulz+opi3SrKrAa1e7O6uU05bEiu1cs4qt+aqYtuTlY4CwWVXSTPpUzSrZWVVG/syJbn8I9eFzZlUXvrTeG6X86/xtPmdWWUNqCF/i/lA5YQv4h4sbckSpXWeVsk8vO6uQMzbd2gv+KK7da+G2YBWbZmtX1W0xr+SlS7D0TTRLW5ovqmYVT0x82OvTTvqUzSohfchNpdqZVaoVW5akL4KvWrF9F9I3ho85GppJ31Rt7pkXCy5uSGeVp51ZFb+gIBF5RIn86QTtrutTlb68MKsQ6ftXs31XWfpeE6XvTrPwzVTXrrhvDums8nQzq1SlTxrNdeQxQN3MKtUjyitxe8EQjJ5R1Szrc18LWRUKQvr8AfMAbN3aC5q/TtQQa9evn4Jo1ttCEARBEARBEARBEARBEARBEATxP/Afo9mQstG5kpkAAAAASUVORK5CYII=", link: 'bessie.c@gmail.com' },
    { name: 'Paypal', icon: 'https://cdn-icons-png.flaticon.com/128/174/174861.png', link: 'bessie.c@gmail.com' },
    { name: 'Visa', icon: 'https://cdn-icons-png.flaticon.com/128/16144/16144944.png', delete: true, link: '**** 4331' },
    { name: 'Google Pay', icon: 'https://cdn-icons-png.flaticon.com/128/6124/6124998.png', link: 'Not Linked' }
  ];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!selectedAddress) {
  //     alert("Please select delivery address first");
  //     return;
  //   }

  //   try {
  //     setIsProcessing(true);

  //     const { data } = await axios.post(
  //       "/api/payment/create-order",
  //       { amount: total },        // request body
  //       { withCredentials: true } // config
  //     );


  //     const options = {
  //       key: "rzp_test_S2ZQ4KbV345VDy", // इथे तुझा Razorpay Key टाक
  //       amount: data.amount,
  //       currency: "INR",
  //       name: "Balaji Gift Shop",
  //       description: "Order Payment",
  //       order_id: data.id,

  //       handler: async function (response) {
  //         const formattedAddress = {
  //           fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
  //           mobile: selectedAddress.phone,
  //           addressLine: selectedAddress.address,
  //           city: selectedAddress.city,
  //           state: selectedAddress.state,
  //           pincode: selectedAddress.zip
  //         };



  //         await axios.post("/api/payment/verify", {
  //           razorpay_order_id: response.razorpay_order_id,
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_signature: response.razorpay_signature,

  //           cartItems: cartItems.map(item => ({
  //             productId: item.product._id,
  //             name: item.product.name,
  //             price: item.product.price?.sale,
  //             quantity: item.quantity,
  //             productImage: item.product.productImage?.[0],
  //             carat: item.purity
  //           })),

  //           totalAmount: total,
  //           subtotal: subtotal,
  //           gst: gst,
  //           shipping: shipping,
  //           address: formattedAddress,
  //         }, {
  //           withCredentials: true
  //         });

  //         clearCart();
  //         navigate("/order-success");
  //       },

  //       prefill: {
  //         name: selectedAddress.firstName,
  //         // email: formData.email,
  //         contact: selectedAddress.phone
  //       },
  //       theme: {
  //         color: "#1C3A2C"
  //       }
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();

  //     setIsProcessing(false);
  //   } catch (error) {
  //     console.log(error);
  //     alert("Payment Failed");
  //     setIsProcessing(false);
  //   }
  // };

  // const methodsApi = [
  //   { name: "Razorpay", api: handleSubmit }
  // ]

  return (
    <div className="font-serif max-w-4xl animate-fadeIn px-1 pb-10">

      {/* Visual Header for Mobile */}
      <h3 className="text-[11px] font-bold text-[#1B3022] uppercase tracking-[2px] mb-5 opacity-70">Saved Methods</h3>

      {/* Methods Card List */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {methods.map((m, index) => (
          <div key={m.name}  className="group relative bg-white border border-gray-100 p-4 flex justify-between items-center rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                <img src={m.icon} alt={m.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-[#1B3022] text-sm sm:text-base">{m.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-sans">{m.link}</p>
              </div>
            </div>
            <button className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${m.delete
              ? 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white'
              : 'text-[#1B3022] bg-[#FBF6EA] hover:bg-[#1B3022] hover:text-white'
              }`}>
              {m.delete ? 'Remove' : 'Link'}
            </button>
          </div>
        ))}
      </div>

      {/* Modern Add Card Form */}
      <div className="bg-[#1B3022] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Background Decorative Circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 bg-[#B38B59] rounded-full flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="text-lg sm:text-xl font-medium tracking-wide">Add New Card</span>
          </div>

          <div className="space-y-6">
            {/* Holder Name */}
            <div className="group">
              <label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Card Holder Name</label>
              <input
                type="text"
                placeholder="Bessie Cooper"
                className="w-full bg-white/10 border-b border-white/20 p-3 outline-none focus:border-[#B38B59] transition-all text-sm placeholder:text-white/20 italic"
              />
            </div>

            {/* Card Number */}
            <div className="group">
              <label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Card Number</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full bg-white/10 border-b border-white/20 p-3 outline-none focus:border-[#B38B59] transition-all text-sm tracking-[4px]"
              />
            </div>

            {/* Row for Expiry & CVV */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Expiry</label>
                <input placeholder="MM/YY" className="w-full bg-white/10 border-b border-white/20 p-3 outline-none focus:border-[#B38B59] text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">CVV</label>
                <input placeholder="***" className="w-full bg-white/10 border-b border-white/20 p-3 outline-none focus:border-[#B38B59] text-sm" />
              </div>
            </div>

            {/* Save Card Toggle-style */}
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="save" className="w-4 h-4 accent-[#B38B59] cursor-pointer" />
              <label htmlFor="save" className="text-[11px] text-white/60 cursor-pointer italic">Securely save for future checkout</label>
            </div>

            {/* Luxury Button */}
            <button className="w-full bg-[#B38B59] hover:bg-[#96754a] text-[#1B3022] py-4 rounded-xl text-xs font-black uppercase tracking-[3px] transition-all active:scale-95 shadow-lg mt-4">
              Confirm & Save Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;