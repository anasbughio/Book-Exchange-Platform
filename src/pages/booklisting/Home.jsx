import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../../CSS/home.css';
import { Link } from 'react-router-dom';
const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchBooks();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchBooks = async () => {
    // Fetch all books (newest first)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.log('error', error);
    else setBooks(data);
    setLoading(false);
  };

  const handleRequest = async (bookId, ownerId) => {
    if (!userId) {
      alert("Please login to request a book!");
      return;
    }
    if (userId === ownerId) {
      alert("You cannot request your own book!");
      return;
    }

    const confirmRequest = window.confirm("Do you want to request this book for exchange?");
    if (!confirmRequest) return;

    // Create the request record
    const { error } = await supabase
      .from('requests')
      .insert([{ book_id: bookId, requester_id: userId }]);

    if (error) {
      alert("Error requesting book: " + error.message);
    } else {
      alert("Request sent! The owner will be notified.");
    }
  };

  // Filter books based on search
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* 1. Hero / Welcome Section */}
      <div className="hero-section">
        <h1>Find Your Next Great Read</h1>
        <p>Exchange books with people in your community.</p>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* 2. Books Grid */}
      <div className="content-area">
        <h2>Available Books</h2>
        
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="books-grid">

            {filteredBooks.map((book) => (
                <Link to={`/book/${book.id}`} className="card-link">
              <div key={book.id} className="book-card">
                {/* Image */}
                <div className="card-image">
                  {book.image_url ? (
                    <img src={book.image_url} alt={book.title} />
                  ) : (
                    <div className="no-image">📚</div>
                  )}
                  <span className={`condition-tag ${book.condition}`}>
                    {book.condition}
                  </span>
                </div>

                {/* Details */}
                <div className="card-details">
                  <h3>{book.title}</h3>
                  <p className="author">by {book.author}</p>
                  <p className="location">📍 {book.pickup_location}</p>
                  
                  {/* Action Button */}
                  <button 
                    className="request-btn"
                    onClick={() => handleRequest(book.id, book.owner_id)}
                    disabled={userId === book.owner_id} // Disable if it's my book
                  >
                    {userId === book.owner_id ? 'Your Listing' : 'Request Exchange'}
                  </button>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && !loading && (
          <div className="no-results">
            <p>No books found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;