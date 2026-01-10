import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../../CSS/AddBook.css';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Store the actual file
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'Good',
    description: '',
    pickup_location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Check User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in first!");
      setLoading(false);
      return;
    }

    let publicImageUrl = null;

    // 2. Upload Image (If one was selected)
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Create unique name
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-covers') // Make sure you created this bucket in Supabase!
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);
        
      publicImageUrl = publicUrl;
    }

    // 3. Save Book Data to Database
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
          owner_id: user.id
        }
      ]);

    if (error) {
      alert('Error saving book: ' + error.message);
    } else {
  alert('Book listed successfully! 🏆 You earned 5 points!'); // Update the message
  
  // Reset form
  setFormData({ 
    title: '', author: '', condition: 'Good', description: '', pickup_location: '' 
  });
  setImageFile(null);
  
  // OPTIONAL: Reload the page to refresh the points in the Navbar
  window.location.reload(); 
}
    setLoading(false);
  };

  return (
    <div className="add-book-container">
      <div className="form-card">
        <h2>📚 Add a New Book</h2>
        <p className="form-subtitle">Fill in the details to exchange your book</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* Title & Author */}
          <div className="form-row">
            <div className="form-group half-width">
              <label>Title</label>
              <input type="text" name="title" placeholder="Book Title" 
                value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label>Author</label>
              <input type="text" name="author" placeholder="Author Name" 
                value={formData.author} onChange={handleChange} required />
            </div>
          </div>

          {/* Condition & Pickup Location */}
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
              <input type="text" name="pickup_location" placeholder="City or Area" 
                value={formData.pickup_location} onChange={handleChange} required />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" placeholder="Short description..." 
              value={formData.description} onChange={handleChange}></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Book Cover Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="file-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Uploading...' : 'List Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;