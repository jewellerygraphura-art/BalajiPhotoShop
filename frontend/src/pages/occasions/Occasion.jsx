import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "../../components/filterSection";
import ProductCard from "../../components/products/ProductCard";
import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";
import bannerImage from "../../assets/occassions/bannerImg.jpg";
import { axiosGetService } from "../../services/axios";

export const Collections = () => {
  // PRICE LIMIT FIX: इसे 0 से शुरू किया ताकि सस्ते प्रोडक्ट्स न छुपें
  const MIN_LIMIT = 0; 
  const MAX_LIMIT = 1000000;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([MIN_LIMIT, MAX_LIMIT]);
  const [sortBy, setSortBy] = useState("default");
  const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const apiResponse = await axiosGetService(
        "/customer/product/all?page=1&limit=100"
      );

      if (!apiResponse.ok) {
        alert(apiResponse.data.message || "Failed to fetch");
        return;
      }

      // DATA PATH CHECK: अलग-अलग रिस्पॉन्स स्ट्रक्चर के लिए सेफ्टी
      const products = apiResponse.data.data?.products || apiResponse.data?.products || [];
      setAllProducts(products);
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  useEffect(() => {
    // SCROLL TO TOP FIX: पेज हमेशा ऊपर से लोड होगा
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  // ================= DYNAMIC FILTER OPTIONS =================
  const dynamicCategories = useMemo(() => {
    return [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  }, [allProducts]);

  const dynamicMaterials = useMemo(() => {
    return [...new Set(allProducts.map(p => p.attributes?.material).filter(Boolean))];
  }, [allProducts]);

  const dynamicColors = useMemo(() => {
    return [...new Set(allProducts.map(p => p.attributes?.color).filter(Boolean))];
  }, [allProducts]);

  // ================= TOGGLE HANDLERS =================
  const toggleCategory = useCallback((cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(i => i !== cat) : [...prev, cat]
    );
  }, []);

  const toggleMaterial = useCallback((mat) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(i => i !== mat) : [...prev, mat]
    );
  }, []);

  const toggleColor = useCallback((col) => {
    setSelectedColors(prev =>
      prev.includes(col) ? prev.filter(i => i !== col) : [...prev, col]
    );
  }, []);

  // ================= PRICE HANDLERS =================
  const handleMinPriceChange = (e) => {
    const val = Number(e.target.value);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const val = Number(e.target.value);
    setPriceRange([priceRange[0], val]);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceRange([MIN_LIMIT, MAX_LIMIT]);
    setSortBy("default");
  };

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const salePrice = product?.price?.sale || product?.price?.mrp || 0;

      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.attributes?.material);
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.attributes?.color);
      const priceMatch = salePrice >= priceRange[0] && salePrice <= priceRange[1];

      return categoryMatch && materialMatch && colorMatch && priceMatch;
    });

    if (sortBy === "lowToHigh") {
      result.sort((a, b) => (a.price.sale || a.price.mrp) - (b.price.sale || b.price.mrp));
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => (b.price.sale || b.price.mrp) - (a.price.sale || a.price.mrp));
    }
    return result;
  }, [allProducts, selectedCategories, selectedMaterials, selectedColors, priceRange, sortBy]);

  return (
    <div className="bg-[#FFF9E9] min-h-screen font-sans text-[#2D2D2D]">
      {/* BANNER SECTION */}
      <section className="w-full">
        <div className="w-full h-[150px] xs:h-[180px] sm:h-[220px] md:h-[280px] lg:h-[350px] xl:h-[450px]">
          <img src={bannerImage} alt="Collections Banner" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </section>

      {/* HEADER */}
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-10 pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#B39055] uppercase">
          Collections
          <span className="text-gray-500 text-sm ml-3 lowercase">
            {filteredProducts.length} designs found
          </span>
        </h1>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
        {/* FILTER + SORT BAR */}
        <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
          <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#1C3A2C] text-white rounded-md">
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[#1C3A2C]">Sort by:</span>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-[200px] h-[40px] bg-[#E9E1C6] border border-[#1C3A2C] rounded px-3 text-sm appearance-none">
                <option value="default">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            categories={dynamicCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            materials={dynamicMaterials}
            selectedMaterials={selectedMaterials}
            onToggleMaterial={toggleMaterial}
            colors={dynamicColors}
            selectedColors={selectedColors}
            onToggleColor={toggleColor}
            priceRange={priceRange}
            onPriceChange={{ onMinChange: handleMinPriceChange, onMaxChange: handleMaxPriceChange }}
            minPrice={MIN_LIMIT}
            maxPrice={MAX_LIMIT}
            onClearAll={clearAll}
          />

          <section className="flex-1">
            {/* 1. Categorized Sections (Includes logic for flexibility) */}
            {["Daily", "Bridal", "Festive"].map(section => {
              const sectionProducts = filteredProducts.filter(
                p => p.productCollection?.toLowerCase().includes(section.toLowerCase())
              );

              if (sectionProducts.length === 0) return null;

              return (
                <div key={section} className="mb-12">
                  <h2 className="text-3xl text-[#C58B0E] font-serif mb-6 border-b pb-2">{section} Wear</h2>
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sectionProducts.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 2. Fallback: अगर 11 डिज़ाइन ऊपर वाली 3 केटेगरी में नहीं आ रहे, तो उन्हें यहाँ दिखाओ */}
            {filteredProducts.length > 0 && (
              <div className="mt-16 pt-8 border-t">
                <h2 className="text-2xl text-[#B39055] font-serif mb-6">Our Full Premium Gifts Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No designs found. Try clearing filters.</p>
                <button onClick={clearAll} className="text-[#B39055] underline mt-2">Clear All</button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FEATURES */}
      <section className="bg-[#FFF9E9] px-4 sm:px-6 lg:px-12 xl:px-16 py-10 lg:py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={shippingIcon} title="Free Shipping" description="On orders above ₹ 2,000" />
          <FeatureCard icon={paymentIcon} title="Flexible Payment" description="Secure payment options" />
          <FeatureCard icon={supportIcon} title="24x7 Support" description="Online support everyday" />
        </div>
      </section>
    </div>
  );
};

export const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-center gap-5 bg-white rounded-xl px-6 py-5 shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1C3A2C]">
      <img src={icon} alt="" className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-[18px] font-serif text-[#1C3A2C]">{title}</h4>
      <p className="text-[14px] text-[#1C3A2C]/80">{description}</p>
    </div>
  </div>
);

export default Collections;