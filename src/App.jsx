import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf";
import "./App.css";
import ScrollButton from "./ScrollButton";

const BOOKS_PER_PAGE = 8;
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/128x192.png?text=No+Cover";

function App() {
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [prefetchedBooks, setPrefetchedBooks] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (currentOffset) => {
    if (prefetchedBooks[currentOffset]) {
      setBooks(prefetchedBooks[currentOffset]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/science.json?limit=${BOOKS_PER_PAGE}&offset=${currentOffset}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newBooks = data.works || [];

      setPrefetchedBooks((prev) => ({
        ...prev,
        [currentOffset]: newBooks,
      }));

      setBooks(newBooks);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load effect
  useEffect(() => {
    fetchBooks(0);
  }, []);

  const prefetchNextPage = (nextOffset) => {
    // Only prefetch if not already cached and offset is valid
    if (!prefetchedBooks[nextOffset] && nextOffset >= 0) {
      fetch(
        `https://openlibrary.org/subjects/science.json?limit=${BOOKS_PER_PAGE}&offset=${nextOffset}`
      )
        .then((response) => {
          if (!response.ok) {
            console.warn(
              `Prefetch HTTP error! status: ${response.status} for offset ${nextOffset}`
            );
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            const fetchedBooks = data.works || [];
            if (fetchedBooks.length > 0) {
              setPrefetchedBooks((prev) => ({
                ...prev,
                [nextOffset]: fetchedBooks,
              }));
            }
          }
        })
        .catch((error) => {
          console.error(`Prefetch error for offset ${nextOffset}:`, error);
        });
    }
  };

  const goToNextPage = () => {
    if (loading) return;

    const nextOffset = offset + BOOKS_PER_PAGE;
    setOffset(nextOffset);
    fetchBooks(nextOffset);

    // *** SCROLL TO TOP ON NEXT PAGE ***
    window.scrollTo({ top: 0, behavior: "smooth" });

    prefetchNextPage(nextOffset + BOOKS_PER_PAGE);
    prefetchNextPage(nextOffset + BOOKS_PER_PAGE * 2);
  };

  const goToPreviousPage = () => {
    if (loading) return;

    const prevOffset = offset - BOOKS_PER_PAGE;
    if (prevOffset >= 0) {
      setOffset(prevOffset);
      fetchBooks(prevOffset);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  const bookItems = books.map((book) => ({
    type: "book",
    imageURL: book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
      : PLACEHOLDER_IMAGE_URL,
    title: book.title,
    id: book.key,
  }));

  const upperRowBooks = bookItems.slice(0, BOOKS_PER_PAGE / 2);
  const lowerRowBooks = bookItems.slice(BOOKS_PER_PAGE / 2, BOOKS_PER_PAGE);

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    margin: "24px 0",
  };

  return (
    <>
      <Bookshelf items={statItems} shelfType="stats" />
      {upperRowBooks.length > 0 && (
        <Bookshelf items={upperRowBooks} shelfType="books" />
      )}

      {lowerRowBooks.length > 0 && (
        <Bookshelf items={lowerRowBooks} shelfType="books" />
      )}
      {books.length === 0 && !loading && (
        <p style={{ textAlign: "center", margin: "20px" }}>
          No books to display on this page.
        </p>
      )}

      <div style={paginationStyle} className="pagination">
        <ScrollButton
          direction="left"
          onClick={goToPreviousPage}
          disabled={offset === 0 || loading}
        />
        <ScrollButton
          direction="right"
          onClick={goToNextPage}
          disabled={loading}
        />
      </div>
    </>
  );
}

export default App;
