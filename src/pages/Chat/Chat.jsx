import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Chat.css";

const Chat = ({ otherUserId }) => {
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      createOrGetConversation(data.user.id);
    });
  }, []);

  const createOrGetConversation = async (userId) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(user_one.eq.${userId},user_two.eq.${otherUserId}),
         and(user_one.eq.${otherUserId},user_two.eq.${userId})`
      )
      .single();

    if (data) {
      setConversationId(data.id);
      fetchMessages(data.id);
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          user_one: userId,
          user_two: otherUserId
        })
        .select()
        .single();

      setConversationId(newConv.id);
    }
  };

  const fetchMessages = async (convId) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at");

    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: text
    });

    setText("");
    fetchMessages(conversationId);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat</div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.sender_id === user?.id ? "sent" : "received"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;