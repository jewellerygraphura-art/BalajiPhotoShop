import React, { useState, useEffect } from "react";
import { Edit3, Save, Image as ImageIcon } from "lucide-react";
import Toast from "../../components/admin/Toast.jsx";
import { axiosGetService, axiosPutService } from "../../services/axios.js";

const AdminProfile = () => {

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    profileImage: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    profileImage: "",     // for backend URL
    profilePreview: "",   // for UI preview
    profileFile: null     // actual image file for FormData
  });

  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...admin,
      profilePreview: admin?.profileImage ?admin.profileImage : ""
    }));
  }, [admin]);



  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, profileFile: file }));

    const preview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profilePreview: preview }));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("contact", formData.contact);
      fd.append("gender", formData.gender);

      if (formData.profileFile) {
        fd.append("profileImage", formData.profileFile);
      }

      const apiResponse = await axiosPutService("/admin/auth/profile", fd);

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Update failed");
        return;
      }

      setEditMode(false);
      showToast("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (error) {
      console.log("Profile update error:", error);
    }
  };


  useEffect(() => {
    (async () => {
      const apiResponse = await axiosGetService("/admin/auth/myprofile");

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "No Data Available.");
        return;
      }

      setAdmin(apiResponse.data.data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E8] flex justify-center items-start pt-5 p-2">
      {toast.show && <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-[#08221B]">Admin Profile</h1>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#08221B] text-[#DFC370] rounded-2xl font-bold hover:bg-indigo-700"
            >
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-inner">

            {formData.profilePreview ? (
              <img src={formData.profilePreview || "/default-profile.png"}
                alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-indigo-50 text-indigo-300">
                <ImageIcon size={48} />
              </div>
            )}

            {editMode && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <Edit3 size={16} />
              </label>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} disabled={!editMode}
              className={`w-full p-3.5 mt-1 rounded-2xl border ${editMode ? "border-indigo-300 focus:ring-2 focus:ring-indigo-500" : "border-slate-200 bg-slate-50"}`}
              placeholder="Name" />

            <input name="email" value={formData.email} onChange={handleChange} disabled
              className="w-full p-3.5 mt-1 rounded-2xl border border-slate-200 bg-slate-50"
              placeholder="Email" />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="contact" value={formData.contact} onChange={handleChange} disabled={!editMode}
              className={`w-full p-3.5 mt-1 rounded-2xl border ${editMode ? "border-indigo-300 focus:ring-2 focus:ring-indigo-500" : "border-slate-200 bg-slate-50"}`}
              placeholder="Contact" />

            <select name="gender" value={formData.gender} onChange={handleChange} disabled={!editMode}
              className={`w-full p-3.5 mt-1 rounded-2xl border ${editMode ? "border-indigo-300 focus:ring-2 focus:ring-indigo-500" : "border-slate-200 bg-slate-50"}`}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        {editMode && (
          <div className="flex gap-4 mt-8">
            <button onClick={() => setEditMode(false)}
              className="flex-1 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
