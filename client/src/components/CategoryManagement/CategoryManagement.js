import React, { useState, useRef } from "react";
import { graphQLCommand } from "../../util";

export default function CategoryManagement({ categories, setCategories }) {
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newCategoryID, setNewCategoryID] = useState("");
  const [newDescription, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [editCategoryID, setEditCategoryID] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [uploadCache, setUploadCache] = useState({});

  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const maxSize = 10485760; // 10MB in bytes

    // Check if file size exceeds the limit
    if (file.size > maxSize) {
      throw new Error(
        "File size exceeds the 10MB limit. Please upload a smaller file."
      );
    }
    if (uploadCache[file.name]) {
      console.log(`Reusing cached URL for file: ${file.name}`);
      return uploadCache[file.name];
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "scroll_and_shop");
    formData.append("folder", "categories");

    const publicId = file.name.split(".")[0];
    formData.append("public_id", publicId);
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME

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

    // Cache the URL for this file
    setUploadCache((prev) => ({
      ...prev,
      [file.name]: data.secure_url,
    }));

    return data.secure_url;
  };

  const addCategory = async () => {
    if (!newName.trim() || !newImage || !newCategoryID.trim()) {
      console.error("All fields are required.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(newImage);

      const mutation = `
        mutation($name: String!, $categoryImage: String!, $categoryID: String!,$description:String!) {
          addCategory(name: $name, categoryImage: $categoryImage, categoryID: $categoryID,description:$description) {
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
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

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
      setCategories((prev) => prev.filter((c) => c._id !== catId)); // Remove deleted category from state
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const startEditCategory = (cat) => {
    setEditingId(cat._id);
    setEditCategoryName(cat.name);
    setEditCategoryImage(cat.categoryImage);
    setEditCategoryID(cat.categoryID);
    setEditDescription(cat.description);
  };

  const saveEditCategory = async () => {
    try {
      let imageUrl = editCategoryImage;

      if (editCategoryImage instanceof File) {
        imageUrl = await uploadToCloudinary(editCategoryImage);
      }

      const mutation = `
        mutation($id: ID!, $name: String!, $categoryImage: String!, $categoryID: String!,$description:String!) {
          updateCategory(id: $id, name: $name, categoryImage: $categoryImage, categoryID: $categoryID,description:$description) {
            id
            name
            categoryImage
            categoryID,
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
      };

      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingId ? updatedCat : cat))
      );

      // Clear form fields
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
          onChange={(e) => setDescription(e.target.value)}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  className="border p-2 rounded"
                />
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
                <span>{cat.name}</span>
                <div className="flex gap-2">
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
