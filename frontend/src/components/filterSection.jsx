import React from "react";
import { X } from "lucide-react"; // Make sure to have lucide-react installed

// Main Filter Section Wrapper
export const FilterSection = ({ title, children }) => (
  <div className="mb-10">
    <h3 className="text-[20px] leading-[26px] font-medium font-cormorant text-[#1C3A2C] mb-6 uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

// Divider Component
export const Divider = () => (
  <div className="h-px bg-[#CBA135]/30 my-8" />
);

export const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-3.5 cursor-pointer group mb-4 last:mb-0 select-none">
      <input 
        type="checkbox"
        className="hidden" 
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-[22px] h-[22px] border-2 border-[#CBA135] rounded-sm flex items-center justify-center shrink-0 transition-all ${
          checked ? "bg-[#1C3A2C] border-[#1C3A2C]" : "bg-transparent"
        }`}>
        {checked && (
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-[16px] leading-[22px] font-normal font-montserrat text-[#1C3A2C] group-hover:text-[#CBA135] transition-colors">
        {label}
      </span>
    </label>
  );
};

export const RadioButton = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-3.5 cursor-pointer group mb-4 last:mb-0 select-none">
      <input type="radio" className="hidden" checked={checked} onChange={onChange} />
      <div className="w-[22px] h-[22px] border-2 rounded-full flex items-center justify-center shrink-0 border-[#CBA135]">
        {checked && <div className="w-[11px] h-[11px] rounded-full bg-[#1C3A2C]" />}
      </div>
      <span className="text-[16px] leading-[22px] font-normal font-montserrat text-[#1C3A2C] group-hover:text-[#CBA135] transition-colors">
        {label}
      </span>
    </label>
  );
};

export const DualRangeSlider = ({ min, max, step, values, onMinChange, onMaxChange, setDraggingHandle }) => {
  const minPercent = ((values[0] - min) / (max - min)) * 100;
  const maxPercent = ((values[1] - min) / (max - min)) * 100;

  return (
    <div className="relative h-6 mt-3 flex items-center">
      <div className="absolute w-full h-1.5 bg-[#D4AF77]/40 rounded-full" />
      <div className="absolute h-1.5 bg-[#1C3A2C] rounded-full z-10" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
      <input
        type="range" min={min} max={max} step={step} value={values[0]} onChange={onMinChange}
        onMouseDown={() => setDraggingHandle("min")} onMouseUp={() => setDraggingHandle(null)}
        className="absolute w-full h-0 appearance-none bg-transparent pointer-events-none z-30 cursor-pointer slider-thumb-custom"
      />
      <input
        type="range" min={min} max={max} step={step} value={values[1]} onChange={onMaxChange}
        onMouseDown={() => setDraggingHandle("max")} onMouseUp={() => setDraggingHandle(null)}
        className="absolute w-full h-0 appearance-none bg-transparent pointer-events-none z-20 cursor-pointer slider-thumb-custom"
      />
      <style jsx>{`
        .slider-thumb-custom::-webkit-slider-thumb {
          appearance: none; pointer-events: auto; width: 20px; height: 20px;
          background: #1C3A2C; border: 2px solid #FFF9EA; border-radius: 50%;
          cursor: grab; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-thumb-custom::-moz-range-thumb {
          pointer-events: auto; width: 20px; height: 20px;
          background: #1C3A2C; border: 2px solid #FFF9EA; border-radius: 50%;
          cursor: grab;
        }
      `}</style>
    </div>
  );
};

// --- RESPONSIVE SIDEBAR COMPONENT ---
export const FilterSidebar = ({
  isOpen,           
  onClose,          
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  materials = [],
  selectedMaterials = [],
  onToggleMaterial,
  colors = [],
  selectedColors = [],
  onToggleColor,
  priceRange = [2500, 345000],
  onPriceChange,
  minPrice = 2500,
  maxPrice = 345000,
  priceStep = 1000,
  setDraggingHandle,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        /* Layout Logic */
        fixed inset-y-0 left-0 z-[70] w-[300px] sm:w-[350px] bg-[#FFF9EA] p-8 
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        
        /* Desktop Reset */
        lg:relative lg:translate-x-0 lg:w-72 xl:w-80 lg:z-0 lg:p-0 lg:bg-transparent
        h-full overflow-y-auto lg:overflow-visible
      `}>
        
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h2 className="text-2xl font-cormorant font-bold text-[#1C3A2C]">FILTERS</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#CBA135]/10 rounded-full">
            <X size={24} className="text-[#1C3A2C]" />
          </button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <>
            <FilterSection title="Categories">
              <div className="flex flex-col">
                {categories.map((category) => (
                  <Checkbox
                    key={category}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => onToggleCategory(category)}
                  />
                ))}
              </div>
            </FilterSection>
            <Divider />
          </>
        )}

        {/* Price */}
        <FilterSection title="Prices">
          <p className="text-[16px] leading-[22px] font-medium font-montserrat text-[#1C3A2C] mb-5">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </p>
          <DualRangeSlider
            min={minPrice} max={maxPrice} step={priceStep} values={priceRange}
            onMinChange={onPriceChange.onMinChange}
            onMaxChange={onPriceChange.onMaxChange}
            setDraggingHandle={setDraggingHandle}
          />
        </FilterSection>

        <Divider />

        {/* Colors */}
        {colors.length > 0 && (
          <>
            <FilterSection title="Color">
              <div className="flex flex-col">
                {colors.map((color) => (
                  <Checkbox
                    key={color}
                    label={color}
                    checked={selectedColors.includes(color)}
                    onChange={() => onToggleColor(color)}
                  />
                ))}
              </div>
            </FilterSection>
            <Divider />
          </>
        )}

        {/* Materials */}
        {materials.length > 0 && (
          <FilterSection title="Material">
            <div className="flex flex-col">
              {materials.map((material) => (
                <Checkbox
                  key={material}
                  label={material}
                  checked={selectedMaterials.includes(material)}
                  onChange={() => onToggleMaterial(material)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Mobile Bottom Action */}
        <div className="mt-8 lg:hidden">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#1C3A2C] text-white font-montserrat font-bold rounded-lg shadow-lg"
          >
            VIEW RESULTS
          </button>
        </div>
      </aside>
    </>
  );
};