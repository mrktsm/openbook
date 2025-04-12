import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import "./AwardsPage.css";

const AwardsPage = ({ placeholderImage, fetchBooksFunction }) => {
  const { awardId } = useParams();
  const location = useLocation();
  const awardTitle = location.state?.awardTitle || "Award Details";
  const awardSubtitle = location.state?.awardDescription || "Details below";
  const fetchParams = location.state?.fetchParams;
  const gradientClass = location.state?.gradientClass || "gradient-default";
  // Remove description from state, generate it here based on title/params
  // const awardDescriptionFromState = location.state?.awardDescription;

  // Generate MORE meaningful description explaining the selection
  let awardMeaningfulDescription = "A collection of notable books.";
  if (awardTitle === "Staff Picks") {
    awardMeaningfulDescription =
      "Our featured selection, highlighting timeless classics and highly-regarded works fetched from the 'classics' category.";
  } else if (awardTitle === "Best Sellers") {
    awardMeaningfulDescription =
      "Find popular titles currently topping the charts, fetched using the 'bestseller' keyword.";
  } else if (awardTitle === "Top Author" && fetchParams?.searchTerm) {
    awardMeaningfulDescription = `Discover popular and notable works by ${fetchParams.searchTerm}, identified by analyzing author frequency in recent 'literature' results.`;
  } else if (awardTitle === "Discover" && fetchParams?.category) {
    // Keep this fallback or customize further
    awardMeaningfulDescription = `Explore books from the ${fetchParams.category.replace(
      /_/g,
      " "
    )} genre, selected as an example discovery category.`;
  } // Add more cases if needed

  const [relatedBooks, setRelatedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAwardBooks = async () => {
      if (!fetchParams || !fetchBooksFunction) {
        setError("Missing necessary data to fetch award books.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchBooksFunction(
          fetchParams.category,
          fetchParams.searchTerm,
          fetchParams.limit
        );
        setRelatedBooks(result.books);
      } catch (err) {
        console.error(`Failed to fetch books for award ${awardId}:`, err);
        setError("Failed to load books for this award.");
        setRelatedBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAwardBooks();
  }, [awardId, fetchParams, fetchBooksFunction]);

  const renderBookRow = (book) => (
    <Link
      to={`/book/${encodeURIComponent(book.key)}`}
      state={{ bookData: book }}
      key={book.key}
      className="award-detail-book-row-link"
    >
      <div className="award-detail-book-row">
        <img
          src={
            book.cover_id
              ? `https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`
              : placeholderImage
          }
          alt={book.title}
          className="award-detail-book-row-cover"
          loading="lazy"
        />
        <div className="award-detail-book-row-info">
          <span className="award-detail-book-row-title">{book.title}</span>
          <span className="award-detail-book-row-author">
            {book.author_name}
          </span>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="awards-page-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="awards-page-container">
      {/* Header Section: Cover Left, Info Right */}
      <div className="award-page-header">
        {/* Award Cover Wrapper (Left) - Contains Title & Subtitle */}
        <div className="award-detail-cover-wrapper">
          <div className={`award-detail-cover ${gradientClass}`}>
            {/* Re-add title and subtitle INSIDE the cover */}
            <div className="award-cover-text-content">
              <h2 className="award-cover-title">{awardTitle}</h2>
              <p className="award-cover-description">{awardSubtitle}</p>
            </div>
          </div>
        </div>
        {/* Header Info (Right) - Contains Title AGAIN & Meaningful Description */}
        <div className="award-header-info">
          <h1 className="award-header-title">{awardTitle}</h1>
          <p className="award-header-description">
            {awardMeaningfulDescription}
          </p>
        </div>
      </div>

      {/* Divider between header and list */}
      <hr className="award-section-divider" />

      {/* Book List Section */}
      <div className="award-detail-list-wrapper">
        {error && <p className="error-message">{error}</p>}

        {!error && relatedBooks.length > 0 ? (
          <div className="award-detail-book-list">
            {relatedBooks.map((book, index) => (
              <React.Fragment key={book.key}>
                {renderBookRow(book)}
                <hr className="award-detail-row-divider" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          !error && (
            <p className="no-books-message">
              No specific books found for this award.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default AwardsPage;
