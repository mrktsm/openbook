import React from "react";
import Bookshelf from "./Bookshelf";
import "./App.css";

function App() {
  // Sample book data
  const books = [
    {
      imageURL:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1581128232l/50214741.jpg",
    },
    {
      imageURL:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1544204706l/42505366.jpg",
    },
    {
      imageURL:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1541621322l/42201395.jpg",
    },
    {
      imageURL:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548518877l/43263520._SY475_.jpg",
    },
  ];

  return (
    <div className="app">
      <Bookshelf books={books} />
    </div>
  );
}

export default App;
