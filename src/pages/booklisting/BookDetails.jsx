import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import '../../CSS/book-details.css';

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchBookDetails();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(user) setUserId(user.id);
  }

  const fetchBookDetails = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*') // You can also join profiles here if you want owner name
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      navigate('/'); // Redirect home if error
    } else {
      setBook(data);
    }
  };

  const handleRequest = async () => {
    if (!userId) return alert("Please log in!");
    
    // 1. Send Request
    const { error } = await supabase
      .from('requests')
      .insert([{ book_id: book.id, requester_id: userId }]);

    if (error) alert(error.message);
    else alert("Request sent! The owner will be notified.");
  };

  if (!book) return <div className="loading">Loading details...</div>;

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
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{book.description || "No description provided."}</p>
          </div>

          {userId !== book.owner_id && (
            <button className="big-request-btn" onClick={handleRequest}>
              Request Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;