import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useParams, useLocation } from "react-router-dom";
import Bookshelf from "./components/Bookshelf";
import "./App.css";
import ScrollButton from "./components/ui/ScrollButton";
import SideBar from "./components/SideBar";
import Spinner from "./components/ui/Spinner";
import BookDetail from "./components/BookDetail";
import AwardsPage from "./pages/AwardsPage";

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
    statItems: [],
    totalBooksFound: 0,
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const location = useLocation();

  // Fetch books - Updated to handle pagination and return total found
  const fetchBooks = async (
    category,
    searchTerm,
    limit = MAX_BOOKS_TO_FETCH,
    offset = 0
  ) => {
    try {
      let url;
      if (searchTerm) {
        url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=${limit}&offset=${offset}`;
      } else {
        url = `https://openlibrary.org/subjects/${category}.json?limit=${limit}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const books = searchTerm ? data.docs : data.works || [];
      const totalFound = searchTerm ? data.numFound : (data.works || []).length;

      const mappedBooks = books.map((book) => ({
        key: book.key || book.cover_edition_key || `/works/OL${Math.random()}W`,
        title: book.title,
        cover_id: book.cover_i || book.cover_id || null,
        first_publish_year: book.first_publish_year || "Unknown",
        author_name: book.author_name ? book.author_name.join(", ") : "Unknown",
        edition_count: book.edition_count || 0,
        has_fulltext: book.has_fulltext || false,
        public_scan_b: book.public_scan_b || false,
        ia: book.ia || [],
      }));
      return { books: mappedBooks, totalFound };
    } catch (error) {
      console.error("Failed to fetch books:", error);
      return { books: [], totalFound: 0 };
    }
  };

  // Fetch data for stat cards (Restore Original Titles, Change Descriptions)
  const fetchStatData = async () => {
    // Fetch minimal data needed for fetchParams and IDs
    const classicsResult = await fetchBooks("classics", "", 1); // For Staff Picks params
    const bestsellerResult = await fetchBooks("", "bestseller", 1); // For Bestsellers params
    const authorBooksResult = await fetchBooks("literature", "", 20);
    const authorBooks = authorBooksResult.books;
    const authorCount = authorBooks.reduce((acc, book) => {
      if (book.author_name && book.author_name !== "Unknown") {
        const authors = book.author_name.split(", ");
        authors.forEach((author) => {
          acc[author] = (acc[author] || 0) + 1;
        });
      }
      return acc;
    }, {});
    const sortedAuthors = Object.entries(authorCount).sort(
      (a, b) => b[1] - a[1]
    );
    const topAuthorName =
      sortedAuthors.length > 0 ? sortedAuthors[0][0] : "Unknown";
    // const topAuthorWorkCount = sortedAuthors.length > 0 ? sortedAuthors[0][1] : 0;

    return [
      {
        type: "stat",
        title: "Staff Picks", // Original Title
        description: "Featured", // Generic Description
        id: "classics",
        gradientClass: "gradient-1",
        fetchParams: { category: "classics", searchTerm: "", limit: 5 },
      },
      {
        type: "stat",
        title: "Best Sellers", // Original Title
        description: "Trending Now", // Generic Description
        id: "bestseller",
        gradientClass: "gradient-2",
        fetchParams: { category: "", searchTerm: "bestseller", limit: 5 },
      },
      {
        type: "stat",
        title: "Top Author", // Original Title
        description: "Discover", // Generic Description
        id: `author-${topAuthorName.replace(/\s+/g, "-")}`,
        gradientClass: "gradient-3",
        fetchParams: { category: "", searchTerm: topAuthorName, limit: 5 },
      },
    ];
  };

  // Filter and paginate books
  const filterAndPaginateBooks = (allBooks, offset) => {
    const startIndex = offset;
    const endIndex = offset + BOOKS_PER_PAGE;
    return allBooks.slice(startIndex, endIndex);
  };

  // Load books and stat data
  const loadBooksAndStats = async (newCategory, newSearchTerm) => {
    setState((prev) => ({ ...prev, isLoading: true, offset: 0 }));

    let fetchedBooks = [];
    let totalFound = 0;
    let categoryAllBooks = [];

    // Fetch main bookshelf books (search or category)
    if (newSearchTerm) {
      const result = await fetchBooks("", newSearchTerm, BOOKS_PER_PAGE, 0);
      fetchedBooks = result.books;
      totalFound = result.totalFound;
    } else {
      const result = await fetchBooks(newCategory, "", MAX_BOOKS_TO_FETCH);
      categoryAllBooks = result.books;
      fetchedBooks = filterAndPaginateBooks(categoryAllBooks, 0);
      totalFound = categoryAllBooks.length;
    }

    // Fetch stat items for the shelf
    const statItems = await fetchStatData();

    setState((prev) => ({
      ...prev,
      allBooks: categoryAllBooks,
      currentBooks: fetchedBooks,
      offset: 0,
      category: newCategory,
      searchTerm: newSearchTerm,
      statItems: statItems, // Set stat items
      totalBooksFound: totalFound,
      isLoading: false,
    }));
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    loadBooksAndStats(newCategory, ""); // Use combined loader
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      loadBooksAndStats(state.category, ""); // Load category if search cleared
    } else {
      loadBooksAndStats(state.category, searchTerm.trim()); // Load search results
    }
  };

  // Initial load
  useEffect(() => {
    loadBooksAndStats(state.category, state.searchTerm);
  }, []);

  // Navigation handlers
  const goToNextPage = async () => {
    if (state.isLoading) return;

    const nextOffset = state.offset + BOOKS_PER_PAGE;

    if (state.searchTerm) {
      if (nextOffset < state.totalBooksFound) {
        setState((prev) => ({ ...prev, isLoading: true }));
        const result = await fetchBooks(
          "",
          state.searchTerm,
          BOOKS_PER_PAGE,
          nextOffset
        );
        setState((prev) => ({
          ...prev,
          currentBooks: result.books,
          offset: nextOffset,
          isLoading: false,
        }));
        scrollToTop();
      }
    } else {
      if (nextOffset < state.totalBooksFound) {
        const currentBooks = filterAndPaginateBooks(state.allBooks, nextOffset);
        setState((prev) => ({
          ...prev,
          currentBooks,
          offset: nextOffset,
        }));
        scrollToTop();
      }
    }
  };

  const goToPreviousPage = async () => {
    if (state.isLoading || state.offset === 0) return;

    const prevOffset = state.offset - BOOKS_PER_PAGE;

    if (state.searchTerm) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const result = await fetchBooks(
        "",
        state.searchTerm,
        BOOKS_PER_PAGE,
        prevOffset
      );
      setState((prev) => ({
        ...prev,
        currentBooks: result.books,
        offset: prevOffset,
        isLoading: false,
      }));
      scrollToTop();
    } else {
      const currentBooks = filterAndPaginateBooks(state.allBooks, prevOffset);
      setState((prev) => ({
        ...prev,
        currentBooks,
        offset: prevOffset,
      }));
      scrollToTop();
    }
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
                    {state.statItems.length > 0 && (
                      <Bookshelf items={state.statItems} shelfType="stats" />
                    )}
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
                          : "No books to display for this category."}
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
                          state.offset + BOOKS_PER_PAGE >= state.totalBooksFound
                        }
                      />
                    </div>
                  </>
                )}
              </>
            }
          />
          <Route
            path="/award/:awardId"
            element={
              <AwardsPage
                placeholderImage={PLACEHOLDER_IMAGE_URL}
                fetchBooksFunction={fetchBooks}
              />
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
