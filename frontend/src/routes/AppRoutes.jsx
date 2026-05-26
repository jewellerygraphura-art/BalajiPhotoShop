import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// 👇 IMPORTANT
import ScrollToTop from "../ScrollToTop";

// User Pages
import Home from "../pages/homePage/Home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Verify from "../pages/auth/Verify";
import ComingSoon from "../pages/auth/ComingSoon";

import Collections from "../pages/collections/Collections";
import EngagementRings from "../pages/collections/EngagementRings";
import WeddingBands from "../pages/collections/WeddingBands";
import ClassicSolitaire from "../pages/collections/ClassicSolitaire";
import VintageBands from "../pages/collections/VintageBands";
import NewArrivals from "../pages/newArrivals/NewArrival";
import Occasions from "../pages/occasions/Occasion";
import Store from "../pages/store/Store";
import AboutUs from "../pages/aboutUs/AboutUs";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Profile from "../pages/Profile/Profile";

import TrackingOrder from "../pages/trackOrder/TrackOrder";
import TrackingForm from "../pages/trackOrder/TrackingForm";
import Cart from "../pages/cart/Cart";
import Favorites from "../pages/favorites/Favorites";
import OrderSuccess from "../pages/orders/OrderSuccess";
import OrderCancel from "../pages/orders/OrderCancel";
import PaymentFailed from "../pages/orders/PaymentFailed";
import Checkout from "../pages/checkout/Checkout";

import ContactUs from "../pages/contactus/ContactUs";
import PrivacyPolicy from "../pages/legal/Privacy";
import Terms from "../pages/terms/Terms";
import Faq from "../pages/faqs/Faqs";
import SearchProducts from "../pages/searchProducts/SearchProducts";
import Ring from "../pages/footerPages/Ring";
import Bracelets from "../pages/footerPages/Bracelets";
import Necklace from "../pages/footerPages/Necklace";
import Earring from "../pages/footerPages/Earring";

// Services
import LifetimeService from "../pages/services/LifetimeService";
import EasyExchange from "../pages/services/EasyExchange";
import Authenticity from "../pages/services/Authenticity";
import SecureDelivery from "../pages/services/SecureDelivery";

// Admin
import AdminLogin from "../pages/auth/AdminLogin";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Showrooms from "../pages/admin/Showrooms";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminSignUp from "../pages/auth/AdminSignup";
import B2BApprovals from "../pages/admin/B2BApprovals";

import Payment from "../pages/Profile/Sections/Payment";
import ProductDetailsById from "../pages/ProductDetails/ProductDetailsById";
import Women from "../pages/collections/Women";
import Men from "../pages/collections/Men";
import Kid from "../pages/collections/Kid";

export default function AppRoutes() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/admin");

  return (
    <div className={!hideLayout ? "pt-16 sm:pt-20 md:pt-22 lg:pt-28 xl:pt-32" : ""}>
      
      {!hideLayout && <Navbar />}

      {/* ✅ SCROLL FIX */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/engagement-rings" element={<EngagementRings />} />
        <Route path="/collections/wedding-bands" element={<WeddingBands />} />
        <Route path="/collections/classic-solitaire" element={<ClassicSolitaire />} />
        <Route path="/collections/vintage-bands" element={<VintageBands />} />
        <Route path="/collections/women" element={<Women />} />
        <Route path="/collections/men" element={<Men />} />
        <Route path="/collections/kid" element={<Kid />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/occasions" element={<Occasions />} />
        <Route path="/store" element={<Store />} />
        <Route path="/about" element={<AboutUs />} />
        
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faqs" element={<Faq />} />

        <Route path="/rings" element={<Ring />} />
        <Route path="/necklaces" element={<Necklace />} />
        <Route path="/earrings" element={<Earring />} />
        <Route path="/bracelets" element={<Bracelets />} />

        <Route path="/track-order" element={<TrackingForm />} />
        <Route path="/track-order/:orderId" element={<TrackingOrder />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/favourites" element={<Favorites />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-cancel" element={<OrderCancel />} />
        <Route path="/payment-fail" element={<PaymentFailed />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/searchProduct" element={<SearchProducts />} />
        <Route path="/paymentmethod" element={<Payment />} />
        <Route path="/productId/:id" element={<ProductDetailsById />} />

        <Route path="/services/lifetime-service" element={<LifetimeService />} />
        <Route path="/services/easy-exchange" element={<EasyExchange />} />
        <Route path="/services/authenticity" element={<Authenticity />} />
        <Route path="/services/secure-delivery" element={<SecureDelivery />} />

        <Route
          path="/admin/*"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="showroom" element={<Showrooms />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="b2b" element={<B2BApprovals />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}