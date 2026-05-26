import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

// User pages
import Home from "../pages/homePage/Home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/cart/Cart";
import Favorites from "../pages/favorites/Favorites";
// ...other user pages

// Admin pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import WebCuration from "../pages/admin/WebCuration";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Showrooms from "../pages/admin/Showrooms";

export default function AppRoutes() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className={!hideLayout ? "pt-16 sm:pt-20 md:pt-22 lg:pt-28 xl:pt-32" : ""}>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* Add all other user routes here */}

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route path="/admin/showroom" element={<Showrooms />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="web" element={<WebCuration />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}
