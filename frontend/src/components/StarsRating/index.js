function StarsRating({ rating, white, onClick }) {
  const totalStars = 5;
  return (
    <div style={{ marginBottom: "5px" }}>
      {[...Array(totalStars)].map((_, i) => (
        <span
          key={i}
          style={{ color: i < rating ? "gold" : "#ddd" }}
          onClick={() => onClick?.(i + 1)}
        >
          ★
        </span>
      ))}
      <span
        style={{
          marginLeft: "10px",
          fontSize: "16px",
          color: white ? "white" : "black",
        }}
      >
        {rating}/{totalStars}
      </span>
    </div>
  );
}

export default StarsRating;
