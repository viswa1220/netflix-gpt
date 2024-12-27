import React, { useState } from "react";
import CSVUpload from "../CsvUpload/CSVUpload";

const ProductManagement = ({ categories }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    availableCount: "",
    offer: "",
    productCategory: "",
    description: "",
    features: [""],
    colors: [{ color: "", image: null }],
    mainImage: null,
    sliderImages: [],
    video: null,
    sizes: [],
    rating: "",
    saleStatus: false,
    trendingStatus: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setProduct({ ...product, [key]: file });
  };

  const handleSliderImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, sliderImages: files });
  };

  const handleColorChange = (index, key, value) => {
    const updatedColors = [...product.colors];
    updatedColors[index][key] = value;
    setProduct({ ...product, colors: updatedColors });
  };

  const handleAddColor = () => {
    setProduct({ ...product, colors: [...product.colors, { color: "", image: null }] });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...product.features];
    updatedFeatures[index] = value;
    setProduct({ ...product, features: updatedFeatures });
  };

  const addFeature = () => {
    setProduct({ ...product, features: [...product.features, ""] });
  };

  const handleSave = () => {
    console.log("Product Saved:", product);
    // Integrate Firebase or backend logic here
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Available Count */}
        <input
          type="number"
          name="availableCount"
          placeholder="Available Count"
          value={product.availableCount}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Offer */}
        <input
          type="text"
          name="offer"
          placeholder="Offer (e.g., 20%)"
          value={product.offer}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Product Category */}
        <select
          name="productCategory"
          value={product.productCategory}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-1 md:col-span-2 w-full"
        />

        {/* Features */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Features</label>
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                className="border p-2 rounded flex-grow"
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-semibold mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "mainImage")}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Slider Images */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Slider Images (At least 2)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSliderImagesChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Colors and Images */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Colors and Images</label>
          {product.colors.map((colorObj, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Color Name"
                value={colorObj.color}
                onChange={(e) =>
                  handleColorChange(index, "color", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleColorChange(index, "image", e.target.files[0])
                }
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Color
          </button>
        </div>

        {/* Video */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Sizes */}
        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma-separated)"
          value={product.sizes.join(", ")}
          onChange={(e) =>
            setProduct({ ...product, sizes: e.target.value.split(", ") })
          }
          className="border p-2 rounded col-span-1 md:col-span-2 w-full"
        />

        {/* Rating */}
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={product.rating}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Sale Status */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">On Sale</label>
          <input
            type="checkbox"
            name="saleStatus"
            checked={product.saleStatus}
            onChange={(e) =>
              setProduct({ ...product, saleStatus: e.target.checked })
            }
          />
        </div>

        {/* Trending Status */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">Trending</label>
          <input
            type="checkbox"
            name="trendingStatus"
            checked={product.trendingStatus}
            onChange={(e) =>
              setProduct({ ...product, trendingStatus: e.target.checked })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 col-span-1 md:col-span-2 w-full"
        >
          Save Product
        </button>
      </div>

      <CSVUpload />
    </div>
  );
};

export default ProductManagement;
