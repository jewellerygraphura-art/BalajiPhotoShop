import axios from "axios";
import { useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Address = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/api/addresses", { withCredentials: true });
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFirstName("");
    setLastName("");
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setZip("");
    setPhone("");
    setEmail("");
  };

  const handleAddAddress = async (e) => {
    if(e) e.preventDefault();

    // Validation
    if (!/^\d{10}$/.test(phone)) return alert("Phone must be 10 digits");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Invalid email");

    try {
      setIsUpdating(true);
      const payload = { firstName, lastName, country, address, city, state, zip, phone, email };

      if (editingId) {
        await axios.put(`/api/addresses/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post("/api/addresses", payload, { withCredentials: true });
      }

      await fetchAddresses();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      closeModal();
    } catch (err) {
      alert("Error saving address. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/addresses/${id}`, { withCredentials: true });
      fetchAddresses();
    } catch {
      alert("Error deleting address");
    }
  };

  return (
    <div className="font-serif max-w-4xl mx-auto p-4">
      {/* Saved Addresses List */}
      <div className="p-6 space-y-4">
        {addresses.map((item) => (
          <div key={item._id} className="flex justify-between items-start py-5 border-b border-gray-100">
            <div className="space-y-1">
              <p className="font-bold text-[#1B3022] text-lg">{item.firstName} {item.lastName}</p>
              <p className="text-sm text-gray-500">{item.address}, {item.city}, {item.state}, {item.zip}</p>
              <p className="text-sm text-gray-500">{item.phone} | {item.email}</p>
            </div>
            <div className="flex gap-6 text-[13px] font-medium">
              <button
                onClick={() => {
                  setEditingId(item._id);
                  setFirstName(item.firstName || "");
                  setLastName(item.lastName || "");
                  setCountry(item.country || "");
                  setAddress(item.address || "");
                  setCity(item.city || "");
                  setState(item.state || "");
                  setZip(item.zip || "");
                  setPhone(item.phone || "");
                  setEmail(item.email || "");
                  setIsModalOpen(true);
                }}
                className="text-black hover:underline"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="text-[#FF5C5C] hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trigger Form (Add New) */}
      {!isModalOpen && (
        <div className="mt-10 p-6 border border-dashed border-gray-300 rounded-lg text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 mx-auto bg-[#1B3022] text-white py-3 px-8 text-xs font-bold uppercase tracking-widest"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#1B3022]/40 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#FDF9F0] p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={closeModal} className="absolute right-6 top-6 text-gray-400 hover:text-black">
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-normal text-[#1B3022]">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-[#CBA135] text-xs font-bold uppercase tracking-widest mt-1">Delivery Preferences</p>
              </div>

              <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs with || "" Guard to prevent white screen crashes */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">First Name*</label>
                  <input value={firstName || ""} onChange={(e) => setFirstName(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Last Name*</label>
                  <input value={lastName || ""} onChange={(e) => setLastName(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="col-span-full flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Country*</label>
                  <input value={country || ""} onChange={(e) => setCountry(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="col-span-full flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Address*</label>
                  <textarea value={address || ""} onChange={(e) => setAddress(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">City*</label>
                  <input value={city || ""} onChange={(e) => setCity(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">State*</label>
                  <input value={state || ""} onChange={(e) => setState(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Zip Code*</label>
                  <input value={zip || ""} onChange={(e) => setZip(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Phone Number*</label>
                  <input value={phone || ""} onChange={(e) => setPhone(e.target.value)} maxLength={10} required
                    className={`p-3 border outline-none ${phone && !/^\d{10}$/.test(phone) ? 'border-red-500' : 'border-gray-200'}`} />
                </div>

                <div className="col-span-full flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700">Email Address*</label>
                  <input type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required
                    className="p-3 border border-gray-200 outline-none focus:border-[#CBA135]" />
                </div>

                <div className="col-span-full mt-4">
                  <button type="submit" disabled={isUpdating}
                    className="w-full bg-[#1B3022] text-white py-4 uppercase text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#253d2c] transition-all">
                    {isUpdating ? <Loader2 className="animate-spin" size={16} /> : (editingId ? "Update Address" : "Save Address")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Address;