import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import '../../CSS/home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userPoints, setUserPoints] = useState(0); // <--- FIXED: Added state for points

  useEffect(() => {
    fetchBooks();
    getCurrentUserAndPoints(); // <--- FIXED: Updated function name
  }, []);

  // FIXED: Fetch User AND Points together
  const getCurrentUserAndPoints = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      
      // Fetch the points from the profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserPoints(profile.points);
      }
    }
  };

  const fetchBooks = async () => {
    // Only show 'available' books (hide exchanged ones)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('status', 'available') 
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

    // FIXED: Now 'userPoints' exists, so this check works
    const BOOK_COST = 10;
    if (userPoints < BOOK_COST) {
      alert(`❌ Not enough points! You have ${userPoints}, but need ${BOOK_COST}.`);
      return;
    }

    const confirmRequest = window.confirm("Do you want to request this book for exchange?");
    if (!confirmRequest) return;

    const { error } = await supabase
      .from('requests')
      .insert([{ book_id: bookId, requester_id: userId }]);

    if (error) {
      alert("Error requesting book: " + error.message);
    } else {
      alert("✅ Request sent! Points will be deducted when the owner accepts.");
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
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

      <div className="content-area">
        <h2>Available Books</h2>
        
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              
              /* FIXED: The 'key' is now on this outermost DIV, not inside */
              <div key={book.id} className="book-card">
                
                {/* Link for the Image */}
                <Link to={`/book/${book.id}`} className="card-link">
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
                </Link>

                <div className="card-details">
                  {/* Link for the Title */}
                  <Link to={`/book/${book.id}`} className="title-link">
                    <h3>{book.title}</h3>
                  </Link>
                  
                  <p className="author">by {book.author}</p>
                  <p className="location">📍 {book.pickup_location}</p>
                  
                  <button 
                    className="request-btn"
                    onClick={() => handleRequest(book.id, book.owner_id)}
                    disabled={userId === book.owner_id}
                  >
                    {userId === book.owner_id ? 'Your Listing' : 'Request Exchange'}
                  </button>
                </div>
              </div>

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