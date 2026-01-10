import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../CSS/notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setNotifications(data || []);
  };

  return (
    <div className="notif-container">
      <h2>🔔 Notifications</h2>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="notif-item">
              <span className="notif-message">{n.message}</span>
              <span className="notif-date">
                {new Date(n.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;