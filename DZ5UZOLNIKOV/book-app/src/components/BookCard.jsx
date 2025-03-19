import React from "react";

const BookCard = ({ title, authors, coverImage }) => {
  return (
    <div className="book-card">
      <img 
        src={coverImage || "https://via.placeholder.com/150"} 
        alt={title} 
      />
      <h3>{title}</h3>
      <p>{authors?.join(", ") || "Автор неизвестен"}</p>
    </div>
  );
};

export default BookCard;