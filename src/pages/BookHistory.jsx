import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../CSS/bookhistory.css'; // We will create this next

const BookHistory = () => {
  const { id } = useParams(); // Book ID from URL
  const [history, setHistory] = useState([]);
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({ city: '', message: '', duration: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    // 1. Get Book Info
    const { data: bookData } = await supabase.from('books').select('*').eq('id', id).single();
    setBook(bookData);

    // 2. Get History Timeline
    const { data: historyData } = await supabase
      .from('book_history')
      .select('*')
      .eq('book_id', id)
      .order('created_at', { ascending: false }); // Newest first

    setHistory(historyData || []);
    setLoading(false);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in to add your mark!");

    // Insert new entry
    const { error } = await supabase.from('book_history').insert([{
      book_id: id,
      user_id: user.id,
      reader_name: user.email.split('@')[0], // Use email prefix as name for now
      city: formData.city,
      message: formData.message,
      reading_duration: formData.duration
    }]);

    if (error) {
      alert(error.message);
    } else {
      alert("You added to the history!");
      setFormData({ city: '', message: '', duration: '' });
      fetchData(); // Refresh list
    }
  };

  if (loading) return <div className="loading">Loading journey...</div>;

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>📖 The Journey of "{book?.title}"</h1>
        <p>See where this book has traveled.</p>
      </div>

      {/* 1. Timeline Section */}
      <div className="timeline">
        {history.length === 0 ? (
          <p className="empty-msg">No history yet. Be the first to read it!</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
                <h3>📍 {entry.city || "Unknown Location"}</h3>
                <p className="reader-note">"{entry.message}"</p>
                <div className="meta">
                  <span>👤 Read by {entry.reader_name}</span>
                  <span>⏱ took {entry.reading_duration}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Add Entry Form */}
      <div className="add-entry-box">
        <h3>✍️ Add Your Mark</h3>
        <form onSubmit={handleAddEntry}>
          <div className="input-group">
            <input 
              type="text" placeholder="Current City" required 
              value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})}
            />
            <input 
              type="text" placeholder="Reading Duration (e.g. 3 days)" required
              value={formData.duration} 
              onChange={e => setFormData({...formData, duration: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Leave a note, a tip, or your favorite quote..." 
            rows="3" required
            value={formData.message} 
            onChange={e => setFormData({...formData, message: e.target.value})}
          ></textarea>
          <button type="submit">Add to Timeline</button>
        </form>
      </div>
    </div>
  );
};

export default BookHistory;