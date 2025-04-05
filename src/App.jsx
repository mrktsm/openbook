import React, { useEffect, useState } from "react";
import Bookshelf from "./Bookshelf"; // Assuming Bookshelf.js is in the same folder
import "./App.css"; // Import the CSS

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from the Open Library API
  const fetchBooks = async () => {
    const response = await fetch(
      "https://openlibrary.org/subjects/fantasy.json?limit=8"
    );
    const data = await response.json();
    console.log(data);
    return data;
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

  const bookItems = [
    {
      type: "book",
      imageURL: "https://unsplash.it/300/450?image=1067",
      id: "b1",
    },
    {
      type: "book",
      imageURL: "https://unsplash.it/300/450?image=10",
      id: "b2",
    },
    {
      type: "book",
      imageURL: "https://unsplash.it/300/450?image=24",
      id: "b3",
    },
    {
      type: "book",
      imageURL: "https://unsplash.it/300/450?image=35",
      id: "b4",
    },
  ];

  return (
    <>
      <Bookshelf items={statItems} shelfType="stats" />
      <Bookshelf items={bookItems} shelfType="books" />
    </>
  );
}

export default App;
