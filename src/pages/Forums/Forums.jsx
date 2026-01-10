// src/pages/Forums/Forums.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ForumCard from "../../components/ForumCard/ForumCard";
import "./Forums.css";

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forums")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setForums(data || []);
    setLoading(false);
  };

  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="forums-container">
      {/* Header */}
      <div className="forums-header">
        <h1>Book Forums & Discussions</h1>
        <p>
          Discuss books, share interpretations, debate chapters, and help fellow
          readers — anonymously if you like.
        </p>
      </div>

      {/* Search */}
      <div className="forums-search">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="forums-categories">
        <span className="category active">All</span>
        <span className="category">Reader Talks</span>
        <span className="category">Chapter Debates</span>
        <span className="category">Opinions</span>
        <span className="category">Guides</span>
      </div>

      {/* Forum List */}
      <div className="forums-list">
        {loading ? (
          <div className="loading">Loading discussions...</div>
        ) : filteredForums.length ? (
          filteredForums.map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))
        ) : (
          <div className="empty-state">
            No discussions found. Be the first to start one 📖
          </div>
        )}
      </div>
    </div>
  );
};

export default Forums;
