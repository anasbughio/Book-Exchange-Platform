import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { checkContentSafety } from '../../utils/abuseDetection'; // Import AI logic
import '../../CSS/forum.css';

const BookForum = () => {
  const [activeBook, setActiveBook] = useState('The Great Gatsby'); // Default topic
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch posts when the topic changes
  useEffect(() => {
    fetchPosts();
    // Real-time subscription could go here
    const interval = setInterval(fetchPosts, 5000); // Poll every 5s for updates
    return () => clearInterval(interval);
  }, [activeBook]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('book_title', activeBook)
      .order('created_at', { ascending: true });

    if (!error) setPosts(data);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setAnalyzing(true);

    // --- AI ABUSE CHECK [cite: 51] ---
    const analysis = await checkContentSafety(newPost);
    
    if (!analysis.safe) {
      alert(`🚫 Post Rejected: ${analysis.reason}\nPlease keep the community ethical.`);
      setAnalyzing(false);
      return;
    }

    // If safe, proceed to post
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please login to post.");
      setAnalyzing(false);
      return;
    }

    const { error } = await supabase
      .from('forum_posts')
      .insert([{
        book_title: activeBook,
        content: newPost,
        user_id: user.id,
        is_anonymous: isAnonymous // Stores anonymity preference [cite: 55]
      }]);

    setAnalyzing(false);

    if (error) {
      console.error(error);
      alert('Error posting comment.');
    } else {
      setNewPost('');
      fetchPosts(); // Refresh chat
    }
  };

  // Example list of active discussions
  const popularTopics = ['The Great Gatsby', '1984', 'Atomic Habits', 'Dune'];

  return (
    <div className="forum-container">
      {/* Sidebar: Active Topics */}
      <div className="topics-sidebar">
        <h3>🔥 Active Discussions</h3>
        <ul>
          {popularTopics.map((title) => (
            <li 
              key={title} 
              className={activeBook === title ? 'active' : ''}
              onClick={() => setActiveBook(title)}
            >
              #{title.replace(/\s+/g, '')}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <h2>📖 {activeBook}</h2>
          <span className="subtitle">Community Discussion & Debates</span>
        </div>

        <div className="posts-feed">
          {posts.length === 0 ? (
            <p className="empty-state">No discussions yet. Be the first!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={`post-bubble ${post.is_anonymous ? 'anon' : ''}`}>
                <div className="post-meta">
                  <strong>{post.is_anonymous ? '🕵️ Anonymous Reader' : '👤 Member'}</strong>
                  <span> • {new Date(post.created_at).toLocaleTimeString()}</span>
                </div>
                <p>{post.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handlePostSubmit} className="post-form">
          <div className="controls">
            <label className="anon-toggle">
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={(e) => setIsAnonymous(e.target.checked)} 
              />
              Post Anonymously
            </label>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your interpretation or theory..."
              disabled={analyzing}
            />
            <button type="submit" disabled={analyzing}>
              {analyzing ? 'AI Checking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForum;