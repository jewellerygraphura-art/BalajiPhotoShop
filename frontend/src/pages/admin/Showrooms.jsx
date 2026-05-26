import React, { useState, useEffect } from "react";
import {
  Plus, Edit3, Trash2, Home, MapPin, Clock, Phone, Image as ImageIcon, X, Map as MapIcon, Save, Globe
} from "lucide-react";
import Toast from "../../components/admin/Toast.jsx";
import { axiosGetService, axiosPostService, axiosDeleteService } from "../../services/axios.js";

const Showrooms = () => {
  const [showrooms, setShowrooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });

  /** Normalize Store Data */
  const normalize = (s) => ({
    ...s,
    seeDesignsImages: Array.isArray(s?.seeDesignsImages)
      ? s.seeDesignsImages
      : [],

    timings: s?.timings && typeof s.timings === "object" && s.timings.open && s.timings.close
      ? s.timings
      : { open: "", close: "" }
  });


  /** Fetch Showrooms */
  const fetchShowrooms = async () => {
    const apiResponse = await axiosGetService("/admin/store");

    if (!apiResponse.ok) {
      showToast(apiResponse.data.message || "Failed to fetch showrooms", "error");
      return;
    }

    if (Array.isArray(apiResponse.data.data)) {
      setShowrooms(apiResponse.data.data.map(normalize));
    } else {
      setShowrooms([]);
    }
  };

  /** Add */
  const handleAdd = () => {
    setSelectedShowroom(null);
    setModalOpen(true);
  };

  /** Edit */
  const handleEdit = (s) => {
    setSelectedShowroom(s);
    setModalOpen(true);
  };

  /** Delete (Frontend Only For Now) */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this showroom?")) {

      const apiResponse = await axiosDeleteService(`/admin/store/harddelete?id=${id}`)

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Store Not Delete");
        return
      }
      else {
        setShowrooms(prev => prev.filter(s => (s._id || s.id) !== id));
        showToast("Showroom deleted successfully");
      }
    }
  };

  /** Success After Add/Update */
  const handleSaveSuccess = (data) => {
    const normalized = normalize(data);

    if (selectedShowroom) {
      setShowrooms(prev =>
        prev.map(s => (s._id || s.id) === (data._id || data.id) ? normalized : s)
      );
      showToast("Showroom updated successfully");
    } else {
      setShowrooms(prev => [...prev, normalized]);
      showToast("New showroom added");
    }

    setModalOpen(false);
  };

  useEffect(() => {
    fetchShowrooms();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      {toast.show && <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#08221B] font-bold mb-2">
              <div className="p-1.5 bg-[#08221B] text-[#DFC370] rounded-lg"><Home size={18} /></div>
              <span>Management System</span>
            </div>
            <h1 className="text-4xl font-black text-[#08221B] tracking-tight">Showrooms</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your store locations and contact details globally.</p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-[#08221B] text-[#DFC370] px-8 py-4 rounded-2xl font-bold"
          >
            <Plus size={20} /> Add New Store
          </button>
        </div>

        {/* List */}
        {showrooms.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Home size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No stores found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {showrooms.map(s => {
              const img = s?.seeDesignsImages?.[0];

              return (
                <div
                  key={s._id || s.id}
                  className="group bg-white rounded-[2rem] border shadow-sm hover:shadow-xl transition-all duration-300 flex"
                >

                  {/* Image */}
                  <div className="w-48 bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-l-[2rem]">
                    {img ? (
                      <img
                        src={img}
                        className="h-full w-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-800">{s.name}</h2>

                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(s)} className="p-2 text-slate-400 hover:text-indigo-600">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(s._id || s.id)} className="p-2 text-slate-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex gap-2 items-start">
                          <MapPin size={16} className="text-indigo-500" />
                          <span>{s.address}</span>
                        </div>

                        <div className="flex gap-2 items-start">
                          <MapPin size={16} className="text-indigo-500" />
                          <span>{s.pincode}</span>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Clock size={16} className="text-indigo-500" />
                          <span>{`${s.timings.open} - ${s.timings.close}`}</span>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Phone size={16} className="text-indigo-500" />
                          <span>{s.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                      <button
                        onClick={() =>
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + " " + (s.city || ""))}`)
                        }
                        className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                      >
                        <MapIcon size={14} /> View on Google Maps
                      </button>

                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        ID: {(s._id || s.id)?.toString().slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <ShowroomModal
          showroom={selectedShowroom}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}


const ShowroomModal = ({ showroom, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    timings: {
      open: "",
      close: ""
    },
    phone: "",
    imageFile: null,
    image: ""
  });

  useEffect(() => {
    if (showroom) setFormData(prev => ({ ...prev, ...showroom }));
  }, [showroom]);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    const address = `${formData.street}, ${formData.city}, ${formData.state}`;

    fd.append("name", formData.name);
    fd.append("address", address);
    fd.append("city", formData.city);
    fd.append("state", formData.state);
    fd.append("pincode", formData.pincode);
    fd.append("country", formData.country);
    fd.append("timings.open", formData.timings.open);
    fd.append("timings.close", formData.timings.close);
    fd.append("phone", formData.phone);
    fd.append("navigateURL", "");

    if (formData.imageFile) {
      fd.append("storeImage", formData.imageFile); // for multer
    }

    const apiResponse = await axiosPostService(
      "/admin/store/add",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!apiResponse.ok) {
      alert(apiResponse.data.message || "Failed to add store");
      return;
    }

    window.location.reload();
    onSuccess(apiResponse.data.data);
  };

  return (
    /** ——— EXACT UI YOU POSTED ——— */
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {showroom ? "Edit Showroom" : "Add New Showroom"}
            </h2>
            <p className="text-slate-500 text-sm">
              Please fill in the store location and contact details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <Globe size={14} /> General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required name="name" placeholder="Store Name"
                value={formData.name} onChange={handleChange}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />

              <input required name="phone" placeholder="Contact Phone"
                value={formData.phone} onChange={handleChange}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <MapPin size={14} /> Location Details
            </h3>

            <input required name="street" placeholder="Street Address"
              value={formData.street} onChange={handleChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input required name="city" placeholder="City"
                value={formData.city} onChange={handleChange}
                className="p-3.5 bg-slate-50 border rounded-2xl" />

              <input required name="state" placeholder="State"
                value={formData.state} onChange={handleChange}
                className="p-3.5 bg-slate-50 border rounded-2xl" />

              <input required name="pincode" placeholder="Pincode"
                value={formData.pincode} onChange={handleChange}
                className="p-3.5 bg-slate-50 border rounded-2xl" />

              <input required name="country" placeholder="Country"
                value={formData.country} onChange={handleChange}
                className="p-3.5 bg-slate-50 border rounded-2xl" />
            </div>
          </div>

          {/* Timings & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="time"
                value={formData.timings.open}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    timings: { ...prev.timings, open: e.target.value }
                  }))
                }
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl"
              />

              <input
                required
                type="time"
                value={formData.timings.close}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    timings: { ...prev.timings, close: e.target.value }
                  }))
                }
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl"
              />
            </div>


            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                <ImageIcon size={14} /> Store Image
              </h3>

              <label className="block w-full cursor-pointer p-3 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl text-center text-indigo-600 font-bold hover:bg-indigo-100">
                Upload Image
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>
          </div>

          {formData.image && (
            <div className="relative group rounded-3xl overflow-hidden h-48 border-4 border-slate-50 shadow-inner">
              <img src={formData.image} className="w-full h-full object-cover" />
              <button type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: "", imageFile: null }))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50">
              Cancel
            </button>

            <button type="submit"
              className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
              <Save size={20} /> {showroom ? "Update Details" : "Save Showroom"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Showrooms;
