// src/components/admin/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  ClipboardList,
  Users,
  Crown,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  User,
  Home,
} from "lucide-react";

const MENU = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Web Curation", path: "/admin/web", icon: Sparkles },
  { name: "Orders", path: "/admin/orders", icon: ClipboardList },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Profile", path: "/admin/profile", icon: User },
  { name: "Showroom", path: "/admin/showroom", icon: Home }, // ✅ fixed
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  let adminName = "Admin User";
  try {
    const adminObj = JSON.parse(localStorage.getItem("adminToken"));
    adminName = adminObj?.name || adminName;
  } catch {
    adminName = localStorage.getItem("adminToken") || adminName;
  }

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
     ${
       isActive
         ? "bg-[#08221B] text-white shadow"
         : dark
         ? "text-slate-300 hover:bg-slate-800"
         : "text-slate-600 hover:bg-slate-100"
     }`;

  const SidebarContent = () => (
    <aside
      className={`h-full flex flex-col justify-between transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
      ${dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}
      border-r`}
    >
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Crown size={20} />
          </div>
          {!collapsed && (
            <div>
              <h1 className=" text-lg">BALAJI</h1>
              <p className="text-sm ">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2  ">
          {MENU.map((item, i) => (
            <NavLink key={i} to={item.path} className={linkClass}>
              <item.icon size={18} />
              {!collapsed && item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (dark ? "Light Mode" : "Dark Mode")}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
            {adminName.charAt(0)}
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold">{adminName}</p>
              <p className="text-xs opacity-70">Administrator</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 bg-indigo-600 text-white p-1 rounded-full shadow-lg hidden md:block"
      >
        <ChevronLeft
          size={16}
          className={`${collapsed ? "rotate-180" : ""} transition`}
        />
      </button>
    </aside>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <h1 className="font-black">BALAJI</h1>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute left-0 top-0 h-full">
            <SidebarContent />
          </div>
          <div
            className="w-full h-full"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
