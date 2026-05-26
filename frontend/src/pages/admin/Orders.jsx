import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { XCircle, Package, Search } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import Toast from "../../components/admin/Toast";
import { useAdmin } from "../../context/AdminContext";

const ALL_STATUSES = [
  "All",
  "Confirmed",
  "Accepted",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refund Requested",
  "Refunded"
];

const ALLOWED_STATUS_TRANSITIONS = {
  Confirmed: ["Accepted", "Cancelled"],
  Accepted: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Returned"],
  Delivered: ["Returned"],
  Returned: ["Refund Requested"],
  "Refund Requested": ["Refunded"],
  Refunded: [],
  Cancelled: []
};

const Orders = () => {
  const { updateOrderStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [processingRefundId, setProcessingRefundId] = useState(null);
  const [orders, setOrders] = useState([])


  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };


  const [startDate, setStartDate] = useState(getYesterday());
  const [endDate, setEndDate] = useState(getToday());


  const fetchOrders = async () => {
    try {

      let query = [];

      if (filterStatus !== "All") {
        query.push(`status=${filterStatus}`);
      }

      if (startDate) {
        query.push(`startDate=${startDate}`);
      }

      if (endDate) {
        query.push(`endDate=${endDate}`);
      }

      const queryString = query.length ? `?${query.join("&")}` : "";

      const res = await axios.get(
        `/api/v1/admin/order${queryString}`,
        { withCredentials: true }
      );

      setOrders(res.data.data);

    } catch (err) {
      console.log("Orders Fetch Error:", err.response?.data || err.message);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, [filterStatus, startDate, endDate]);


  const searchOrderById = async (orderId) => {
    try {

      if (!orderId.trim()) {
        fetchOrders();
        return;
      }

      const encodedId = encodeURIComponent(orderId);

      const res = await axios.get(
        `/api/v1/admin/order/search/${encodedId}`,
        { withCredentials: true }
      );

      console.log(res);
      console.log(orderId);
      setOrders([res.data.order]);

    } catch (err) {
      setOrders([]);
      console.log("Search Error:", err.response?.data || err.message);
    }
  };



  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // 🔥 STATUS UPDATE WITH SAFE REFUND LOGIC
  const handleStatusUpdate = async (id, newStatus, order) => {
    try {
      const currentStatus = order.orderStatus;
      const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

      if (newStatus === currentStatus) return;

      if (!allowedTransitions.includes(newStatus)) {
        showToast(`Cannot change ${currentStatus} to ${newStatus}`, "error");
        return;
      }

      // 🚀 Only allow refund if current status is "Refund Requested"
      if (newStatus === "Refunded") {

        if (currentStatus !== "Refund Requested") {
          showToast("Invalid refund attempt", "error");
          return;
        }

        try {
          const refundResponse = await axios.post(
            `/api/v1/customer/order/process-refund/${id}`,
            {},
            { withCredentials: true }
          );

          if (!refundResponse.data.success) {
            showToast(refundResponse.data.message || "Refund failed", "error");
            return;
          }

          const updatedOrder = await updateOrderStatus(id, "Refunded");
          setOrders((prev) =>
            prev.map((o) => (o._id === id ? updatedOrder : o))
          );
          showToast(`Refund processed successfully! ID: ${refundResponse.data.refundId}`);
        } catch (refundError) {
          showToast(refundError.response?.data?.message || refundError.message || "Refund processing failed", "error");
        }
        return;
      }
      if (currentStatus === "Refunded") {
        showToast("Refunded order cannot be modified", "error");
        return;
      }

      const updatedOrder = await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updatedOrder : o))
      );
      showToast(`Order marked as ${newStatus}`);

    } catch (err) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (filterStatus !== "All") {
      data = data.filter((o) => o.orderStatus === filterStatus);
    }

    if (searchQuery && orders.length > 1) {
      data = data.filter((o) =>
        o.userName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  }, [orders, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const statusCounts = {};
    ALL_STATUSES.slice(1).forEach(
      (status) =>
      (statusCounts[status] = orders.filter(
        (o) => o.orderStatus === status
      ).length)
    );

    return [
      {
        label: "Total Orders",
        value: orders.length,
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      ...Object.entries(statusCounts).map(([status, count]) => ({
        label: `${status} Orders`,
        value: count,
        icon: Package,
        color: "text-indigo-600",
        bg: "bg-gray-50",
      })),
    ];
  }, [orders]);

  return (
    <div className="min-h-screen space-y-6">

      {toast.show && (
        <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <h1 className="text-3xl font-black">Orders Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ALL_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-lg"
          />

        </div>

        <div className="flex items-center gap-2 border p-2 rounded-xl w-full md:w-64">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              searchOrderById(value);
            }}
            placeholder="Search by Order ID or Customer"
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full table-auto text-sm md:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Products</th>
              <th className="px-6 py-3 text-left">Customer Name</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4">{order.displayOrderId}</td>

                  <td className="px-6 py-4">
                    {order.products?.map((p, i) => (
                      <div key={i} className="text-xs mb-1">
                        <div><b>{p.name}</b></div>
                        <div>Qty: {p.qty}</div>
                        <div>Carat: {p.carat}</div>
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4">{order.userName}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">₹{order.total}</td>

                  <td className="px-6 py-4 text-xs">
                    <div><b>{order.address?.fullName}</b></div>
                    <div>{order.address?.mobile}</div>
                    <div>
                      {order.address?.addressLine}, {order.address?.city},{" "}
                      {order.address?.state} - {order.address?.pincode}
                    </div>
                  </td>

                  {/* STATUS DROPDOWN WITH CONTROLLED OPTIONS */}
                  <td className="px-6 py-4">
                    {(() => {
                      const allowedTransitions =
                        ALLOWED_STATUS_TRANSITIONS[order.orderStatus] || [];

                      return (
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value, order)
                      }
                      className="p-1 border rounded-md"
                      disabled={allowedTransitions.length === 0}
                    >
                      {/* Always show current status */}
                      <option value={order.orderStatus}>
                        {order.orderStatus}
                      </option>

                      {allowedTransitions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                      );
                    })()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      {/* Cancel Button */}
                      <button
                        onClick={() => handleStatusUpdate(order._id, "Cancelled", order)}
                        disabled={
                          !((ALLOWED_STATUS_TRANSITIONS[order.orderStatus] || []).includes("Cancelled"))
                        }
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition ${!((ALLOWED_STATUS_TRANSITIONS[order.orderStatus] || []).includes("Cancelled"))
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                      >
                        <XCircle size={14} /> Cancel
                      </button>

                      {/* Refund Button */}
                      {order.orderStatus === "Refund Requested" && (
                        <button
                          onClick={async () => {
                            const confirmRefund = window.confirm(
                              "Are you sure you want to process this refund?\n\nThis action cannot be undone."
                            );

                            if (!confirmRefund) return;

                            try {
                              setProcessingRefundId(order._id);

                              await handleStatusUpdate(order._id, "Refunded", order);

                            } finally {
                              setProcessingRefundId(null);
                            }
                          }}
                          disabled={processingRefundId === order._id}
                          className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md font-medium transition-all duration-200
      ${processingRefundId === order._id
                              ? "bg-purple-300 text-white cursor-not-allowed"
                              : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:scale-95"
                            }`}
                        >
                          {processingRefundId === order._id ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              💸 Process
                            </>
                          )}
                        </button>
                      )}



                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Orders;
