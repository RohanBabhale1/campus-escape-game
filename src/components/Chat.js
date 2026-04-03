import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const Chat = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Determine the socket URL. When running in docker behind nginx, we can use the current host.
    // In dev, it might be localhost:5000, but using proxy logic `/socket.io/` should work via NGINX.
    // If not using Nginx locally for React (React dev server on 3000), we should point to port 5000 directly.
    const isDev = window.location.port === '3000' && window.location.hostname === 'localhost';
    const socketUrl = isDev ? 'http://localhost:5000' : '/';
    
    // Connect to Socket.IO
    socketRef.current = io(socketUrl, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'] // Try websocket first
    });

    socketRef.current.on('connect', () => {
      setIsConnecting(false);
    });

    socketRef.current.on('initialMessages', (data) => {
      setMessages(data);
      scrollToBottom();
    });

    socketRef.current.on('message', (newMessage) => {
      setMessages((prev) => {
        // Keep only last 50 messages on client side to prevent memory leak
        const updated = [...prev, newMessage];
        if (updated.length > 50) return updated.slice(updated.length - 50);
        return updated;
      });
      // Small timeout to allow DOM to update
      setTimeout(scrollToBottom, 50);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnecting(true);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isConnecting) return;

    const currentUsername = user?.username || 'Anonymous';
    
    socketRef.current.emit('chatMessage', {
      username: currentUsername,
      text: inputText.trim()
    });

    setInputText('');
  };

  if (!isOpen) {
    return (
      <div className="chat-fab" onClick={() => setIsOpen(true)} title="Global Chat (K)">
        💬
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Global Chat</h3>
        <button 
          className="toggle-btn" 
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        >
          ▼
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && !isConnecting && (
          <div style={{ textAlign: 'center', color: '#a0a0b0', marginTop: '20px' }}>
            No messages yet. Be the first to say hi!
          </div>
        )}
        {isConnecting && (
          <div style={{ textAlign: 'center', color: '#a0a0b0', marginTop: '20px' }}>
            Connecting to chat...
          </div>
        )}
        {messages.map((msg, idx) => {
          const isSelf = msg.username === user?.username;
          return (
            <div key={idx} className={`message ${isSelf ? 'self' : 'other'}`}>
              <div className="message-sender">
                {isSelf ? 'You' : msg.username}
              </div>
              <div className="message-bubble">{msg.text}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={sendMessage} className="chat-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isConnecting}
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || isConnecting}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
