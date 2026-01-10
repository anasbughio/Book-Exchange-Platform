import { Link, useNavigate } from 'react-router-dom';
import '../CSS/notfound.css';

const NotFOund = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <div className="notfound-icon">📖❓</div>
        <h2 className="notfound-title">Oops! Page Not Found</h2>
        <p className="notfound-text">
          It looks like the book you're looking for has been moved to a different shelf or doesn't exist anymore.
        </p>
       
        <div className="notfound-actions">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
     
      {/* Decorative elements */}
      <div className="bg-blur circle-1"></div>
      <div className="bg-blur circle-2"></div>
    </div>
  );
};

export default NotFOund;