import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import "./AwardsPage.css";

const AwardsPage = ({ placeholderImage, fetchBooksFunction }) => {
  const { awardId } = useParams();
  const location = useLocation();
  const awardTitle = location.state?.awardTitle || "Award Details";
  const fetchParams = location.state?.fetchParams;

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

  const renderBookItem = (book) => (
    <Link
      to={`/book/${encodeURIComponent(book.key)}`}
      state={{ bookData: book }}
      key={book.key}
      className="award-book-item"
      title={book.title}
    >
      <img
        src={
          book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : placeholderImage
        }
        alt={book.title}
        className="award-book-cover"
      />
      {/* Optionally add title below image if desired later */}
      {/* <div className="award-book-title">{book.title}</div> */}
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
      <section className="award-section">
        <div className={`award-header gradient-default`}>
          <h2 className="award-title">{awardTitle}</h2>
        </div>

        {error && <p className="error-message">{error}</p>}

        {!error && relatedBooks.length > 0 ? (
          <div className="award-book-list">
            {relatedBooks.map(renderBookItem)}
          </div>
        ) : (
          !error && (
            <p className="no-books-message">
              No specific books found for this award.
            </p>
          )
        )}

        {/* Divider is less relevant if there's only one section per page */}
        {/* <hr className="award-divider" /> */}
      </section>
    </div>
  );
};

export default AwardsPage;
