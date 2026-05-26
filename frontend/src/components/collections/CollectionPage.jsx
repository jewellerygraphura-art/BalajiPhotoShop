import React, { useState, useMemo, useCallback, useEffect} from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "../filterSection";
import ProductCard from "../products/ProductCard";
import FeatureCard from "../common/FeatureCard";

import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";

/**
 * Generic collection / listing page.
 */
const CollectionPage = ({
  title = "Collections",
  products = [],
  loading,
  pagination,
  currentPage,
  fetchProducts
}) => {

  const MIN_LIMIT = 2500;
  const MAX_LIMIT = 600000;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([MIN_LIMIT, MAX_LIMIT]);
  const [sortBy, setSortBy] = useState("default");

  // FIX 1: Jab bhi ye page load ho, hamesha top par scroll kare (Bottom loading issue fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FIX 2: Products fetch karne ki condition ko robust banaya
  // Ab ye title par depend nahi karega, agar products 0 hain toh fetch karega
  useEffect(() => {
    if (products.length === 0 && typeof fetchProducts === 'function') {
      fetchProducts(1);
    }
  }, [products.length, fetchProducts]);

  // Derive filter options from the current product set
  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
    [products]
  );

  const materialOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.attributes?.material))).filter(Boolean),
    [products]
  );

  const colorOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.attributes?.color))).filter(Boolean),
    [products]
  );

  const toggleCategory = useCallback((cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((i) => i !== cat) : [...prev, cat]
    );
  }, []);

  const toggleMaterial = useCallback((mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((i) => i !== mat) : [...prev, mat]
    );
  }, []);

  const toggleColor = useCallback((col) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((i) => i !== col) : [...prev, col]
    );
  }, []);

  const handleMinPriceChange = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 1000);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 1000);
    setPriceRange([priceRange[0], val]);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceRange([MIN_LIMIT, MAX_LIMIT]);
    setSortBy("default");
  };

  const capitalizeFirst = (str = "") =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const salePrice = product?.price?.sale ?? 0;

      const category = capitalizeFirst(product?.category);
      const material = capitalizeFirst(product?.attributes?.material);
      const color = capitalizeFirst(product?.attributes?.color);

      const selectedCat = selectedCategories.map(capitalizeFirst);
      const selectedMat = selectedMaterials.map(capitalizeFirst);
      const selectedCol = selectedColors.map(capitalizeFirst);

      const categoryMatch =
        selectedCat.length === 0 || selectedCat.includes(category);

      const materialMatch =
        selectedMat.length === 0 || selectedMat.includes(material);

      const colorMatch =
        selectedCol.length === 0 || selectedCol.includes(color);

      const priceMatch =
        salePrice >= priceRange[0] && salePrice <= priceRange[1];

      return categoryMatch && materialMatch && colorMatch && priceMatch;
    });

    if (sortBy === "lowToHigh") {
      result = [...result].sort((a, b) => (a.price?.sale ?? 0) - (b.price?.sale ?? 0));
    } else if (sortBy === "highToLow") {
      result = [...result].sort((a, b) => (b.price?.sale ?? 0) - (a.price?.sale ?? 0));
    }

    return result;
  }, [products, selectedCategories, selectedMaterials, selectedColors, priceRange, sortBy]);

  // FIX 3: Spelling correction logic for the title
  const correctedTitle = title.replace(/Jewelery/gi, "Jewellery");

  return (
    <div className="bg-[#FFF9E9] min-h-screen font-sans text-[#2D2D2D]">
      {/* Header */}
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-10 pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#B39055] tracking-wide uppercase flex items-center gap-3">
          {correctedTitle}
          <span className="text-[#1C3A2C] text-2xl hidden sm:inline">|</span>
          <span className="text-gray-500 text-sm font-sans lowercase">
            {" "}
            {filteredProducts.length} Designs found
          </span>
        </h1>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full lg:w-auto">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold font-cormorant text-[#1C3A2C]">
                Filter Options
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#1C3A2C] text-white rounded-md font-montserrat text-[13px] active:scale-95 transition-all"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
            <p className="hidden sm:block text-[16px] text-[#1C3A2C]">
              Showing 1-{filteredProducts.length} of {products.length} results
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[14px] lg:text-[18px] font-cormorant text-[#1C3A2C] whitespace-nowrap">
              Sort by:
            </span>
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-[200px] lg:w-[240px] h-[40px] lg:h-[48px] bg-[#E9E1C6] border border-[#1C3A2C] rounded px-3 text-sm outline-none cursor-pointer appearance-none"
              >
                <option value="default">Default Sorting</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-3 rounded-lg">
          <span className="text-[15px] font-[600] uppercase text-[#1C3A2C]">
            Active Filter
          </span>
          {[...selectedCategories, ...selectedMaterials, ...selectedColors].map(
            (filter) => (
              <span
                key={filter}
                className="bg-[#002D25] text-white px-3 py-1 text-[10px] flex items-center gap-2 uppercase"
              >
                {filter}
                <button
                  onClick={() => {
                    if (selectedCategories.includes(filter)) toggleCategory(filter);
                    else if (selectedMaterials.includes(filter))
                      toggleMaterial(filter);
                    else toggleColor(filter);
                  }}
                >
                  ✕
                </button>
              </span>
            )
          )}
          {(selectedCategories.length > 0 ||
            selectedColors.length > 0 ||
            selectedMaterials.length > 0) && (
              <button
                onClick={clearAll}
                className="text-xs underline text-gray-400 ml-2"
              >
                Clear ALL
              </button>
            )}
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <FilterSidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            categories={categoryOptions}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            materials={materialOptions}
            selectedMaterials={selectedMaterials}
            onToggleMaterial={toggleMaterial}
            colors={colorOptions}
            selectedColors={selectedColors}
            onToggleColor={toggleColor}
            priceRange={priceRange}
            onPriceChange={{
              onMinChange: handleMinPriceChange,
              onMaxChange: handleMaxPriceChange,
            }}
            minPrice={MIN_LIMIT}
            maxPrice={MAX_LIMIT}
            priceStep={1000}
          />

          {/* Product Grid */}
          <section className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} allproducts={products} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/30 rounded-2xl border-2 border-dashed border-[#CBA135]/30">
                <p className="text-gray-500 italic font-serif text-lg">
                  No designs match your current filters.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-4 text-[#B39055] font-bold underline"
                >
                  Show All Designs
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          {Array.from({ length: pagination.totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => fetchProducts(pageNumber)}
                className={`px-4 py-2 rounded border ${currentPage === pageNumber
                    ? "bg-[#1C3A2C] text-white"
                    : "bg-white text-[#1C3A2C] border-[#1C3A2C]"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* Features Bar */}
      <section className="bg-[#FFF9E9] px-4 sm:px-6 lg:px-12 xl:px-16 py-10 lg:py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <FeatureCard
            icon={shippingIcon}
            title="Free Shipping"
            description="Free Shipping for Order above ₹ 2,000"
          />
          <FeatureCard
            icon={paymentIcon}
            title="Flexible Payment"
            description="Multiple Secure payment Options"
          />
          <FeatureCard
            icon={supportIcon}
            title="24x7 Support"
            description="We Support online all days"
          />
        </div>
      </section>
    </div>
  );
};

export default CollectionPage;