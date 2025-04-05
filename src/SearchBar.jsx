import React, { useState } from "react";
import "./App.css"; // Make sure to create this CSS file

const Sidebar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("science");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // You can add category filter functionality here
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo/Title */}
        <div className="logo-container">
          <h2>Bookshelf</h2>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <h3>Search</h3>
          <form onSubmit={handleSearchSubmit} className="search-container">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        {/* Categories Filter */}
        <div className="categories-section">
          <h3>Categories</h3>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="science">Science</option>
            <option value="fiction">Fiction</option>
            <option value="fantasy">Fantasy</option>
            <option value="mystery">Mystery</option>
            <option value="biography">Biography</option>
            <option value="history">History</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
