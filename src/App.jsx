import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf"; // Assuming Bookshelf.js is in the same folder
import "./App.css"; // Import the CSS

function App() {
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [cachedBooks, setCachedBooks] = useState({}); // Cache for books by page

  useEffect(() => {
    // Fetch the books for the initial offset when the component mounts
    fetchBooks(offset);
  }, [offset]);

  // Fetch books from the Open Library API
  const fetchBooks = async (pageOffset) => {
    // Check if the data for this offset is already cached
    if (cachedBooks[pageOffset]) {
      setBooks(cachedBooks[pageOffset]); // If cached, set the books directly
      return;
    }

    // Fetch new data from the API
    const response = await fetch(
      `https://openlibrary.org/subjects/science.json?limit=8&offset=${pageOffset}`
    );
    const data = await response.json();

    // Map the fetched books to the desired format
    const bookItems = data.works.map((book) => ({
      type: "book",
      imageURL: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
      title: book.title,
      id: book.key,
    }));

    // Set the books to state
    setBooks(bookItems);
    // Cache the fetched books for the current page offset
    setCachedBooks((prevCache) => ({
      ...prevCache,
      [pageOffset]: bookItems,
    }));
  };

  // Split books into two groups: upper and lower rows
  const upperRowBooks = books.slice(0, 4);
  const lowerRowBooks = books.slice(4, 8);

  const goToNextPage = () => {
    setOffset((prevOffset) => prevOffset + 8); // Increase offset by 8 for next page
  };

  const goToPreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - 8, 0)); // Decrease offset by 8, but not below 0
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
