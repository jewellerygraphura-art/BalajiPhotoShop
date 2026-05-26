import React, { useState, useEffect } from "react";
import {
  User,
  Trash2,
  Mail,
  Eye,
  Search,
  Users as UsersIcon,
  ShoppingBag,
  X,
} from "lucide-react";
import Toast from "../../components/admin/Toast.jsx";
import { axiosGetService, axiosDeleteService } from "../../services/axios.js"

const Users = () => {
  const [viewMode, setViewMode] = useState("team");
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {

      const apiResponse = await axiosDeleteService(`/admin/auth/deleteemployee?userId=${id}`)

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Employee Not Delete.");
      }
      else {
        setUsers(users.filter((u) => u._id !== id));
        showToast("User removed successfully!", "success");
      }
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    const apiResponse = await axiosDeleteService(`/admin/auth/customers/${customerId}`);

    if (!apiResponse.ok) {
      showToast(apiResponse.data?.message || "Customer not deleted", "error");
      return;
    }

    setCustomers((prev) => prev.filter((customer) => customer._id !== customerId));

    if (selectedCustomerDetails?.customer?._id === customerId) {
      setShowCustomerModal(false);
      setSelectedCustomerDetails(null);
    }

    showToast("Customer deleted successfully", "success");
  };

  const fetchUsers = async () => {
    setLoading(true);
    const apiResponse = await axiosGetService("/admin/auth/getemployee");

    if (!apiResponse.ok) {
      showToast(apiResponse.data.message || "Failed to load users", "error");
      setUsers([]);
      setLoading(false);
      return;
    }

    const data = apiResponse.data.data;

    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      setUsers([]);
    }

    setLoading(false);
  };

  const fetchCustomers = async (search = "") => {
    setLoading(true);

    const queryString = search
      ? `/admin/auth/customers?search=${encodeURIComponent(search)}&page=1&limit=100`
      : "/admin/auth/customers?page=1&limit=100";

    const apiResponse = await axiosGetService(queryString);

    if (!apiResponse.ok) {
      showToast(apiResponse.data?.message || "Failed to load customers", "error");
      setCustomers([]);
      setLoading(false);
      return;
    }

    setCustomers(apiResponse.data?.data?.customers || []);
    setLoading(false);
  };

  const openCustomerDetails = async (customerId) => {
    setDetailsLoading(true);
    setShowCustomerModal(true);

    const apiResponse = await axiosGetService(`/admin/auth/customers/${customerId}`);

    if (!apiResponse.ok) {
      showToast(apiResponse.data?.message || "Unable to load customer details", "error");
      setSelectedCustomerDetails(null);
      setDetailsLoading(false);
      return;
    }

    setSelectedCustomerDetails(apiResponse.data?.data || null);
    setDetailsLoading(false);
  };


  useEffect(() => {
    if (viewMode === "team") {
      fetchUsers();
      return;
    }

    const timeout = setTimeout(() => {
      fetchCustomers(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [viewMode, searchQuery]);

  const totalCustomerOrders = customers.reduce(
    (sum, customer) => sum + (customer.totalOrders || 0),
    0
  );

  const totalCustomerSpent = customers.reduce(
    (sum, customer) => sum + (customer.totalSpent || 0),
    0
  );


  return (
    <div className="p-2 md:p-2 bg-[#FFF8E8] min-h-screen space-y-8 animate-in fade-in duration-500">
      {toast.show && (
        <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#08221B] flex items-center gap-3">
            <span className="p-2 bg-[#08221B] text-[#DFC370] rounded-2xl ">
              <User size={24} />
            </span>
            {viewMode === "team" ? "Team Management" : "Customer Directory"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {viewMode === "team"
              ? "Manage administrative access and team permissions."
              : "View all customer records and inspect each customer profile."}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode("team")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${viewMode === "team"
                ? "bg-[#08221B] text-[#DFC370]"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              Team
            </button>
            <button
              onClick={() => setViewMode("customers")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${viewMode === "customers"
                ? "bg-[#08221B] text-[#DFC370]"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              Customers
            </button>
          </div>

          {viewMode === "customers" && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 min-w-[280px]">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or contact"
                className="w-full outline-none text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {viewMode === "customers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Customers</p>
              <p className="text-2xl font-black text-[#08221B]">{customers.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
              <UsersIcon size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Orders</p>
              <p className="text-2xl font-black text-[#08221B]">{totalCustomerOrders}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Revenue</p>
              <p className="text-2xl font-black text-[#08221B]">₹{totalCustomerSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
              <Mail size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Email Address</th>
                {viewMode === "customers" && <th className="px-8 py-5">Phone</th>}
                <th className="px-8 py-5">Joined Date</th>
                {viewMode === "customers" && <th className="px-8 py-5">Orders</th>}
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={viewMode === "team" ? 4 : 6} className="px-8 py-6 text-center text-slate-500 font-medium">
                    Loading...
                  </td>
                </tr>
              ) : viewMode === "team" && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-6 text-center text-slate-500 font-medium">
                    No team members found
                  </td>
                </tr>
              ) : viewMode === "customers" && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-6 text-center text-slate-500 font-medium">
                    No customers found
                  </td>
                </tr>
              ) : viewMode === "team" ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800">
                          {user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Mail size={14} /> {user?.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {/* KEEP UI exactly as original */}
                      <span className="px-3 py-1 rounded-lg text-[16px] font-black uppercase tracking-tight bg-slate-100 text-slate-600">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleDeleteEmployee(user._id)}
                          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl shadow-sm transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                customers.map((customer) => {
                  const fullName = `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || "No Name";

                  return (
                    <tr key={customer._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                            {fullName?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-800">{fullName}</span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Mail size={14} /> {customer?.email || "-"}
                        </div>
                      </td>

                      <td className="px-8 py-5 text-slate-700 font-semibold">
                        {customer?.contact || "-"}
                      </td>

                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-lg text-[16px] font-black uppercase tracking-tight bg-slate-100 text-slate-600">
                          {new Date(customer?.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700">
                          {customer?.totalOrders || 0} orders
                        </span>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => openCustomerDetails(customer._id)}
                            className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm transition-all"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl shadow-sm transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCustomerModal && (
        <CustomerDetailsModal
          loading={detailsLoading}
          data={selectedCustomerDetails}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomerDetails(null);
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

const CustomerDetailsModal = ({ loading, data, onClose, onDeleteCustomer }) => {
  const customer = data?.customer;
  const addresses = data?.addresses || [];
  const recentOrders = data?.recentOrders || [];
  const summary = data?.summary || { totalOrders: 0, totalSpent: 0 };
  const fullName = `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || "No Name";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Customer Details</h2>
            <p className="text-slate-500 text-sm font-medium">
              View customer profile, phone, addresses and recent orders.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-semibold">Loading customer details...</div>
          ) : !customer ? (
            <div className="py-12 text-center text-slate-500 font-semibold">Customer details not found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs uppercase tracking-widest font-black text-slate-400">Name</p>
                  <p className="mt-1 text-lg font-black text-slate-800">{fullName}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs uppercase tracking-widest font-black text-slate-400">Phone</p>
                  <p className="mt-1 text-lg font-black text-slate-800">{customer.contact || "-"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs uppercase tracking-widest font-black text-slate-400">Email</p>
                  <p className="mt-1 text-base font-bold text-slate-700 break-all">{customer.email || "-"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs uppercase tracking-widest font-black text-slate-400">Gender</p>
                  <p className="mt-1 text-base font-bold text-slate-700">{customer.gender || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-xs uppercase tracking-widest font-black text-emerald-500">Total Orders</p>
                  <p className="mt-1 text-2xl font-black text-emerald-700">{summary.totalOrders || 0}</p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                  <p className="text-xs uppercase tracking-widest font-black text-blue-500">Total Spent</p>
                  <p className="mt-1 text-2xl font-black text-blue-700">₹{(summary.totalSpent || 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 mb-3">Saved Addresses</h3>
                {addresses.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-slate-500 font-semibold">
                    No address found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address._id} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <p className="font-black text-slate-800">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {address.address}, {address.city}, {address.state} - {address.zip}, {address.country}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Phone: {address.phone} | Email: {address.email}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 mb-3">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-slate-500 font-semibold">
                    No recent orders
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-black text-slate-800">{order.displayOrderId}</p>
                          <p className="text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{order.orderStatus}</span>
                          <span className="font-black text-slate-800">₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => customer?._id && onDeleteCustomer(customer._id)}
              disabled={!customer}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:bg-red-300"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
