import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../css/navbar.css'; // Ensure path matches your folder (lowercase 'css')

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get User and Points
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .single();
        
        if (profile) setPoints(profile.points);
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
    setIsMobile(false); // Close menu on logout
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={() => setIsMobile(false)}>
          📚 BookExchange
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
          {isMobile ? <span className="close-icon">✖</span> : <span className="hamburger-icon">☰</span>}
        </div>

        {/* Nav Links - The class 'active' shows them on mobile */}
        <ul className={isMobile ? "nav-links-mobile" : "nav-links"} onClick={() => setIsMobile(false)}>
          <li><Link to="/" className="nav-item">Home</Link></li>
          
          {user && (
            <>
              <li><Link to="/add-book" className="nav-item">List a Book</Link></li>
              <li><Link to="/my-books" className="nav-item">My Dashboard</Link></li>
              <li><Link to="/forums" className="nav-item">Forums 💬</Link></li>
              <li><Link to="/requests" className="nav-item">Requests 🔔</Link></li> 
              
              <Link to="/buy-points" style={{ textDecoration: 'none' }}>
                <div className="points-badge">
                  🏆 {points} pts <span style={{fontSize:'10px', marginLeft:'5px'}}>+</span>
                </div>
              </Link>
              
              <li><Link to="/map" className="nav-item">Map 🗺️</Link></li>
              
             
            </>
          )}

          {!user && (
             <li className="mobile-only-btn">
               <Link to="/login" className="btn-login">Login</Link>
             </li>
          )}
        </ul>

        {/* Desktop Buttons (Hidden on Mobile) */}
        <div className="auth-buttons desktop-only">
          {user ? (
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;