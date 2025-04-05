const LeftArrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="#333333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="#333333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ScrollButton = ({ direction = "right", onClick, disabled = false }) => {
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? "0.5" : "1",
    transition: "all 0.2s ease",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    marginTop: "-450px",
  };

  const handleMouseOver = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";
    }
  };

  const handleMouseOut = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      aria-label={`Scroll ${direction}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {direction === "left" ? <LeftArrow /> : <RightArrow />}
    </button>
  );
};

export default ScrollButton;
