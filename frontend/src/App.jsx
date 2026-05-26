import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AdminProvider } from "./context/AdminContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
      <FavoritesProvider>
        <AdminProvider>
          <AppRoutes />
        </AdminProvider>
      </FavoritesProvider>
    </CartProvider>
    </ProductProvider>
  );
}
