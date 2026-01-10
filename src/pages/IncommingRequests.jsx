import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../CSS/incommingRequests.css';

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

 // src/pages/IncomingRequests.jsx

const fetchRequests = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('requests')
    .select(`
      id,
      status,
      created_at,
      book:books!inner (title, owner_id), 
      requester:profiles (email)
    `)
    // The "!inner" is CRITICAL. It tells Supabase: 
    // "Filter the requests based on the book connection we just made"
    .eq('book.owner_id', user.id) 
    .eq('status', 'pending');

  if (error) {
    console.log("Error fetching requests:", error);
  } else {
    // Check if data is null before setting
    setRequests(data || []);
  }
  setLoading(false);
};

  const handleAccept = async (requestId) => {
    const confirm = window.confirm("Accept this exchange? Points will be transferred.");
    if (!confirm) return;

    // Call the SQL Function we wrote in Step 1
    const { error } = await supabase.rpc('accept_exchange', { 
      request_id_input: requestId 
    });

    if (error) {
      alert("Failed: " + error.message);
    } else {
      alert("Exchange Successful! Points transferred.");
      // Remove from list
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  const handleReject = async (requestId) => {
    const { error } = await supabase
      .from('requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
    
    if (!error) setRequests(requests.filter(r => r.id !== requestId));
  };

  if (loading) return <div className="loading">Loading requests...</div>;

  return (
    <div className="requests-container">
      <h2>📬 Incoming Book Requests</h2>
      
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="req-info">
                 <h3>{req.book.title}</h3>
                 <p>Requested by: {req.requester?.email || "Unknown User"}</p>
                 <span className="date">{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
              <div className="req-actions">
                <button onClick={() => handleAccept(req.id)} className="btn-accept">✔ Accept</button>
                <button onClick={() => handleReject(req.id)} className="btn-reject">✖ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;