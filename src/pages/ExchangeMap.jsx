import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { supabase } from '../supabaseClient';
import 'leaflet/dist/leaflet.css'; // CRITICAL: Import Leaflet CSS
import '../CSS/exchangemap.css';

// Fix for Leaflet default icon not showing
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle clicks on the map
const AddMarkerOnClick = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ExchangeMap = () => {
  const [points, setPoints] = useState([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newPoint, setNewPoint] = useState(null); // Temp storage for click location
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    const { data } = await supabase.from('exchange_points').select('*');
    setPoints(data || []);
  };

  const handleMapClick = (latlng) => {
    if (isAddingMode) {
      setNewPoint(latlng); // Open the form modal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return alert("Please login to add a stall!");

    const { error } = await supabase.from('exchange_points').insert([
      {
        name: formData.name,
        description: formData.description,
        lat: newPoint.lat,
        lng: newPoint.lng,
        created_by: user.id
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Exchange Point Added!");
      setIsAddingMode(false);
      setNewPoint(null);
      setFormData({ name: '', description: '' });
      fetchPoints(); // Refresh map
    }
  };

  // Default Center (e.g., Lahore or your city)
  const defaultCenter = [31.5204, 74.3587]; 

  return (
    <div className="map-page-container">
      <div className="map-sidebar">
        <h2>🗺️ Community Map</h2>
        <p>Find safe exchange spots or add your own stall.</p>
        
        <button 
          className={`toggle-btn ${isAddingMode ? 'active' : ''}`}
          onClick={() => setIsAddingMode(!isAddingMode)}
        >
          {isAddingMode ? '❌ Cancel Adding' : '📍 Add New Point'}
        </button>
        
        {isAddingMode && <p className="instruction">Click anywhere on the map to place a pin.</p>}

        {/* Form Modal (Shows only when a spot is clicked) */}
        {newPoint && (
          <div className="point-form">
            <h3>New Spot Details</h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" placeholder="Spot Name (e.g. Central Park)" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <textarea 
                placeholder="Description (e.g. Meet near the fountain)" required
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit">Confirm Location</button>
            </form>
          </div>
        )}
      </div>

      <div className="map-view">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Helper to detect clicks */}
          <AddMarkerOnClick onMapClick={handleMapClick} />

          {/* Render Existing Points */}
          {points.map(pt => (
            <Marker key={pt.id} position={[pt.lat, pt.lng]}>
              <Popup>
                <strong>{pt.name}</strong><br />
                {pt.description}
              </Popup>
            </Marker>
          ))}

          {/* Render Temporary New Point */}
          {newPoint && <Marker position={[newPoint.lat, newPoint.lng]} opacity={0.6} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default ExchangeMap;