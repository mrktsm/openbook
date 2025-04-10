import React from "react";
// Removed CSS import here, assuming it's handled globally by App.js or index.js
// If Bookshelf.css ONLY contains bookshelf specific styles, import it:
// import './Bookshelf.css';

const Bookshelf = ({ items, shelfType }) => {
  // Determine the class for the grid container based on shelfType
  const containerClass = `books-container books-container--${shelfType}`; // e.g., 'books-container books-container--stats'

  return (
    <div className="bookshelf">
      <div className={containerClass}>
        {items.map((item) => {
          // --- Render Stat Card ---
          if (item.type === "stat") {
            return (
              <div
                key={item.id}
                // Apply base class and specific gradient class
                className={`stat-card ${item.gradientClass || ""}`}
              >
                {/* Added divs for potentially better text control if needed */}
                <div>{item.title && <h3>{item.title}</h3>}</div>
                <div>{item.description && <p>{item.description}</p>}</div>
              </div>
            );
          }
          // --- Render Book ---
          else if (item.type === "book") {
            return (
              <div
                key={item.id}
                className="book"
                // Apply background image via CSS custom property
                style={{ "--bg-image": `url(${item.imageURL})` }}
              />
            );
          }
          // Always return null or an empty fragment for unhandled types
          return null;
        })}
      </div>
    </div>
  );
};

export default Bookshelf;
