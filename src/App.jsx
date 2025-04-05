import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf";
import "./App.css";
import ScrollButton from "./ScrollButton";
import SideBar from "./SideBar";

const BOOKS_PER_PAGE = 8;
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/128x192.png?text=No+Cover";

function App() {
  const [state, setState] = useState({
    currentBooks: [], // Books currently displayed
    cachedBooks: {}, // Cached books by offset
    offset: 0, // Current offset for pagination
    category: "science", // Current category
    isLoading: false, // Loading state
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch books for a given offset and category
  const fetchBooks = async (offset, category) => {
    // Check cache first
    if (state.cachedBooks[offset]) {
      return state.cachedBooks[offset];
    }

    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/${category}.json?limit=${BOOKS_PER_PAGE}&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.works || [];
    } catch (error) {
      console.error(`Failed to fetch books for offset ${offset}:`, error);
      return [];
    }
  };

  // Update state with new books and cache
  const updateBooks = (offset, books) => {
    setState((prev) => ({
      ...prev,
      currentBooks: books,
      cachedBooks: { ...prev.cachedBooks, [offset]: books },
      offset,
      isLoading: false,
    }));
  };

  // Load books for the current offset and prefetch the next page
  const loadPage = async (newOffset, newCategory) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const books = await fetchBooks(newOffset, newCategory);
    updateBooks(newOffset, books);

    // Prefetch the next page
    const nextOffset = newOffset + BOOKS_PER_PAGE;
    if (!state.cachedBooks[nextOffset]) {
      const nextBooks = await fetchBooks(nextOffset, newCategory);
      setState((prev) => ({
        ...prev,
        cachedBooks: { ...prev.cachedBooks, [nextOffset]: nextBooks },
      }));
    }
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setState((prev) => ({
      ...prev,
      category: newCategory,
      offset: 0,
      currentBooks: [],
      cachedBooks: {}, // Reset cache on category change
    }));
  };

  // Initial load and category change effect
  useEffect(() => {
    loadPage(0, state.category);
  }, [state.category]);

  // Navigation handlers
  const goToNextPage = () => {
    if (state.isLoading) return;
    const nextOffset = state.offset + BOOKS_PER_PAGE;
    loadPage(nextOffset, state.category);
    scrollToTop();
  };

  const goToPreviousPage = () => {
    if (state.isLoading || state.offset === 0) return;
    const prevOffset = state.offset - BOOKS_PER_PAGE;
    loadPage(prevOffset, state.category);
    scrollToTop();
  };

  // Utility to scroll to top
  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Search handler (placeholder)
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Add search logic here if needed
  };

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setShowMobileSidebar((prev) => !prev);
  };

  // Static stat items
  const statItems = [
    {
      type: "stat",
      title: "Best Sellers",
      description: "This Month",
      id: "stat1",
      gradientClass: "gradient-1",
    },
    {
      type: "stat",
      title: "Top Authors",
      description: "Featured",
      id: "stat2",
      gradientClass: "gradient-2",
    },
    {
      type: "stat",
      title: "Staff Picks",
      description: "Recommended",
      id: "stat3",
      gradientClass: "gradient-3",
    },
  ];

  // Transform books into display items
  const bookItems = state.currentBooks.map((book) => ({
    type: "book",
    imageURL: book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
      : PLACEHOLDER_IMAGE_URL,
    title: book.title,
    id: book.key,
  }));

  const upperRowBooks = bookItems.slice(0, BOOKS_PER_PAGE / 2);
  const lowerRowBooks = bookItems.slice(BOOKS_PER_PAGE / 2);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        style={{ display: window.innerWidth <= 768 ? "block" : "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <SideBar
        onSearch={handleSearch}
        onChangeCategory={handleCategoryChange}
        className={showMobileSidebar ? "active" : ""}
      />

      <div className="main-content">
        <Bookshelf items={statItems} shelfType="stats" />

        {upperRowBooks.length > 0 && (
          <Bookshelf items={upperRowBooks} shelfType="books" />
        )}

        {lowerRowBooks.length > 0 && (
          <Bookshelf items={lowerRowBooks} shelfType="books" />
        )}

        {state.currentBooks.length === 0 && !state.isLoading && (
          <p style={{ textAlign: "center", margin: "20px" }}>
            No books to display on this page.
          </p>
        )}

        <div className="pagination">
          <ScrollButton
            direction="left"
            onClick={goToPreviousPage}
            disabled={state.offset === 0 || state.isLoading}
          />
          <ScrollButton
            direction="right"
            onClick={goToNextPage}
            disabled={state.isLoading}
          />
        </div>
      </div>
    </>
  );
}

export default App;
