// src/pages/admin/Dashboard.jsx
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import StatCard from "../../components/admin/StatCard";
import { Package, CheckCircle, XCircle, Users, Home } from "lucide-react";
// import { useAdmin } from "../../context/AdminContext.jsx";
import { axiosGetService } from "../../services/axios";

const Dashboard = () => {

  const [products, serProducts] = useState([]);
  const [showrooms, setShowroom] = useState([]);
  const [customers, setCustomers] = useState([]);

  // ---------------- Stats ----------------
  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stockStatus === "In Stock").length,
    outOfStock: products.filter((p) => p.stockStatus === "Out of Stock").length,
    totalShowrooms: showrooms.length,
    totalCustomers: customers.length,
  };

  // ---------------- Charts ----------------
  const stockData = [
    { name: "In Stock", value: stats.inStock },
    { name: "Out of Stock", value: stats.outOfStock },
  ];

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  const productsByCategory = products.reduce((acc, p) => {
    const categoryName = capitalize(p.category);

    const found = acc.find((c) => c.category === categoryName);

    if (found) {
      found.count += 1;
    } else {
      acc.push({ category: categoryName, count: 1 });
    }

    return acc;
  }, []);

  // Vibrant colors
  const PIE_COLORS = ["#4F46E5", "#6366F1"];
  const BAR_COLOR = "#4F46E5";


  useState(() => {
    ; (async () => {
      const productApiResponse = await axiosGetService("/admin/product/getall", { withCredentials: true });
      const storeApiResponse = await axiosGetService("/admin/store", { withCredentials: true });
      const customersApiResponse = await axiosGetService("/admin/order/", { withCredentials: true });


      if (!productApiResponse.ok) {
        console.log(productApiResponse.data.message || "Failed to load products")
        return;
      }

      if (!storeApiResponse.ok) {
        console.log(storeApiResponse.data.message || "Failed to load Store")
        return;
      }

      setShowroom(storeApiResponse.data.data);
      setCustomers(customersApiResponse.data)

      // backend format: res.data.data = Array(products)
      const productsArray = productApiResponse.data.data;

      if (Array.isArray(productsArray)) {
        serProducts(productsArray);
      } else {
        serProducts([]);
      }
    })();
  })


  return (
    <div className=" min-h-screen bg-[#FFF8E8] space-y-6">
      <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#08221B]">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          label="In Stock"
          value={stats.inStock}
          icon={CheckCircle}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStock}
          icon={XCircle}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          label="Showrooms"
          value={stats.totalShowrooms}
          icon={Home}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          label="Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Stock Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Product Stock Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category Bar Chart */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Products by Category
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productsByCategory}>
              <XAxis dataKey="category" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={BAR_COLOR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-6">


      </div>
    </div>
  );
};

export default Dashboard;
