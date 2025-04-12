import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useParams, useLocation } from "react-router-dom";
import Bookshelf from "./components/Bookshelf";
import "./App.css";
import ScrollButton from "./components/ui/ScrollButton";
import SideBar from "./components/SideBar";
import Spinner from "./components/ui/Spinner";
import BookDetail from "./components/BookDetail";

const BOOKS_PER_PAGE = 8;
const MAX_BOOKS_TO_FETCH = 100;
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/128x192.png?text=No+Cover";

function App() {
  const [state, setState] = useState({
    allBooks: [],
    currentBooks: [],
    offset: 0,
    category: "science",
    searchTerm: "",
    isLoading: false,
    statItems: [], // Dynamic stat items
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch books for a given category or search term
  const fetchBooks = async (
    category,
    searchTerm,
    limit = MAX_BOOKS_TO_FETCH
  ) => {
    try {
      let url;
      if (searchTerm) {
        url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=${limit}`;
      } else {
        url = `https://openlibrary.org/subjects/${category}.json?limit=${limit}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const books = searchTerm ? data.docs : data.works || [];
      const mappedBooks = books.map((book) => ({
        key: book.key || book.cover_edition_key || `${Math.random()}`,
        title: book.title,
        cover_id: book.cover_i || book.cover_id || null,
        first_publish_year: book.first_publish_year || "Unknown",
        author_name: book.author_name ? book.author_name.join(", ") : "Unknown",
        edition_count: book.edition_count || 0,
        has_fulltext: book.has_fulltext || false,
        public_scan_b: book.public_scan_b || false,
        ia: book.ia || [],
      }));
      return mappedBooks;
    } catch (error) {
      console.error("Failed to fetch books:", error);
      return [];
    }
  };

  // Fetch data for stat cards
  const fetchStatData = async () => {
    // Staff Picks: Use "classics" as a proxy
    const staffPicks = await fetchBooks("classics", "", 1);
    const staffPick = staffPicks[0] || {
      title: "N/A",
      first_publish_year: "N/A",
    };

    // Best Sellers: Use recent popular books (sort by year as a proxy)
    const bestSellers = await fetchBooks("", "bestseller", 10);
    const latestBook = bestSellers.sort(
      (a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0)
    )[0] || { title: "N/A", first_publish_year: "N/A" };

    // Top Authors: Fetch a larger set and count authors (simplified)
    const authorBooks = await fetchBooks("literature", "", 20);
    const authorCount = authorBooks.reduce((acc, book) => {
      if (book.author_name) {
        acc[book.author_name] = (acc[book.author_name] || 0) + 1;
      }
      return acc;
    }, {});
    const topAuthor = Object.entries(authorCount).sort(
      (a, b) => b[1] - a[1]
    )[0] || ["Unknown", 0];

    return [
      {
        type: "stat",
        title: "Staff Picks",
        description: `${staffPick.title} (${staffPick.first_publish_year})`,
        id: "stat1",
        gradientClass: "gradient-1",
      },
      {
        type: "stat",
        title: "Best Sellers",
        description: `${latestBook.title} (${latestBook.first_publish_year})`,
        id: "stat2",
        gradientClass: "gradient-2",
      },
      {
        type: "stat",
        title: "Top Authors",
        description: `${topAuthor[0]} (${topAuthor[1]} works)`,
        id: "stat3",
        gradientClass: "gradient-3",
      },
    ];
  };

  // Filter and paginate books
  const filterAndPaginateBooks = (allBooks, searchTerm, offset) => {
    const filteredBooks = searchTerm
      ? allBooks.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allBooks;

    const startIndex = offset;
    const endIndex = offset + BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, endIndex);
  };

  // Load books and stat data
  const loadBooks = async (newCategory, newSearchTerm) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const allBooks = await fetchBooks(newCategory, newSearchTerm);
    const currentBooks = filterAndPaginateBooks(allBooks, newSearchTerm, 0);
    const statItems = await fetchStatData();

    setState((prev) => ({
      ...prev,
      allBooks,
      currentBooks,
      offset: 0,
      category: newCategory,
      searchTerm: newSearchTerm,
      statItems,
      isLoading: false,
    }));
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    loadBooks(newCategory, "");
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      const currentBooks = filterAndPaginateBooks(state.allBooks, "", 0);
      setState((prev) => ({
        ...prev,
        currentBooks,
        offset: 0,
        searchTerm: "",
      }));
    } else {
      if (state.searchTerm) {
        const currentBooks = filterAndPaginateBooks(
          state.allBooks,
          searchTerm,
          0
        );
        setState((prev) => ({
          ...prev,
          currentBooks,
          offset: 0,
          searchTerm,
        }));
      } else {
        loadBooks(state.category, searchTerm);
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadBooks(state.category, state.searchTerm);
  }, [state.category]);

  // Navigation handlers
  const goToNextPage = () => {
    if (state.isLoading) return;
    const nextOffset = state.offset + BOOKS_PER_PAGE;
    const totalFilteredBooks = state.searchTerm
      ? state.allBooks.filter((book) =>
          book.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        ).length
      : state.allBooks.length;

    if (nextOffset < totalFilteredBooks) {
      const currentBooks = filterAndPaginateBooks(
        state.allBooks,
        state.searchTerm,
        nextOffset
      );
      setState((prev) => ({
        ...prev,
        currentBooks,
        offset: nextOffset,
      }));
      scrollToTop();
    }
  };

  const goToPreviousPage = () => {
    if (state.isLoading || state.offset === 0) return;
    const prevOffset = state.offset - BOOKS_PER_PAGE;
    const currentBooks = filterAndPaginateBooks(
      state.allBooks,
      state.searchTerm,
      prevOffset
    );
    setState((prev) => ({
      ...prev,
      currentBooks,
      offset: prevOffset,
    }));
    scrollToTop();
  };

  // Utility to scroll to top
  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setShowMobileSidebar((prev) => !prev);
  };

  // Transform books into display items with Links
  const bookItems = state.currentBooks.map((book) => ({
    type: "book",
    id: book.key,
    content: (
      <Link
        to={`/book/${encodeURIComponent(book.key)}`}
        state={{ bookData: book }}
      >
        <img
          src={
            book.cover_id
              ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
              : PLACEHOLDER_IMAGE_URL
          }
          alt={book.title}
          className="book-cover"
        />
      </Link>
    ),
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
        <Routes>
          <Route
            path="/"
            element={
              <>
                {state.isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Bookshelf items={state.statItems} shelfType="stats" />
                    {upperRowBooks.length > 0 && (
                      <Bookshelf items={upperRowBooks} shelfType="books" />
                    )}
                    {lowerRowBooks.length > 0 && (
                      <Bookshelf items={lowerRowBooks} shelfType="books" />
                    )}
                    {state.currentBooks.length === 0 && !state.isLoading && (
                      <p style={{ textAlign: "center", margin: "20px" }}>
                        {state.searchTerm
                          ? `No results found for "${state.searchTerm}".`
                          : "No books to display on this page."}
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
                        disabled={
                          state.isLoading ||
                          state.offset + BOOKS_PER_PAGE >=
                            (state.searchTerm
                              ? state.allBooks.filter((book) =>
                                  book.title
                                    .toLowerCase()
                                    .includes(state.searchTerm.toLowerCase())
                                ).length
                              : state.allBooks.length)
                        }
                      />
                    </div>
                  </>
                )}
              </>
            }
          />
          <Route
            path="/book/:bookKey"
            element={<BookDetail placeholderImage={PLACEHOLDER_IMAGE_URL} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
