import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf"; // Assuming Bookshelf.js is in the same folder
import "./App.css"; // Import the CSS

function App() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  // Fetch books from the Open Library API
  const fetchBooks = async (pageNum) => {
    const response = await fetch(
      `https://openlibrary.org/subjects/science.json?limit=8&page=${pageNum}`
    );
    const data = await response.json();
    console.log(data);
    setBooks(data.works || []);
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
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>
  );
}

export default App;
