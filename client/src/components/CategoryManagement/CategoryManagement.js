import React, { useState, useRef } from "react";
import { graphQLCommand } from "../../util";

export default function CategoryManagement({ categories, setCategories }) {
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newCategoryID, setNewCategoryID] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [editCategoryID, setEditCategoryID] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [uploadCache, setUploadCache] = useState({});

  const fileInputRef = useRef(null);

  // Generate a unique public_id for Cloudinary to avoid overwriting/caching
  const uploadToCloudinary = async (file) => {
    const maxSize = 10485760; // 10MB in bytes

    if (file.size > maxSize) {
      throw new Error(
        "File size exceeds the 10MB limit. Please upload a smaller file."
      );
    }

    if (uploadCache[file.name]) {
      console.log(`Reusing cached URL for file: ${file.name}`);
      return uploadCache[file.name];
    }

    const publicId = file.name.split(".")[0] + "-" + Date.now();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "scroll_and_shop");
    formData.append("folder", "categories");
    formData.append("public_id", publicId);

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();

    setUploadCache((prev) => ({
      ...prev,
      [file.name]: data.secure_url,
    }));

    return data.secure_url;
  };

  // Helper to preview file (if File) or show URL
  const getPreviewURL = (fileOrUrl) => {
    return fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
  };

  // Add Category
  const addCategory = async () => {
    if (!newName.trim() || !newImage || !newCategoryID.trim()) {
      console.error("All fields are required.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(newImage);

      const mutation = `
        mutation($name: String!, $categoryImage: String!, $categoryID: String!, $description: String!) {
          addCategory(name: $name, categoryImage: $categoryImage, categoryID: $categoryID, description: $description) {
            id
            name
            categoryImage
            categoryID
            description
          }
        }
      `;

      const data = await graphQLCommand(mutation, {
        name: newName,
        categoryImage: imageUrl,
        categoryID: newCategoryID,
        description: newDescription,
      });

      const newCat = {
        _id: data.addCategory.id,
        name: data.addCategory.name,
        categoryImage: data.addCategory.categoryImage,
        categoryID: data.addCategory.categoryID,
        description: data.addCategory.description,
      };

      setCategories((prev) => [...prev, newCat]);

      // Clear form fields
      setNewName("");
      setNewImage(null);
      setNewCategoryID("");
      setNewDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Delete Category
  const deleteCategory = async (catId) => {
    const mutation = `
      mutation($id: ID!) {
        deleteCategory(id: $id) {
          message
        }
      }
    `;
    try {
      await graphQLCommand(mutation, { id: catId });
      setCategories((prev) => prev.filter((c) => c._id !== catId));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Start Edit
  const startEditCategory = (cat) => {
    setEditingId(cat._id);
    setEditCategoryName(cat.name);
    setEditCategoryImage(cat.categoryImage); // This is the existing URL
    setEditCategoryID(cat.categoryID);
    setEditDescription(cat.description);
  };

  // Save Edit
  const saveEditCategory = async () => {
    try {
      let imageUrl = editCategoryImage;

      if (editCategoryImage instanceof File) {
        imageUrl = await uploadToCloudinary(editCategoryImage);
      }

      const mutation = `
        mutation($id: ID!, $name: String!, $categoryImage: String!, $categoryID: String!, $description: String!) {
          updateCategory(
            id: $id
            name: $name
            categoryImage: $categoryImage
            categoryID: $categoryID
            description: $description
          ) {
            id
            name
            categoryImage
            categoryID
            description
          }
        }
      `;

      const variables = {
        id: editingId,
        name: editCategoryName,
        categoryImage: imageUrl,
        categoryID: editCategoryID,
        description: editDescription,
      };

      const data = await graphQLCommand(mutation, variables);

      const updatedCat = {
        _id: data.updateCategory.id,
        name: data.updateCategory.name,
        categoryImage: data.updateCategory.categoryImage,
        categoryID: data.updateCategory.categoryID,
        description: data.updateCategory.description,
      };

      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingId ? updatedCat : cat))
      );

      // Clear edit fields
      setEditingId(null);
      setEditCategoryName("");
      setEditCategoryImage(null);
      setEditCategoryID("");
      setEditDescription("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCategoryName("");
    setEditCategoryImage(null);
    setEditCategoryID("");
    setEditDescription("");
  };

  // Render
  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      {/* Add New Category */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          id="newCategoryImage"
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="border p-2 rounded"
        />

        {/* Preview + Remove for new category image */}
        {newImage && (
          <div className="relative w-20 mt-2">
            <img
              src={getPreviewURL(newImage)}
              alt="Preview"
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => setNewImage(null)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              X
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Category ID"
          value={newCategoryID}
          onChange={(e) => setNewCategoryID(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addCategory}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* List of Categories */}
      <ul className="list-disc pl-6 space-y-4">
        {categories.map((cat) => (
          <li key={cat._id} className="flex flex-col gap-2">
            {editingId === cat._id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="border p-2 rounded"
                />

                {/* If editing image is a File or string, show preview + remove */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  className="border p-2 rounded"
                />
                {editCategoryImage && (
                  <div className="relative w-20 mt-2">
                    <img
                      src={getPreviewURL(editCategoryImage)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setEditCategoryImage(null)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editCategoryID}
                  onChange={(e) => setEditCategoryID(e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEditCategory}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-gray-700">{cat.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={cat.categoryImage}
                    alt={cat.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <button
                    onClick={() => startEditCategory(cat)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
