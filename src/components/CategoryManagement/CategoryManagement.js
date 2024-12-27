import React, { useState } from "react";

const CategoryManagement = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editCategory, setEditCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const startEditCategory = (index) => {
    setEditIndex(index);
    setEditCategory(categories[index]);
  };

  const saveEditCategory = () => {
    const updatedCategories = [...categories];
    updatedCategories[editIndex] = editCategory;
    setCategories(updatedCategories);
    setEditIndex(null);
    setEditCategory("");
  };

  const deleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  return (
    <div className="p-6  bg-gradient-to-r from-blue-100 to-blue-50
          border border-gray-300 
          rounded-lg 
          shadow-md  ">
      <h2 className="text-2xl font-bold  mb-4">Category Management</h2>

      {/* Add New Category */}
      <div className="flex items-center space-x-2 mb-4 ">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={addCategory}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* List of Categories */}
      <ul className="list-disc pl-6 space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex justify-between items-center">
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="border p-2 rounded flex-grow"
                />
                <button
                  onClick={saveEditCategory}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 ml-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditIndex(null)}
                  className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{category}</span>
                <div>
                  <button
                    onClick={() => startEditCategory(index)}
                    className="text-blue-500 hover:underline ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(index)}
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
};

export default CategoryManagement;
