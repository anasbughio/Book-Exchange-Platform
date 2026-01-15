import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../CSS/buyPoints.css';

const BuyPoints = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = async (points, price) => {
    setLoading(true);
    
    // 1. Simulate "Processing Payment" (Mock Delay)
    setTimeout(async () => {
      
      // 2. Add Points using our Secure SQL Function
      const { error } = await supabase.rpc('buy_points', { 
        points_to_add: points 
      });

      if (error) {
        alert("Payment Failed: " + error.message);
      } else {
        alert(`🎉 Success! You bought ${points} points for $${price}.`);
        navigate('/'); // Go home or to dashboard
        window.location.reload(); // Force Navbar to update points
      }
      setLoading(false);
    }, 2000); // 2 second mock delay
  };

  return (
    <div className="buy-container">
      <div className="header">
        <h1>💰 Top Up Your Points</h1>
        <p>Need more points to request books? Buy a pack instantly.</p>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing Secure Payment...</p>
        </div>
      )}

      <div className="pricing-grid">
        {/* Package 1 */}
        <div className="price-card">
          <h3>Starter Pack</h3>
          <div className="price">$5.00</div>
          <div className="points">50 Points</div>
          <ul className="features">
            <li>📚 Get ~5 Books</li>
            <li>🚀 Instant Delivery</li>
          </ul>
          <button onClick={() => handlePurchase(50, 5)} disabled={loading}>
            Buy Now
          </button>
        </div>

        {/* Package 2 (Highlighted) */}
        <div className="price-card popular">
          <div className="badge">MOST POPULAR</div>
          <h3>Reader's Choice</h3>
          <div className="price">$10.00</div>
          <div className="points">120 Points</div>
          <ul className="features">
            <li>📚 Get ~12 Books</li>
            <li>🔥 20 Bonus Points</li>
          </ul>
          <button onClick={() => handlePurchase(120, 10)} disabled={loading}>
            Buy Now
          </button>
        </div>

        {/* Package 3 */}
        <div className="price-card">
          <h3>Library Builder</h3>
          <div className="price">$25.00</div>
          <div className="points">350 Points</div>
          <ul className="features">
            <li>📚 Get ~35 Books</li>
            <li>💎 100 Bonus Points</li>
          </ul>
          <button onClick={() => handlePurchase(350, 25)} disabled={loading}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyPoints;