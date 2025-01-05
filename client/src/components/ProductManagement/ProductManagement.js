import React, { useState } from "react";
import CSVUpload from "../CsvUpload/CSVUpload";
// 1) Import your graphQLCommand function
import { graphQLCommand } from "../../util"; // Adjust path if needed

// 2) Define the GraphQL mutation string for adding a product
const ADD_PRODUCT_MUTATION = `
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      name
      price
      availableCount
      offer
      productCategory {
        id
        name
      }
      description
      features
      colors {
        color
        image
      }
      mainImage
      sliderImages
      video
      sizes
  Brand
  gender
      saleStatus
      trendingStatus
    }
  }
`;

const ProductManagement = ({ categories }) => {
  // State for product form
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
    Brand: "",
    gender:"",
    saleStatus: false,
    trendingStatus: false,
  });

  // Loader state (for spinner overlay)
  const [loading, setLoading] = useState(false);

  /**
   * uploadCache: { [fileName]: "https://..." }
   * A simple filename-based cache to avoid re-uploading the same file.
   */
  const [uploadCache, setUploadCache] = useState({});

  /**
   * Upload a file to Cloudinary, unless we already cached this exact filename.
   */
  const uploadToCloudinary = async (
    file,
    uploadPreset = "scroll_and_shop",
    cloudName = "dhpdhm86p",
    resourceType = "image"
  ) => {
    // 1) If we've already uploaded a file with this exact name, reuse the URL.
    if (uploadCache[file.name]) {
      console.log(`Reusing cached URL for file: ${file.name}`);
      return uploadCache[file.name];
    }

    // 2) Otherwise, upload it.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "scroll_and_shop"); // optional folder

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }
    const data = await response.json();

    // 3) Store the secure_url in the cache so we don't re-upload this filename
    setUploadCache((prev) => ({
      ...prev,
      [file.name]: data.secure_url,
    }));

    return data.secure_url;
  };

  // Handle text or numeric input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle single-file inputs (mainImage, video, etc.)
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setProduct((prev) => ({ ...prev, [key]: file }));
  };

  // Handle multiple files for sliderImages
  const handleSliderImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, sliderImages: files }));
  };

  // Handle colors array (color + image)
  const handleColorChange = (index, key, value) => {
    const updatedColors = [...product.colors];
    updatedColors[index][key] = value;
    setProduct((prev) => ({ ...prev, colors: updatedColors }));
  };

  const handleAddColor = () => {
    setProduct((prev) => ({
      ...prev,
      colors: [...prev.colors, { color: "", image: null }],
    }));
  };

  // Handle features array
  const handleFeatureChange = (index, value) => {
    const updated = [...product.features];
    updated[index] = value;
    setProduct((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleSave = async () => {
    setLoading(true); // show loader/spinner
    try {
      // Validate selected category
      if (!categories.some((cat) => cat._id === product.productCategory)) {
        alert("Invalid category selected. Please select a valid category.");
        setLoading(false);
        return;
      }
  
      // Make a copy so we can mutate the final URLs
      const finalProduct = { ...product };
  
      // Upload mainImage if it's a File
      if (finalProduct.mainImage instanceof File) {
        const url = await uploadToCloudinary(
          finalProduct.mainImage,
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
          process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          "image"
        );
        finalProduct.mainImage = url;
      }
  
      // Upload sliderImages
      if (
        Array.isArray(finalProduct.sliderImages) &&
        finalProduct.sliderImages.length > 0
      ) {
        // Filter out any existing string URLs
        const sliderFiles = finalProduct.sliderImages.filter(
          (img) => img instanceof File
        );
        if (sliderFiles.length > 0) {
          // Upload them in parallel
          const uploadPromises = sliderFiles.map((file) =>
            uploadToCloudinary(
              file,
              process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
              process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
              "image"
            )
          );
          const sliderUrls = await Promise.all(uploadPromises);
          // Keep any already-string URLs
          const existing = finalProduct.sliderImages.filter(
            (img) => typeof img === "string"
          );
          finalProduct.sliderImages = [...existing, ...sliderUrls];
        }
      }
  
      // Upload color images
      if (Array.isArray(finalProduct.colors)) {
        const updatedColors = [];
        for (const colorObj of finalProduct.colors) {
          if (colorObj.image instanceof File) {
            const url = await uploadToCloudinary(
              colorObj.image,
              process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
              process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
              "image"
            );
            updatedColors.push({ color: colorObj.color, image: url });
          } else {
            // If it's already a string or null, keep it
            updatedColors.push(colorObj);
          }
        }
        finalProduct.colors = updatedColors;
      }
  
      // Upload video if it's a File
      if (finalProduct.video instanceof File) {
        const uploadedVideoUrl = await uploadToCloudinary(
          finalProduct.video,
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
          process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          "video"
        );
        finalProduct.video = uploadedVideoUrl;
      }
  
      console.log("Final Product to Save:", finalProduct);
  
      // Build the input object for the GraphQL mutation
      const productInput = {
        name: finalProduct.name,
        price: parseFloat(finalProduct.price) || 0,
        availableCount: parseInt(finalProduct.availableCount, 10) || 0,
        offer: finalProduct.offer || "",
        productCategory: finalProduct.productCategory || "",
        description: finalProduct.description || "",
        features: finalProduct.features.filter((f) => f.trim() !== ""),
        colors: finalProduct.colors.map((c) => ({
          color: c.color || "",
          image: c.image || "",
        })),
        mainImage: finalProduct.mainImage || "",
        sliderImages: finalProduct.sliderImages,
        video: finalProduct.video || "",
        sizes: finalProduct.sizes,
        Brand: finalProduct.Brand,
        gender: finalProduct.gender,
        saleStatus: finalProduct.saleStatus,
        trendingStatus: finalProduct.trendingStatus,
      };
  
      const variables = { input: productInput };
      const responseData = await graphQLCommand(
        ADD_PRODUCT_MUTATION,
        variables
      );
  
      console.log("Response from server (addProduct):", responseData);
      alert("Product saved successfully!");
  
      // Clear the form fields
      setProduct({
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
        Brand: "",
        gender: "",
        saleStatus: false,
        trendingStatus: false,
      });
    } catch (error) {
      console.error("Error uploading or saving:", error);
      alert("Failed to save product. Check console for details.");
    } finally {
      setLoading(false); // hide loader
    }
  };
  
  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-gray-300 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      {/* Loader Overlay if loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          {/* Simple spinner */}
          <div className="loader border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin"></div>
        </div>
      )}

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

        {/* Category Dropdown */}
        <select
          name="productCategory"
          value={product.productCategory}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
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
              {index === product.features.length - 1 && (
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  +
                </button>
              )}
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
          <label className="block font-semibold mb-2">
            Slider Images (At least 2)
          </label>
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

        <input type="text"
          name="Brand"
          placeholder="Brand Name"
          value={product.Brand}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"/>
          <select
          name="gender"
          value={product.gender}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 w-full"
          required
        >
          <option value="Unisex">Unisex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Sizes */}
        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma-separated)"
          value={product.sizes.join(", ")}
          onChange={(e) =>
            setProduct({
              ...product,
              sizes: e.target.value.split(", ").map((s) => s.trim()),
            })
          }
          className="border p-2 rounded col-span-1 md:col-span-2 w-full"
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
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>

      {/* CSVUpload component */}
      <CSVUpload />
    </div>
  );
};

export default ProductManagement;
