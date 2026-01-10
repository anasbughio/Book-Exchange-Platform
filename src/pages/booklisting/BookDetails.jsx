import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import '../../CSS/book-details.css';
import QRCode from "react-qr-code"; 
import { Link } from 'react-router-dom';
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPoints, setUserPoints] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
    checkUserAndPoints();
  }, []);

  const checkUserAndPoints = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      
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

  const fetchBookDetails = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*') 
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      navigate('/'); 
    } else {
      setBook(data);
    }
    setLoading(false);
  };

  const handleRequest = async () => {
    if (!userId) return alert("Please log in!");
    
    const BOOK_COST = book.points_cost;
    
    if (userPoints < BOOK_COST) {
      alert(`❌ Not enough points! You have ${userPoints}, but you need ${BOOK_COST} to request a book.`);
      return;
    }

    if (userId === book.owner_id) {
      alert("You cannot request your own book.");
      return;
    }
    
    const { error } = await supabase
      .from('requests')
      .insert([{ book_id: book.id, requester_id: userId }]);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Request sent! Points will be deducted when the owner accepts.");
    }
  };

  if (loading || !book) return <div className="loading">Loading details...</div>;

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="details-card">
        <div className="image-section">
           {book.image_url ? (
             <img src={book.image_url} alt={book.title} />
           ) : (
             <div className="no-image-box">No Image</div>
           )}
        </div>

        <div className="info-section">
          <span className={`badge ${book.condition}`}>{book.condition}</span>
          <h1>{book.title}</h1>
          <h3 className="author">by {book.author}</h3>
          
          <div className="meta-info">
            <p><strong>📍 Pickup:</strong> {book.pickup_location}</p>
            <p><strong>📅 Listed:</strong> {new Date(book.created_at).toLocaleDateString()}</p>
            <p className="cost-info">
  💰 Cost: <strong>{book.points_cost} Points</strong>
</p>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{book.description || "No description provided."}</p>
          </div>

          {/* --- INSERTED QR CODE SECTION HERE --- */}
        {/* ... inside BookDetails.jsx ... */}

{userId === book.owner_id && (
  <div className="qr-section" style={{ marginTop: '30px', padding: '20px', background: '#f0fdf4', borderRadius: '12px', textAlign: 'center', border: '2px dashed #4ade80' }}>
    <h3 style={{margin: '0 0 10px 0', color: '#15803d'}}>🖨 QR Code for this Book</h3>
    <p style={{ fontSize: '14px', marginBottom: '15px', color: '#166534' }}>
      Print this and stick it on the book.
    </p>
    
    <div style={{ background: 'white', padding: '15px', display: 'inline-block', borderRadius: '8px', marginBottom: '15px' }}>
      <QRCode 
        value={`http://localhost:5173/history/${book.id}`} 
        size={128} 
      />
    </div>

    {/* --- ADD THIS BUTTON BELOW --- */}
    <div>
      <Link to={`/history/${book.id}`} style={{ 
        display: 'inline-block', 
        padding: '8px 16px', 
        backgroundColor: '#15803d', 
        color: 'white', 
        borderRadius: '6px', 
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        🔗 Simulate Scan (View History)
      </Link>
    </div>
    {/* ----------------------------- */}

  </div>
)}
          <div style={{ marginTop: '20px' }}>
            {userId !== book.owner_id ? (
              <button className="big-request-btn" onClick={handleRequest}>
                Request Exchange
              </button>
            ) : (
              <button className="big-request-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Your Listing
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookDetails;