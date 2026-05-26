// src/routes/AdminPrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");
  return token
    ? children
    : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
};

export default AdminPrivateRoute;
