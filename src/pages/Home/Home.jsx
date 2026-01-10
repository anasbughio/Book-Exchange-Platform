// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import BookCard from "../../components/BookCard/BookCard";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching books:", error.message);
      else setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Buttons array
  const buttons = [
    { id: 1, label: "Featured Books" },
    { id: 2, label: "Recently Listed Books" },
    { id: 3, label: "Nearby Exchange Points" },
  ];

  return (
    <div className="home-container">
      {/* Banner */}
      <div className="home-banner">
        <h1 className="home-title">📚 Welcome to BooksExchange</h1>
        <p className="home-subtitle">
          Swap books, earn points, and join a thriving reading community!
        </p>
      </div>

      {/* Search bar */}
      <div className="home-search">
        <input
          type="text"
          placeholder="Search books by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Button Row */}
      <div className="button-row">
        {buttons.map((btn) => (
          <button key={btn.id} className="home-btn">
            {btn.label}
          </button>
        ))}
      </div>

      {/* Books Section */}
      <div className="book-list">
        {loading ? (
          <p>Loading books...</p>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
