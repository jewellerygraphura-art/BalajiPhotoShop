import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePic from "../../../assets/NewArrivalAssets/logos/ProfilePic.jpg";
import { axiosPutService, axiosGetService } from "../../../services/axios";
import { Toaster } from "react-hot-toast";
import { Camera } from "lucide-react";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("Male");
  const [contact, setContact] = useState("");
  const [userType, setUserType] = useState("B2C");
  const [businessDetails, setBusinessDetails] = useState(null);

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);

    const previewURL = URL.createObjectURL(file);

    setImage((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return previewURL;
    });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("contact", contact);
      formData.append("gender", gender);

      if (selectedImageFile) {
        formData.append("profileImage", selectedImageFile);
      }

      const apiResponse = await axiosPutService(
        "/customer/auth/profile",
        formData
      );

      if (!apiResponse || !apiResponse.ok) {
        alert(
          (apiResponse && apiResponse.data && apiResponse.data.message) ||
          "Update Failed"
        );
        setIsUpdating(false);
        return;
      }

      alert(apiResponse.data.message);

      setTimeout(() => {
        setIsUpdating(false);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setIsUpdating(false);
    }
  };

  useEffect(() => {

    const access = localStorage.getItem("access");

    if (!access) {
      console.log("Check");
      navigate("/signin");
      return;
    }

    (async () => {
      try {
        const apiResponse = await axiosGetService("/customer/auth/myProfile");

        if (!apiResponse || !apiResponse.ok) {
          navigate("/signin");
          return;
        }

        const profileData = apiResponse.data.data;

        setEmail(profileData.email || "");
        setContact(profileData.contact || "");
        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
        setGender(profileData.gender || "Male");
        setImage(profileData.profileImage || "");
        setUserType(profileData.userType || "B2C");
        setBusinessDetails(profileData.businessDetails || null);

      } catch (err) {
        console.error("Failed to fetch profile:", err);
        navigate("/signin");
      }
    })();

  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto font-sans relative">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={() => navigate("/")}
        className="absolute top-0 right-0 flex items-center gap-2 text-[#1B3022] hover:underline text-sm transition-all cursor-pointer"
      >
        <span>←</span> Back to Home
      </button>

      <div
        className="relative w-28 h-28 mb-4 cursor-pointer"
        onClick={() => document.getElementById("profileFile").click()}
      >
        <img
          src={image || ProfilePic}
          className="rounded-full w-full h-full object-cover border-2 border-white shadow-sm"
          alt="Profile"
        />

        <input
          id="profileFile"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />

        <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#1B3022] rounded-full flex items-center justify-center shadow-md">
          <Camera size={14} className="text-white" />
        </div>
      </div>

      {userType === "B2B" && businessDetails && (
        <div className="mb-8 p-6 bg-[#FBF6EA] border border-[#CBA135]/40 rounded-sm shadow-sm font-serif">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5 pb-4 border-b border-[#E5DDCC]">
            <h3 className="text-xl font-medium text-[#1B3022] tracking-wide uppercase text-sm font-bold tracking-widest">Business Account Details</h3>
            <span
              className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm ${
                businessDetails.isApproved
                  ? "bg-[#1E3A2F] text-white"
                  : "bg-[#CBA135] text-white animate-pulse"
              }`}
            >
              {businessDetails.isApproved ? "Approved Wholesale Partner" : "Pending Admin Verification"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#1B3022]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#B08E42] font-bold mb-1">Company Name</p>
              <p className="font-semibold text-lg">{businessDetails.companyName || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#B08E42] font-bold mb-1">GSTIN / Tax ID</p>
              <p className="font-mono font-semibold text-lg tracking-wider">{businessDetails.gstin || "N/A"}</p>
            </div>
            <div className="col-span-full">
              <p className="text-[10px] uppercase tracking-widest text-[#B08E42] font-bold mb-1">Business Billing Address</p>
              <p className="text-[#1E3A2F]/80 leading-relaxed font-sans">{businessDetails.businessAddress || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">First Name*</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-3 border border-gray-200 rounded-sm outline-none bg-white focus:border-[#1B3022] transition-colors shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Last Name*</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-3 border border-gray-200 rounded-sm outline-none bg-white focus:border-[#1B3022] transition-colors shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2 col-span-full">
          <label className="text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            value={email}
            readOnly
            className="p-3 border border-gray-200 rounded-sm outline-none bg-gray-50 cursor-not-allowed transition-colors shadow-sm w-full"
          />
        </div>

       <div className="flex flex-col gap-2 col-span-full">
  <label className="text-sm font-medium text-gray-700">
    Phone Number*
  </label>

  <input
    type="tel"
    value={contact}
    maxLength={10}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setContact(value);
    }}
    className="p-3 border border-gray-200 outline-none rounded-sm bg-white focus:border-[#1B3022] transition-colors shadow-sm w-full"
    placeholder="Enter 10-digit mobile number"
  />
</div>

        <div className="flex flex-col gap-2 col-span-full relative">
          <label className="text-sm font-medium text-gray-700">Gender*</label>
          <select
            className="p-3 border rounded-sm border-gray-200 outline-none bg-white focus:border-[#1B3022] appearance-none cursor-pointer shadow-sm w-full"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div className="absolute right-4 bottom-3.5 text-sm pointer-events-none text-gray-600">
            ▼
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`px-12 py-4 text-sm font-medium tracking-wide transition-all duration-300 rounded-sm shadow-lg active:scale-95 ${showSuccess
              ? "bg-green-600 text-white"
              : "bg-[#1B3022] text-white hover:bg-[#2a4532]"
            }`}
        >
          {isUpdating
            ? "Updating..."
            : showSuccess
              ? "Changes Updated! ✓"
              : "Update Changes"}
        </button>

        {showSuccess && (
          <span className="text-green-600 text-sm animate-pulse">
            Profile synchronized successfully!
          </span>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;