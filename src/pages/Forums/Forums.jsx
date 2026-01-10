// src/pages/Forums/Forums.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ForumCard from "../../components/ForumCard/ForumCard";
import "./Forums.css";

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch forums from Supabase
  const fetchForums = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching forums:", error.message);
      else setForums(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="forums-container">
      <div className="forums-banner">
        <h1 className="forums-title">💬 Book Forums & Discussions</h1>
        <p className="forums-subtitle">
          Join discussions, share opinions, and explore chapter-wise debates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="forums-search">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search forums by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Forum Threads */}
      <div className="forums-list">
        {loading ? (
          <p>Loading forums...</p>
        ) : filteredForums.length > 0 ? (
          filteredForums.map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))
        ) : (
          <p>No forums found.</p>
        )}
      </div>
    </div>
  );
};

export default Forums;
