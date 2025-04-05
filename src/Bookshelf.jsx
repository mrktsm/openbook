import React from "react";
import "./Bookshelf.css";

const Bookshelf = ({ books }) => {
  return (
    <div className="bookshelf">
      <div className="books">
        {books.map((book, index) => (
          <div
            key={index}
            className="book"
            style={{ "--bg-image": `url(${book.imageURL})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookshelf;
