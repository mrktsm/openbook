import React from "react";
import { Link } from "react-router-dom"; // Import Link
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
          // --- Render Stat Card with Link ---
          if (item.type === "stat") {
            return (
              <Link
                to={`/award/${encodeURIComponent(item.id)}`} // Link to award detail page
                key={item.id}
                className={`stat-card-link ${item.gradientClass || ""}`} // Apply gradient to link
                state={{
                  awardTitle: item.title,
                  fetchParams: item.fetchParams,
                  awardDescription: item.description,
                  gradientClass: item.gradientClass,
                }} // Pass necessary data
              >
                {/* Stat card content inside the link */}
                <div className="stat-card-content">
                  <div>{item.title && <h3>{item.title}</h3>}</div>
                  <div>{item.description && <p>{item.description}</p>}</div>
                </div>
              </Link>
            );
          }
          // --- Render Book (using item.content) ---
          else if (item.type === "book") {
            // Render the content passed from App.jsx, which includes the Link
            return (
              <div key={item.id} className="book-item-wrapper">
                {/* item.content already contains the Link and img */}
                {item.content}
              </div>
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
