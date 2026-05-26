
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // 1) Admin ला सगळे orders आण
  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // const fetchOrders = async () => {
  //   try {
  //     const res = await axios.get("/api/v1/admin/order", {withCredentials: true});
  //     setOrders(res.data);
  //   } catch (err) {
  //     console.log("Orders Fetch Error:", err);
  //   }
  // };

  // 2) Status update function (DB + UI + MyOrders साठी)
  const updateOrderStatus = async (id, status) => {
  try {
    const res = await axios.put(
      `/api/v1/admin/order/${id}/status`,
      { status },
      {withCredentials: true}
    );

    setOrders((prev) =>
      prev.map((o) => (o._id === id ? res.data : o))
    );

    return res.data;
  } catch (err) {
    console.log("Status Update Error:", err);
    throw err;
  }
};




  return (
    <AdminContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
};
