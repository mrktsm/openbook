import React, { useState } from "react";

const SideBar = ({ onSearch, className, onChangeCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("science");

  // Categories with icons for Apple-like appearance
  const categories = [
    { value: "science", label: "Science" },
    { value: "fiction", label: "Fiction" },
    { value: "biography", label: "Biography" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onChangeCategory(category);
  };

  return (
    <div className={`sidebar ${className || ""}`}>
      <div className="sidebar-content">
        {/* Search Bar */}
        <div className="sidebar-section">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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

        {/* Categories List - Apple style uses list, not dropdown */}
        <div className="sidebar-section">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li
                key={category.value}
                className={`category-item ${
                  selectedCategory === category.value ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category.value)}
              >
                <span className="category-label">{category.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apple-style quick links */}
        <div className="sidebar-section">
          <h3>Quick Links</h3>
          <ul className="quick-links">
            <li className="quick-link-item">
              <span className="quick-link-label">Featured</span>
            </li>
            <li className="quick-link-item">
              <span className="quick-link-label">Reading Now</span>
            </li>
            <li className="quick-link-item">
              <span className="quick-link-label">Bookmarks</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
