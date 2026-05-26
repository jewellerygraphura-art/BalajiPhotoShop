// src/components/admin/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { axiosPostService, axiosPutService } from "../../services/axios";

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    productCollection: "",
    brand: "",
    sku: "",
    additionalInfo: "",
    description: "",
    productFor: "both",
    price: { mrp: "", sale: "" },
    stockStatus: "In Stock",
    status: false,
    attributes: {
      purity: [],
      gemstone: "",
      color: "",
      material: "",
      weight: "",
    },
    variants: [],

    // FIX: separate images
    productImage: [],      // File objects only
    existingImages: [],    // URLs only
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        ...product,
        existingImages: product.productImage || [],
        productImage: []
      }));
      setImagePreviews(product.productImage || []);
    }
  }, [product]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("price")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        price: { ...prev.price, [key]: value },
      }));
    } else if (name.includes("attributes")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        attributes: { ...prev.attributes, [key]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePurityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, purity: e.target.value.split(",") },
    }));
  };

  // IMAGE UPLOAD (Files only)
  const handleImageUpload = (e) => {
    const files = [...e.target.files];
    const previews = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      productImage: [...prev.productImage, ...files],
    }));

    setImagePreviews(prev => [...prev, ...previews]);
  };

  // REMOVE IMAGE (existing or new)
  const removeImage = (index) => {
    const isExisting = index < formData.existingImages.length;

    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      const fileIndex = index - formData.existingImages.length;
      setFormData(prev => ({
        ...prev,
        productImage: prev.productImage.filter((_, i) => i !== fileIndex),
      }));
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // VARIANTS
  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants,
      { purity: "", weight: "", quantity: "", price: "", sale: "" }
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) return; // prevent multiple clicks

    // Validate variants
    if (formData.variants.length === 0) {
      alert("Please add at least one variant.");
      return;
    }

    setIsSaving(true);

    try {
      const cleanedVariants = formData.variants.map(v => ({
        purity: v.purity,
        weight: Number(v.weight),
        quantity: Number(v.quantity),
        price: Number(v.price),
        sale: Number(v.sale),
      }));

      if (product) {

        const apiPriceResponse = await axiosPutService("/admin/product/price", {
          productId: product._id,
          mrp: Number(formData?.price?.mrp),
          sale: Number(formData?.price?.sale),
        });

        if (!apiPriceResponse.ok) {
          alert(apiPriceResponse.data.message || "Price not update.");
          setIsSaving(false);
          return;
        }

        const apiQuantityResponse = await axiosPutService("/admin/product/quantity", {
          productId: product._id,
          variants: cleanedVariants,
          status: formData.status
        });

        if (!apiQuantityResponse.ok) {
          alert(apiQuantityResponse.data.message || "Quantity not update.");
          setIsSaving(false);
          return;
        }

        onSuccess();
        return;
      }

      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("category", formData.category);
      fd.append("productCollection", formData.productCollection);
      fd.append("brand", formData.brand);
      fd.append("sku", formData.sku);
      fd.append("description", formData.description);
      fd.append("additionalInfo", formData.additionalInfo);
      fd.append("stockStatus", formData.stockStatus);
      fd.append("status", formData.status);
      fd.append("price", JSON.stringify(formData.price));
      fd.append("attributes", JSON.stringify(formData.attributes));
      fd.append("variants", JSON.stringify(cleanedVariants));
      fd.append("productFor", formData.productFor);

      fd.append("productImage", JSON.stringify(formData.existingImages));

      formData.productImage.forEach(file => {
        fd.append("productImage", file);
      });

      const apiResponse = await axiosPostService(
        "/admin/product/addProduct",
        fd
      );

      if (apiResponse.ok) {
        onSuccess(apiResponse.data.data);
      } else {
        alert(apiResponse.data.message);
      }

    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/10 flex justify-center items-start pt-10 z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-indigo-600">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Basic Info Card --- */}
          <div className="p-5 border-l-4 border-indigo-500 rounded-lg shadow-sm bg-indigo-50 space-y-4">
            <h3 className="font-semibold text-lg text-indigo-700 mb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Product Name",
                  name: "name",
                  type: "text",
                  placeholder: "Enter product name",
                },
                {
                  label: "Category",
                  name: "category",
                  type: "text",
                  placeholder: "Enter category",
                },
                {
                  label: "Collection",
                  name: "productCollection",
                  type: "text",
                  placeholder: "Enter collection",
                },
                {
                  label: "Brand",
                  name: "brand",
                  type: "text",
                  placeholder: "Enter brand",
                },
                {
                  label: "SKU",
                  name: "sku",
                  type: "text",
                  placeholder: "Enter SKU",
                },
              ].map((field, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="font-medium text-indigo-800 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-indigo-800 mb-1">
                Gender
              </label>
              <select
                name="productFor"
                value={formData.productFor}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="both">Both</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="kid">Kid</option>
              </select>
            </div>
          </div>

          {/* --- Price & Stock Card --- */}
          <div className="p-5 border-l-4 border-green-500 rounded-lg shadow-sm bg-green-50 space-y-4">
            <h3 className="font-semibold text-lg text-green-700 mb-2">
              Pricing & Stock
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="font-medium text-green-800 mb-1">MRP</label>
                <input
                  type="number"
                  name="price.mrp"
                  value={formData.price.mrp}
                  onChange={handleChange}
                  placeholder="MRP"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-green-800 mb-1">
                  Sale Price
                </label>
                <input
                  type="number"
                  name="price.sale"
                  value={formData.price.sale}
                  onChange={handleChange}
                  placeholder="Sale Price"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-green-800 mb-1">
                  Stock Status
                </label>
                <select
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Attributes Card --- */}
          <div className="p-5 border-l-4 border-purple-500 rounded-lg shadow-sm bg-purple-50 space-y-4">
            <h3 className="font-semibold text-lg text-purple-700 mb-2">
              Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Gemstone",
                  name: "attributes.gemstone",
                  type: "text",
                  value: formData.attributes.gemstone,
                },
                {
                  label: "Color",
                  name: "attributes.color",
                  type: "text",
                  value: formData.attributes.color,
                },
                {
                  label: "Material",
                  name: "attributes.material",
                  type: "text",
                  value: formData.attributes.material,
                },
                {
                  label: "Weight",
                  name: "attributes.weight",
                  type: "number",
                  value: formData.attributes.weight,
                },
                {
                  label: "Purity",
                  name: "attributes.purity",
                  type: "text",
                  value: formData.attributes.purity.join(","),
                },
              ].map((field, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="font-medium text-purple-800 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      field.name.includes("purity")
                        ? formData.attributes.purity.join(",")
                        : field.value
                    }
                    onChange={
                      field.name.includes("purity")
                        ? handlePurityChange
                        : handleChange
                    }
                    placeholder={`Enter ${field.label}`}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- Variants Card --- */}
          <div className="p-5 border-l-4 border-yellow-500 rounded-lg shadow-sm bg-yellow-50 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-yellow-700">
                Variants
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
              >
                <Plus size={18} /> Add Variant
              </button>
            </div>
            <div className="space-y-2">
              {formData.variants.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end"
                >
                  <input
                    type="text"
                    placeholder="Purity"
                    value={v.purity}
                    onChange={(e) =>
                      handleVariantChange(idx, "purity", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Weight"
                    value={v.weight}
                    onChange={(e) =>
                      handleVariantChange(idx, "weight", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={v.quantity}
                    onChange={(e) =>
                      handleVariantChange(idx, "quantity", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(idx, "price", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Sale"
                    value={v.sale}
                    onChange={(e) =>
                      handleVariantChange(idx, "sale", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Short Description & Description --- */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-indigo-800 mb-1">
                Short Description
              </label>
              <input
                type="text"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Short summary of the product"
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-indigo-800 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description"
                rows={4}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300 resize-none"
              />
            </div>
          </div>

          {/* --- Images Card --- */}
          <div className="p-5 border-l-4 border-pink-500 rounded-lg shadow-sm bg-pink-50 space-y-2">
            <h3 className="font-semibold text-lg text-pink-700 mb-2">
              Product Images
            </h3>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {imagePreviews.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded overflow-hidden border"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.status}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, status: e.target.checked }))
              }
              className="w-4 h-4 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-700">Status</label>
          </div>

          {/* --- Actions --- */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2 rounded text-white 
  ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {isSaving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
