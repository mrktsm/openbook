import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import "./BookDetail.css";
import Spinner from "./ui/Spinner"; // Import Spinner

function BookDetail({ placeholderImage }) {
  const { bookKey } = useParams(); // Get bookKey from URL parameters
  const location = useLocation();
  // Keep initial bookData from state for immediate display of basic info
  const initialBookData = location.state?.bookData;

  const [detailedBookData, setDetailedBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      // Ensure bookKey looks like a work key (/works/OL...) before fetching
      if (!bookKey || !bookKey.startsWith("/works/OL")) {
        setError("Invalid book key provided.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://openlibrary.org${bookKey}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDetailedBookData(data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookKey]); // Re-fetch if bookKey changes

  // --- Data Prioritization ---
  // Use detailed data if available, otherwise fall back to initial data from link state
  const displayData = detailedBookData
    ? {
        // Fields potentially enhanced by detailed fetch
        title:
          detailedBookData.title || initialBookData?.title || "Unknown Title",
        description: detailedBookData.description,
        subjects: detailedBookData.subjects || [],
        // Combine fields, prioritizing detailed data but using initial as fallback
        key: bookKey, // Use the key from params
        cover_id:
          detailedBookData.covers?.[0] || initialBookData?.cover_id || null,
        first_publish_year:
          detailedBookData.first_publish_date ||
          initialBookData?.first_publish_year ||
          "Unknown",
        author_name: initialBookData?.author_name || "Unknown", // Author info might be better in initial data
        edition_count: initialBookData?.edition_count || 0, // Keep from initial data
        has_fulltext: initialBookData?.has_fulltext || false, // Keep from initial data
        public_scan_b: initialBookData?.public_scan_b || false, // Keep from initial data
        ia: initialBookData?.ia || [], // Keep from initial data
      }
    : initialBookData || {}; // Fallback to initial data if detail fetch fails or hasn't completed

  const imageUrl = displayData.cover_id
    ? `https://covers.openlibrary.org/b/id/${displayData.cover_id}-L.jpg`
    : placeholderImage;

  // --- Handle Loading and Error States ---
  if (isLoading && !initialBookData) {
    // Show spinner only if we don't even have initial data
    return (
      <div className="book-detail-container centered-message">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-detail-container centered-message">
        <p className="error-message">{error}</p>
        <Link to="/" className="back-link">
          Go back to bookshelf
        </Link>
      </div>
    );
  }

  if (!displayData.key && !isLoading) {
    // Handle case where we have neither initial nor detailed data
    return (
      <div className="book-detail-container centered-message">
        <p>Book details not found.</p>
        <Link to="/" className="back-link">
          Go back to bookshelf
        </Link>
      </div>
    );
  }

  // Function to safely render description (string or object)
  const renderDescription = (desc) => {
    if (!desc) return null;
    const descriptionText = typeof desc === "string" ? desc : desc.value;
    if (!descriptionText) return null;

    return <p className="book-description">{descriptionText}</p>;
  };

  return (
    <div className="book-detail-container">
      <Link to="/" className="back-link">
        ← Back to Bookshelf
      </Link>
      <div className="book-detail-content">
        <div className="book-detail-image">
          {isLoading && initialBookData && <Spinner size="small" />}
          {/* Show small spinner while loading details */}
          <img
            src={imageUrl}
            alt={`Cover of ${displayData.title}`}
            style={{ display: isLoading && initialBookData ? "none" : "block" }} // Hide image briefly if loading details
          />
        </div>
        <div className="book-detail-info">
          <h1>{displayData.title}</h1>
          <p className="book-meta">
            <strong>Author:</strong> {displayData.author_name}
          </p>
          <p className="book-meta">
            <strong>First Published:</strong> {displayData.first_publish_year}
          </p>

          <hr className="detail-divider" />

          {/* --- Display Description --- */}
          {renderDescription(displayData.description)}

          {/* Conditionally add divider if description was rendered */}
          {displayData.description && <hr className="detail-divider" />}

          {/* --- Display other new information --- */}
          {displayData.edition_count > 0 && (
            <p>
              <strong>Editions:</strong> {displayData.edition_count}
            </p>
          )}
          {displayData.subjects && displayData.subjects.length > 0 && (
            <p className="subjects-list">
              <strong>Subjects:</strong>{" "}
              {displayData.subjects.slice(0, 5).join(", ")}
            </p>
          )}

          {/* Conditionally add divider if editions or subjects were rendered */}
          {(displayData.edition_count > 0 ||
            (displayData.subjects && displayData.subjects.length > 0)) && (
            <hr className="detail-divider" />
          )}

          <p>
            <strong>Availability:</strong>
            {displayData.has_fulltext || displayData.public_scan_b ? (
              <span className="availability-tag available">
                Available Online
              </span>
            ) : (
              <span className="availability-tag not-available">
                Check Availability
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
