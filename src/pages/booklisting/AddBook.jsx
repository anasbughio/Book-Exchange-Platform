import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { calculateBookValue } from '../../utils/aiValuation'; // Import logic
import '../../CSS/addBook.css';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  // New State for Points
  const [calculatedPoints, setCalculatedPoints] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'Good',
    description: '',
    pickup_location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset points if they change details (forces re-calculation)
    if (['title', 'author', 'condition'].includes(e.target.name)) {
      setCalculatedPoints(null);
    }
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  // --- THE "AI" BUTTON HANDLER ---
  const handleCalculateValue = () => {
    if (!formData.title || !formData.author) {
      alert("Please enter Title and Author first.");
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate AI API delay (makes it feel more realistic)
    setTimeout(() => {
      const value = calculateBookValue(formData.title, formData.author, formData.condition);
      setCalculatedPoints(value);
      setIsCalculating(false);
    }, 1000); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!calculatedPoints) {
      alert("Please calculate the book value first!");
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in!");

    // Image Upload Logic (Same as before)
    let publicImageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('book-covers').upload(fileName, imageFile);
        
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('book-covers').getPublicUrl(fileName);
        publicImageUrl = publicUrl;
      }
    }

    // Insert Data with DYNAMIC POINTS
    const { error } = await supabase
      .from('books')
      .insert([
        {
          title: formData.title,
          author: formData.author,
          condition: formData.condition,
          description: formData.description,
          pickup_location: formData.pickup_location,
          image_url: publicImageUrl,
          owner_id: user.id,
          points_cost: calculatedPoints // <--- SAVING THE AI VALUE
        }
      ]);

    if (error) alert(error.message);
    else {
      alert(`Book listed! Value set to ${calculatedPoints} points.`);
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="add-book-container">
      <div className="form-card">
        <h2>📚 List a Book</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label>Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
             <div className="form-group half-width">
              <label>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="form-group half-width">
              <label>Pickup Location</label>
              <input type="text" name="pickup_location" value={formData.pickup_location} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Book Cover</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
          </div>

          {/* --- AI VALUATION SECTION --- */}
          <div className="valuation-box" style={{ background: '#eff6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1e40af' }}>🤖 AI Price Valuation</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#60a5fa' }}>Based on condition, demand & rarity.</p>
              </div>
              
              {calculatedPoints ? (
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                  {calculatedPoints} pts
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={handleCalculateValue}
                  disabled={isCalculating}
                  style={{ background: '#2563eb', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {isCalculating ? 'Analyzing...' : 'Calculate Value'}
                </button>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !calculatedPoints}>
            {loading ? 'Listing...' : 'List Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
