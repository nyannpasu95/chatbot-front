import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { IoSendSharp } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever messages update
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', content: 'Error connecting to the server' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <FaRobot className="header-icon" />
          <h1>AI Chat Assistant</h1>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}-message`}>
              <div className="message-icon">
                {message.type === 'bot' && <FaRobot />}
                {message.type === 'user' && <FaUser />}
                {message.type === 'error' && <BiError />}
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message loading">
              <div className="message-icon">
                <AiOutlineLoading3Quarters className="spinning" />
              </div>
              <div className="message-content">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            <IoSendSharp />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;