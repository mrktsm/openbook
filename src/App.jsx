import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf"; // Assuming Bookshelf.js is in the same folder
import "./App.css"; // Import the CSS

function App() {
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [prefetchedBooks, setPrefetchedBooks] = useState({}); // Store prefetched pages here

  useEffect(() => {
    // Load the first page initially
    fetchBooks(offset);
  }, []);

  // Fetch books from the Open Library API
  const fetchBooks = async (currentOffset) => {
    // Check if we have already prefetched this page
    if (prefetchedBooks[currentOffset]) {
      setBooks(prefetchedBooks[currentOffset]);
      return;
    }

    const response = await fetch(
      `https://openlibrary.org/subjects/science.json?limit=8&offset=${currentOffset}`
    );
    const data = await response.json();
    const newBooks = data.works || [];

    // Save fetched books to the prefetchedBooks cache
    setPrefetchedBooks((prev) => ({
      ...prev,
      [currentOffset]: newBooks,
    }));

    // Set the current page's books
    setBooks(newBooks);
  };

  // Prefetch the next page of books (8 books)
  const prefetchNextPage = (nextOffset) => {
    // If this page is not already prefetched, fetch it
    if (!prefetchedBooks[nextOffset]) {
      fetchBooks(nextOffset);
    }
  };

  // Navigate to the next page
  const goToNextPage = () => {
    const nextOffset = offset + 8;
    setOffset(nextOffset);
    fetchBooks(nextOffset);

    // Prefetch the next few pages (page 3, 4, etc.)
    prefetchNextPage(nextOffset + 8); // Prefetch next page (e.g., page 3)
    prefetchNextPage(nextOffset + 16); // Prefetch the one after that (e.g., page 4)
  };

  // Navigate to the previous page
  const goToPreviousPage = () => {
    const prevOffset = offset - 8;
    if (prevOffset >= 0) {
      setOffset(prevOffset);
      fetchBooks(prevOffset);
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

  // Map books to bookItems
  const bookItems = books.map((book) => ({
    type: "book",
    imageURL: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
    title: book.title,
    id: book.key,
  }));

  // Split bookItems into two groups: first 4 for the upper row, next 4 for the lower row
  const upperRowBooks = bookItems.slice(0, 4);
  const lowerRowBooks = bookItems.slice(4, 8);

  return (
    <>
      <Bookshelf items={statItems} shelfType="stats" />

      {/* Upper Row Bookshelf */}
      <Bookshelf items={upperRowBooks} shelfType="books" />

      {/* Lower Row Bookshelf */}
      <Bookshelf items={lowerRowBooks} shelfType="books" />

      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={offset === 0}>
          Previous
        </button>
        <button onClick={goToNextPage}>Next</button>
      </div>
    </>
  );
}

export default App;
