import React from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/SearchAndFilter.css';

const categories = [
  'All',
  'Antibiotics',
  'Pain Relief',
  'Antiseptic',
  'Vitamins',
  'First Aid',
  'Prescription',
  'Other',
];

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showLowStock,
  onToggleLowStock,
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-filter-grid">
        <div className="search-box">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-options">
          <div className="category-select">
            <Filter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="category-dropdown"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <label className="low-stock-toggle">
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => onToggleLowStock(e.target.checked)}
              className="low-stock-checkbox"
            />
            <span className="low-stock-label">Low Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
