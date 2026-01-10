// src/components/BookCard/BookCard.jsx
import React from "react";
import "./BookCard.css"; // Optional: create this later

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img
        src={book.image_url || "/placeholder-book.png"}
        alt={book.title}
        className="book-image"
      />
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Points: {book.points}</p>
    </div>
  );
};

export default BookCard;
