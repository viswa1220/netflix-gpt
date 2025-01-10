import React from "react";

const FilterComponent = ({
  categories = [],
  brands = [],
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap items-center gap-4">
      {/* Category Dropdown */}
      {/*  <select
        className="border p-2 rounded-md w-full sm:w-auto"
        value={filters.category}
        onChange={(e) => onFilterChange("category", e.target.value)}
      >
        <option value="All">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select> */}

      {/* Brand Dropdown */}
      <select
        className="border p-2 rounded-md w-full sm:w-auto"
        value={filters.brand}
        onChange={(e) => onFilterChange("brand", e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-1 rounded-md w-[120px]"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />

      {/* Price Range */}
      {/*  <div className="flex items-center gap-2">
        <span>₹{filters.priceRange[0]}</span>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={filters.priceRange[1]}
          className="w-full sm:w-auto"
          onChange={(e) =>
            onFilterChange("priceRange", [
              filters.priceRange[0],
              Number(e.target.value),
            ])
          }
        />
        <span>₹{filters.priceRange[1]}</span>
      </div> */}
    </div>
  );
};

export default FilterComponent;
