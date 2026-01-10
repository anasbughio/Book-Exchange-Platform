import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../CSS/MyBooks.css';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the user's books on load
  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', user.id) // ONLY get books belonging to this user
        .order('created_at', { ascending: false });

      if (error) console.log('error', error);
      else setBooks(data);
    }
    setLoading(false);
  };

  // 2. Handle Deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this book?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting book!");
    } else {
      // Remove the deleted book from the screen immediately
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  if (loading) return <div className="loading">Loading your library...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Bookshelf</h1>
        <Link to="/add-book" className="add-btn">+ List New Book</Link>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't listed any books yet.</h3>
          <p>Start exchanging by adding your first book!</p>
          <Link to="/add-book" className="empty-btn">List a Book Now</Link>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              {/* Image Handling */}
              <div className="card-image">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} />
                ) : (
                  <div className="no-image-placeholder">📚 No Image</div>
                )}
                <span className={`condition-badge ${book.condition.toLowerCase()}`}>
                  {book.condition}
                </span>
              </div>

              <div className="card-content">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                
                <div className="location-tag">
                  📍 {book.pickup_location}
                </div>

                <button 
                  onClick={() => handleDelete(book.id)} 
                  className="delete-btn"
                >
                  Remove / Exchanged
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;