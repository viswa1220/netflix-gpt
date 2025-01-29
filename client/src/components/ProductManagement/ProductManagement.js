import React, { useState } from "react";
import CSVUpload from "../CsvUpload/CSVUpload";
import { graphQLCommand } from "../../util"; // Adjust path if needed

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
    mainImage: null,
    sliderImages: [],
    video: null,
    sizes: [],
    Brand: "",
    gender: "Unisex", // Default
    saleStatus: false,
    trendingStatus: false,
  });

  // Loader state (for spinner overlay)
  const [loading, setLoading] = useState(false);

  // -- Upload to Cloudinary helper function --
  const uploadToCloudinary = async (
    file,
    uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
    cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    resourceType = "image",
    customPublicId = null
  ) => {
    // Generate unique public_id to avoid overwriting or caching
    const publicId = customPublicId || file.name.split(".")[0] + "-" + Date.now();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "scroll_and_shop");
    formData.append("public_id", publicId);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // -- Handle text or numeric input changes --
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // -- Handle single-file inputs (mainImage, video, etc.) --
  const handleFileChange = (e, key, resourceType = "image") => {
    const file = e.target.files[0];
    setProduct((prev) => ({ ...prev, [key]: file }));
  };

  // -- Remove mainImage before saving --
  const removeMainImage = () => {
    setProduct((prev) => ({ ...prev, mainImage: null }));
  };

  // -- Handle multiple files for sliderImages (APPEND instead of replace) --
  const handleSliderImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setProduct((prev) => ({
      ...prev,
      sliderImages: [...prev.sliderImages, ...newFiles],
    }));
  };

  // -- Remove one slider image by index --
  const removeSliderImage = (index) => {
    setProduct((prev) => {
      const updated = [...prev.sliderImages];
      updated.splice(index, 1);
      return { ...prev, sliderImages: updated };
    });
  };

  // -- Remove video before saving --
  const removeVideo = () => {
    setProduct((prev) => ({ ...prev, video: null }));
  };

  // -- Preview helper: if it's a File, return object URL; if string, assume it is a URL
  const getPreviewURL = (fileOrUrl) => {
    return fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
  };

  // -- Save (upload + GraphQL) --
  const handleSave = async () => {
    setLoading(true); // show loader/spinner
    try {
      // Validate selected category
      if (
        product.productCategory &&
        !categories.some((cat) => cat._id === product.productCategory)
      ) {
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

      // Upload slider images (append newly uploaded URLs + keep existing strings)
      if (
        Array.isArray(finalProduct.sliderImages) &&
        finalProduct.sliderImages.length > 0
      ) {
        // Filter out any File objects
        const sliderFiles = finalProduct.sliderImages.filter(
          (img) => img instanceof File
        );
        if (sliderFiles.length > 0) {
          const uploadPromises = sliderFiles.map((file) =>
            uploadToCloudinary(
              file,
              process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
              process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
              "image"
            )
          );
          const sliderUrls = await Promise.all(uploadPromises);

          // Keep existing string URLs in the array
          const existingUrls = finalProduct.sliderImages.filter(
            (img) => typeof img === "string"
          );

          // Combine existing URLs with newly uploaded ones
          finalProduct.sliderImages = [...existingUrls, ...sliderUrls];
        }
      }

      // Upload video if present
      if (finalProduct.video instanceof File) {
        const uploadedVideoUrl = await uploadToCloudinary(
          finalProduct.video,
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
          process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          "video"
        );
        finalProduct.video = uploadedVideoUrl;
      }

      // Build the input object for the GraphQL mutation
      const productInput = {
        name: finalProduct.name,
        price: parseFloat(finalProduct.price) || 0,
        availableCount: parseInt(finalProduct.availableCount, 10) || 0,
        offer: finalProduct.offer || "",
        productCategory: finalProduct.productCategory || "",
        description: finalProduct.description || "",
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
      const responseData = await graphQLCommand(ADD_PRODUCT_MUTATION, variables);

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
        mainImage: null,
        sliderImages: [],
        video: null,
        sizes: [],
        Brand: "",
        gender: "Unisex",
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

        {/* Main Image */}
        <div>
          <label className="block font-semibold mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "mainImage")}
            className="border p-2 rounded w-full"
          />

          {/* Preview + Remove Button */}
          {product.mainImage && (
            <div className="relative mt-2 inline-block">
              <img
                src={getPreviewURL(product.mainImage)}
                alt="Main Preview"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          )}
        </div>

        {/* Slider Images (APPEND NEW FILES) */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Slider Images (At least 2)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSliderImagesChange}
            className="border p-2 rounded w-full"
          />

          {/* Previews + Remove Button for Each Slider Image */}
          <div className="flex flex-wrap gap-2 mt-2">
            {product.sliderImages.map((img, idx) => (
              <div key={idx} className="relative inline-block">
                <img
                  src={getPreviewURL(img)}
                  alt={`Slider Preview ${idx}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeSliderImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video", "video")}
            className="border p-2 rounded w-full"
          />

          {/* Video Preview + Remove Button */}
          {product.video && (
            <div className="relative mt-2 inline-block">
              <video
                src={getPreviewURL(product.video)}
                controls
                className="w-40 h-auto rounded"
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          )}
        </div>

        {/* Brand */}
        <input
          type="text"
          name="Brand"
          placeholder="Brand Name"
          value={product.Brand}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />

        {/* Gender */}
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
          <option value="Kids">Kids</option>
        </select>

        {/* Sizes (comma-separated) */}
        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma-separated)"
          value={product.sizes.join(", ")}
          onChange={(e) =>
            setProduct({
              ...product,
              sizes: e.target.value.split(",").map((s) => s.trim()),
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

     
    </div>
  );
};

export default ProductManagement;
