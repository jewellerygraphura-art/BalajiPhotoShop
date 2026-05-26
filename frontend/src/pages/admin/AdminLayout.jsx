import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.svg'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Sparkles,
  User,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  Crown,
  Home,
  LogOut
} from "lucide-react";

import { axiosPostService } from "../../services/axios";

const MENU = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ClipboardList },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Showrooms", path: "/admin/showroom", icon: Home },
  { name: "Wholesale", path: "/admin/b2b", icon: Crown },
  { name: "Profile", path: "/admin/profile", icon: User },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Admin Name Logic
  let adminName = "Admin";
  try {
    const adminObj = JSON.parse(localStorage.getItem("adminToken"));
    adminName = adminObj?.name || adminName;
  } catch {
    adminName = localStorage.getItem("adminToken") || adminName;
  }

  const handleLogout = async () => {
    const apiResponse = await axiosPostService("/admin/auth/signout");

    if (!apiResponse.ok) {
      alert(apiResponse.data.message || "Signout Failed")
    }
    else {
      localStorage.clear()
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl text-md font-bold transition-all duration-200
     ${isActive
      ? "bg-[#08221B] text-[#DFC370] shadow-lg shadow-indigo-200 dark:shadow-none"
      : dark
        ? "text-[#08221B] hover:bg-[#08221B] hover:text-white"
        : "text-[#08221B] hover:bg-[#08221B] hover:text-[#DFC370]"}`;

  // Sidebar Component dùng chung cho cả Desktop và Mobile
  const SidebarContent = () => (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 relative
      ${collapsed ? "w-20" : "w-64"}
      ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}
      border-r`}
    >
      {/* Brand / Logo Section */}
      <div className="p-6 flex-shrink-0 bg-[#08221B] text-[#DFC370]  shadow-2xl ">
        <div className="flex items-center gap-3">
          <div className="  bg-transparent text-[#DFC370] flex-shrink-0  ">
            <img src={logo} alt="" className="w-11 h-11" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <h1 className="font-black text-lg tracking-tight">BALAJI</h1>
              <p className="text-[10px] uppercase tracking-widest  font-bold">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar bg-[#FFF8E8] py-7">
        {MENU.map((item, i) => (
          <NavLink
            key={i}
            title={collapsed ? item.name : ""}
            to={item.path}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className={`p-4 border-t bg-[#FFF8E8] flex-shrink-0 `}>


        {/* User Info */}
        <div className="flex items-center gap-3 p-1 ">
          <div className="w-10 h-10 rounded-full bg-[#08221B] text-[#DFC370] flex items-center justify-center font-black flex-shrink-0 shadow-md">
            {adminName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-md font-bold truncate text-[#08221B] uppercase ">{adminName}</p>
              <button
                onClick={handleLogout}
                className="text-[14px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
              >
                <LogOut size={16} /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Desktop Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 bg-[#DFC370]   text-[#08221B] p-1 rounded-full shadow-lg hidden md:flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <ChevronLeft
          size={16}
          className={`${collapsed ? "rotate-180" : ""} transition-transform duration-300`}
        />
      </button>
    </aside>
  );

  return (
    <div className={`min-h-screen flex transition-colors duration-300 bg-[#FFF8E8] ${dark ? "" : ""}`}>

      {/* Mobile Header - */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-3 border-b shadow-sm bg-[#08221B] text-[#DFC370] border-slate-200">

        {/* Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-[#0f3a2f] transition"
        >
          <Menu size={24} />
        </button>

        {/* Center Logo + Title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <h1 className="font-black text-lg tracking-wide">BALAJI</h1>
        </div>

      </div>

      {/* Desktop Sidebar - Sticky & Full Height */}
      <div className="hidden md:block sticky top-0 h-screen flex-shrink-0 overflow-visible">
        <SidebarContent />
      </div>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="absolute left-0 top-0 h-full shadow-2xl animate-slide-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 ${mobileOpen ? 'blur-sm md:blur-none' : ''}`}>
        <div className="p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[1600px] mx-auto">
          {/* Nội dung trang admin sẽ render ở đây */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;