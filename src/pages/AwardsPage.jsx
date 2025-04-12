import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Rectangle,
} from "recharts";
import Spinner from "../components/ui/Spinner";
import "./AwardsPage.css";

// Custom shape for rounded top bars
const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  // Calculate radius, ensuring it's not too large for small bars
  const radius = Math.min(width / 2, 6); // Reduced max radius slightly

  if (height <= 0) {
    // Prevent rendering zero-height rectangles
    return null;
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius} // Use rx/ry for potentially better SVG rendering of rounded rects
        ry={radius}
        clipPath={`inset(0 0 ${height - radius}px 0)`} // Clip bottom part
      />
      <rect
        x={x}
        y={y + radius}
        width={width}
        height={Math.max(0, height - radius)} // Calculate remaining height
        fill={fill}
      />
    </g>
  );
};

const AwardsPage = ({ placeholderImage, fetchBooksFunction }) => {
  const { awardId } = useParams();
  const location = useLocation();
  const awardTitle = location.state?.awardTitle || "Award Details";
  const awardSubtitle = location.state?.awardDescription || "Details below";
  const fetchParams = location.state?.fetchParams;
  const gradientClass = location.state?.gradientClass || "gradient-default";
  const chartData = location.state?.chartData;

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

  // --- DEBUGGING ---
  console.log("Awards Page Props:", {
    awardId,
    awardTitle,
    awardSubtitle,
    fetchParams,
    chartData,
  });
  // --- END DEBUGGING ---

  // Generate gradient URL ID
  const effectiveGradientClass =
    location.state?.gradientClass || "gradient-default";
  const gradientUrlId = `chartGradient-${effectiveGradientClass}`;

  // Determine the data key for the chart bars
  const chartDataKey = awardId?.startsWith("author-") ? "count" : "year";

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

          {/* Chart Section (Moved Back Up) */}
          {chartData && chartData.length > 0 && (
            <div className="award-chart-container">
              {" "}
              {/* Renamed class */}
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                  barCategoryGap={0}
                  barGap={0}
                >
                  {/* Define SVG Gradients */}
                  <defs>
                    <linearGradient
                      id="chartGradient-gradient-1"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#ff8e53"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="chartGradient-gradient-2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#67c7eb" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#4facfe"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="chartGradient-gradient-3"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8fd3f4" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#84fab0"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="chartGradient-gradient-default"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a0a0a0" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#777777"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    interval={0}
                    tick={false}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "5px 8px",
                      fontSize: "11px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    }}
                    itemStyle={{ color: "#333" }}
                  />
                  <Bar dataKey={chartDataKey} shape={<RoundedBar />}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#${gradientUrlId})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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
