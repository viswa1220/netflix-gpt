import React, { useState } from "react";
import { graphQLCommand } from "../../util";

export default function CategoryManagement({ categories, setCategories }) {
  // Local states for adding/editing
  const [newName, setNewName] = useState("");

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Add a new category
  const addCategory = async () => {
    if (!newName.trim()) return;
    const mutation = `
      mutation($name: String!) {
        addCategory(name: $name) {
          id
          name
        }
      }
    `;
    try {
      const data = await graphQLCommand(mutation, { name: newName });
      // Convert {id, name} to {_id, name}
      const newCat = { _id: data.addCategory.id, name: data.addCategory.name };
      // Update parent's categories state
      setCategories((prev) => [...prev, newCat]);
      setNewName("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Delete category
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
      // Remove from parent's array
      setCategories((prev) => prev.filter((c) => c._id !== catId));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Start editing a category
  const startEditCategory = (cat) => {
    setEditingId(cat._id);
    setEditCategoryName(cat.name);
  };

  // Save edited category name
  const saveEditCategory = async () => {
    const mutation = `
      mutation($id: ID!, $name: String!) {
        updateCategory(id: $id, name: $name) {
          id
          name
        }
      }
    `;
    try {
      const data = await graphQLCommand(mutation, {
        id: editingId,
        name: editCategoryName,
      });
      // Convert {id, name} => {_id, name}
      const updatedCat = {
        _id: data.updateCategory.id,
        name: data.updateCategory.name,
      };
      // Replace the old item with updatedCat
      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingId ? updatedCat : cat))
      );
      setEditingId(null);
      setEditCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCategoryName("");
  };

  return (
    <div
      className="
        p-6 
        bg-gradient-to-r 
        from-blue-100 
        to-blue-50
        border 
        border-gray-300 
        rounded-lg 
        shadow-md
      "
    >
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      {/* Add New Category */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="New Category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={addCategory}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* List of Categories (Name + Edit + Delete) */}
      <ul className="list-disc pl-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center">
            {editingId === cat._id ? (
              // If we're editing this category
              <div className="flex items-center gap-2 flex-grow">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="border p-2 rounded flex-grow"
                />
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
            ) : (
              // Normal display
              <>
                <span>{cat.name}</span>
                <div>
                  <button
                    onClick={() => startEditCategory(cat)}
                    className="text-blue-500 hover:underline ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
