import React from "react";
import Bookshelf from "./Bookshelf"; // Assuming Bookshelf.js is in the same folder
import "./App.css"; // Import the CSS

function App() {
  // --- Data for the Stat Cards Shelf ---
  const statItems = [
    {
      type: "stat", // Changed type to 'stat' for clarity
      title: "Best Sellers",
      description: "This Month",
      id: "stat1",
      gradientClass: "gradient-1", // Assign gradient class
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

  // --- Data for the Books Shelf ---
  const bookItems = [
    // Use actual image URLs or placeholders
    // Placeholder images from unsplash.it
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
    // The body styling is now handled by App.css on the body tag directly
    // No need for an extra div here unless you have other layout needs
    <>
      {/* Bookshelf for Stats */}
      <Bookshelf
        items={statItems}
        shelfType="stats" // Pass a type to differentiate
      />

      {/* Bookshelf for Books */}
      <Bookshelf
        items={bookItems}
        shelfType="books" // Pass a type to differentiate
      />
    </>
  );
}

export default App;
