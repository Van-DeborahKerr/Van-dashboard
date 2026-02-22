import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m Charlie\'s AI Assistant. Ask me about your van energy system, locations, or anything else!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotUrl, setChatbotUrl] = useState(localStorage.getItem('charlie-ai-url') || 'http://localhost:3000');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = () => {
    if (!chatbotUrl) return;
    localStorage.setItem('charlie-ai-url', chatbotUrl);
    setConnected(true);
    addMessage('assistant', 'Connected to AI Chatbot. What can I help you with?');
  };

  const addMessage = (role, content) => {
    const newMessage = {
      id: Date.now().toString(),
      role,
      content
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage('user', input);
    setInput('');
    setLoading(true);

    try {
      if (connected && chatbotUrl) {
        // Try to connect to external chatbot API
        const response = await fetch(`${chatbotUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: input }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          addMessage('assistant', data.message || 'Response received from AI');
        } else {
          addMessage('assistant', 'Unable to connect to external chatbot. Using local mode.');
        }
      } else {
        // Local mock responses
        const mockResponses = {
          battery: 'Your LiFePO4 battery is showing great performance. Keep solar input optimized.',
          solar: 'Solar panels are working well. 250W each = 500W total capacity. Monitor temperature for efficiency.',
          energy: 'Current system load is optimal. Energy consumption is within expected ranges.',
          location: 'Based on Van-Aware, you\'re in a great location for solar charging.',
          weather: 'Check your area\'s weather forecast to optimize solar panels.',
          default: 'That\'s an interesting question! I can help with energy monitoring, van locations, and system advice.'
        };

        let response = mockResponses.default;
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('battery')) response = mockResponses.battery;
        if (lowerInput.includes('solar')) response = mockResponses.solar;
        if (lowerInput.includes('energy')) response = mockResponses.energy;
        if (lowerInput.includes('location')) response = mockResponses.location;
        if (lowerInput.includes('weather')) response = mockResponses.weather;

        addMessage('assistant', response);
      }
    } catch (error) {
      addMessage('assistant', 'Sorry, I had trouble processing that. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-assistant">
      {!connected ? (
        <div className="ai-config">
          <h3>AI Assistant Setup</h3>
          <p>Connect to a Next.js AI Chatbot or use local mode</p>
          <div className="form-group">
            <label>Chatbot URL (optional)</label>
            <input
              type="text"
              value={chatbotUrl}
              onChange={(e) => setChatbotUrl(e.target.value)}
              placeholder="http://localhost:3000"
            />
            <small>Leave blank for local assistant mode</small>
          </div>
          <button className="ai-btn" onClick={handleConnect}>
            {chatbotUrl ? 'Connect to Chatbot' : 'Use Local Mode'}
          </button>
        </div>
      ) : (
        <div className="ai-chat-container">
          <div className="ai-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ai-message-${msg.role}`}>
                <div className="ai-message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-message-content">
                  <span className="ai-thinking">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input-area">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your van, energy, location, or anything..."
              rows="3"
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
