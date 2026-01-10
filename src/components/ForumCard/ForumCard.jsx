// src/components/ForumCard/ForumCard.jsx
import React from "react";
import "./ForumCard.css";

const ForumCard = ({ forum }) => {
  return (
    <div className="forum-card">
      <h3 className="forum-title">{forum.title}</h3>
      <p className="forum-description">{forum.description}</p>
      <p className="forum-meta">
        Created by {forum.created_by || "Anonymous"} •{" "}
        {new Date(forum.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ForumCard;
