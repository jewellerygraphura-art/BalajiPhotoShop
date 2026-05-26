import React, { useState, useMemo, useEffect } from "react";
import ProductModal from "../../components/admin/ProductModal";
import Toast from "../../components/admin/Toast.jsx";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

import { axiosGetService, axiosDeleteService } from "../../services/axios.js"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewType, setViewType] = useState("grid"); // grid or table
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Stats Logic
  const stats = useMemo(
    () => [
      {
        label: "Total Products",
        value: products.length,
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Out of Stock",
        value: products.filter((p) => p?.stockStatus && p.stockStatus !== "In Stock").length,
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
      },
      {
        label: "Inventory Value",
        value: `₹${products.reduce(
          (acc, p, index) => acc + (p?.variants?.reduce((a, v) => a + (v.sale * v.quantity), 0) || 0),
          0
        )}`,
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
    ],
    [products]
  );

  // Search & Filter Logic
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (productId, index) => {
    if (window.confirm("Delete this product permanently?")) {
      const apiResponse = await axiosDeleteService(`/admin/product/harddelete?productId=${productId}`);
      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Product not delete.")
        return
      }
      else {
        setProducts(products.filter((_, i) => i !== index));
        setToast({
          show: true,
          message: "Product removed from inventory",
          type: "success",
        });
      }
    }
  };

  const handleSuccess = () => {
    setModalOpen(false);
    loadProducts();
    setToast({ show: true, message: "Inventory updated successfully", type: "success" });
  };


  const loadProducts = async () => {
    try {
      const apiResponse = await axiosGetService("/admin/product/getall");

      if (!apiResponse.ok) {
        alert(apiResponse.data.message);
        return
      } else {

        setProducts(apiResponse.data.data || []);
      }
    } catch (err) {
      console.log(err);
      setToast({
        show: true,
        message: "Failed to load products",
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-2 bg-[#FFF8E8] min-h-screen font-sans text-slate-900">
      {toast.show && (
        <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      )}

      {/* --- Header & Stats --- */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#08221B]">
              Inventory
            </h1>
            <p className="text-[#08221B] font-medium">
              Manage your jewelry collection and stock levels.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-[#08221B] text-[#DFC370] px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
            >
              <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Toolbar --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#08221B]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by  category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent text-[#08221B] placeholder:text-[#08221B] focus:border-indigo-500 rounded-xl outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-lg transition-all ${viewType === "grid"
                ? "bg-white shadow-sm text-[#08221B]"
                : "text-slate-500"
                }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`p-2 rounded-lg transition-all ${viewType === "table"
                ? "bg-white shadow-sm text-[#08221B]"
                : "text-slate-500"
                }`}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>

        {/* --- Product Display --- */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Package size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              No products found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Try adjusting your search or add a new product to your inventory.
            </p>
          </div>
        ) : viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod, idx) => (
              <ProductCard
                key={idx}
                prod={prod}
                onEdit={() => handleEdit(prod)}
                onDelete={() => handleDelete(prod._id, idx)}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

// --- Sub-Component: Product Card ---
const ProductCard = ({ prod, onEdit, onDelete }) => {

  const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const imgUrl =
    prod.productImage?.[0] instanceof File
      ? URL.createObjectURL(prod.productImage[0])
      : prod.productImage?.[0];

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-56 bg-slate-100">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={prod.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="bg-white p-2 rounded-full shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="bg-white p-2 rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div
          className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${prod.stockStatus === "In Stock"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
            }`}
        >
          {prod.stockStatus}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold text-indigo-500 uppercase mb-1">
          {prod.category}
        </p>
        <h3 className="font-bold text-slate-800 truncate mb-4">{capitalizeWords(prod.name)}</h3>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              Price
            </p>
            <p className="text-xl font-black text-slate-900">
              ₹{prod.price?.sale || prod.price?.mrp}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              SKU
            </p>
            <p className="text-xs font-mono font-bold text-slate-600">
              {prod.sku || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Product Table ---
const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-slate-100">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
            Product
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
            Category
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
            Price
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
            Status
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {products.map((prod, idx) => (
          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                  <img
                    src={prod.productImage?.[0]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {prod.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">{prod.sku}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-slate-600">
              {prod.category}
            </td>
            <td className="px-6 py-4 font-bold text-slate-800">
              ₹{prod.price?.sale}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${prod.stockStatus === "In Stock"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {prod.stockStatus}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(prod)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Products;
