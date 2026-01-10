import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../CSS/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0); // <--- New State for Points
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get User and Points
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch the profile data including points
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setPoints(profile.points);
        }
      }
    };

    getUserData();

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">📚 BookExchange</Link>

        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          {user && (
            <>
              <li><Link to="/add-book" className="nav-item">List a Book</Link></li>
              <li><Link to="/my-books" className="nav-item">My Dashboard</Link></li>
            </>
          )}
        </ul>

        <div className="auth-buttons">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* POINTS BADGE */}
              <div className="points-badge">🏆 {points} pts</div>
              
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;