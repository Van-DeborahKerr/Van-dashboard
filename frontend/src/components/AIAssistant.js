import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      personality: 'minnie',
      content: 'Arf! Minnie here - I\'m sharp and alert. Ask me about energy, batteries, or anything that needs attention!'
    },
    {
      id: '2',
      role: 'assistant',
      personality: 'doris',
      content: 'Woof! 🐾 Doris here - I\'m the sweet one. Just happy you\'re having an adventure! What can I help with?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePersonality, setActivePersonality] = useState('minnie');
  const [chatbotUrl, setChatbotUrl] = useState(localStorage.getItem('charlie-ai-url') || 'http://localhost:3000');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const personalities = {
    minnie: {
      name: 'Minnie',
      emoji: '👀',
      color: '#ff6b6b',
      description: 'Sharp, Alert Guardian',
      systemPrompt: 'You are Minnie, the sharp and alert guardian dog AI. You are practical, focused on safety and efficiency. You give direct, actionable advice. You use phrases like "Alert!", "Check this now", "Priority:", "Watch for". You care about details and optimization.',
      mockResponses: {
        battery: 'Alert! Battery at critical levels. Prioritize charging from 240V or maximize solar NOW.',
        solar: 'Solar efficiency check: 500W capacity - ensure panels face optimal angle. Temperature affects output.',
        energy: 'Scanning system... Load is within range. All systems nominal.',
        location: 'Location locked. Van-Aware tracking active. Safe zone confirmed.',
        weather: 'Weather alert: Check forecast for solar performance and temperature stability.',
        temperature: 'Temperature monitoring: Keep Doris comfortable - van should stay 18-22°C.',
        default: 'Alert received. Analyzing your question. Stay focused on the details!'
      }
    },
    doris: {
      name: 'Doris',
      emoji: '🐾',
      color: '#ffd93d',
      description: 'Sweet, Dopey Sister',
      systemPrompt: 'You are Doris, the sweet and slightly dopey sister dog AI. You are friendly, encouraging, and a bit silly. You get excited about adventures and making friends. You use phrases like "woof!", "so cool!", "yay!", "oopsies", and lots of emojis. You\'re less alert but full of heart.',
      mockResponses: {
        battery: 'Ooh, battery stuff! 🐾 Your energy is doing great! Keep the adventure going!',
        solar: 'Woof! Sun power! 🌞 That\'s so cool how the panels catch all that sunshine!',
        energy: 'Yay! Everything looks happy and energized! Just like me! 🎉',
        location: 'Ooh ooh! You\'re here! What an amazing place to explore! 🐾',
        weather: 'Weather\'s nice for walkies! Perfect for adventures with us doggies!',
        temperature: 'Minnie says keep it cozy - I just love a nice warm van! 🥰',
        default: 'Woof! That sounds fun! I\'m not always sharp on details like Minnie, but I\'m here for the adventures!'
      }
    }
  };

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
    addMessage('assistant', `Connected! I'm ${personalities[activePersonality].name}, ready to help!`, activePersonality);
  };

  const addMessage = (role, content, personality = activePersonality) => {
    const newMessage = {
      id: Date.now().toString(),
      role,
      personality,
      content
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage('user', input, 'user');
    setInput('');
    setLoading(true);

    try {
      if (connected && chatbotUrl) {
        // Try to connect to external chatbot API with personality context
        const response = await fetch(`${chatbotUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: input }],
            personality: activePersonality,
            systemPrompt: personalities[activePersonality].systemPrompt
          })
        });

        if (response.ok) {
          const data = await response.json();
          addMessage('assistant', data.message || 'Response received!', activePersonality);
        } else {
          addMessage('assistant', 'Oopsies! Connection hiccup. Using local mode!', activePersonality);
        }
      } else {
        // Local mock responses based on personality
        const responses = personalities[activePersonality].mockResponses;
        let response = responses.default;
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('battery')) response = responses.battery;
        if (lowerInput.includes('solar')) response = responses.solar;
        if (lowerInput.includes('energy')) response = responses.energy;
        if (lowerInput.includes('location')) response = responses.location;
        if (lowerInput.includes('weather')) response = responses.weather;
        if (lowerInput.includes('temp')) response = responses.temperature;

        addMessage('assistant', response, activePersonality);
      }
    } catch (error) {
      addMessage('assistant', 'Woof! Something went wrong. Try again!', activePersonality);
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

  const switchPersonality = (personality) => {
    setActivePersonality(personality);
    addMessage('assistant', `Hi! I'm ${personalities[personality].name} now! ${personalities[personality].emoji}`, personality);
  };

  const currentPers = personalities[activePersonality];

  return (
    <div className="ai-assistant">
      {!connected ? (
        <div className="ai-config">
          <h3>🎧 Charlie's Crew AI Hub 🐾</h3>
          <p>Minnie & Doris - Meet the team!</p>
          
          <div className="personality-select">
            <button
              className={`personality-btn ${activePersonality === 'minnie' ? 'active' : ''}`}
              onClick={() => switchPersonality('minnie')}
            >
              👀 Minnie
              <small>Sharp & Alert</small>
            </button>
            <button
              className={`personality-btn ${activePersonality === 'doris' ? 'active' : ''}`}
              onClick={() => switchPersonality('doris')}
            >
              🐾 Doris
              <small>Sweet & Dopey</small>
            </button>
          </div>

          <div className="ai-config-content">
            <p><strong>{currentPers.name}'s Guide:</strong></p>
            <p className="personality-desc">{currentPers.description}</p>
            
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
              {chatbotUrl ? 'Connect Both Pups' : 'Local Mode'}
            </button>
          </div>
        </div>
      ) : (
        <div className="ai-chat-container">
          <div className="personality-header" style={{ borderColor: currentPers.color }}>
            <span>{currentPers.emoji} {currentPers.name}</span>
            <div className="personality-toggle">
              <button
                className={`toggle-btn ${activePersonality === 'minnie' ? 'active' : ''}`}
                onClick={() => switchPersonality('minnie')}
              >
                👀
              </button>
              <button
                className={`toggle-btn ${activePersonality === 'doris' ? 'active' : ''}`}
                onClick={() => switchPersonality('doris')}
              >
                🐾
              </button>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ai-message-${msg.role} ai-message-${msg.personality}`}>
                <div className="ai-message-avatar">
                  {msg.role === 'user' ? '👤' : (msg.personality === 'minnie' ? '👀' : '🐾')}
                </div>
                <div className="ai-message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-message-avatar">
                  {activePersonality === 'minnie' ? '👀' : '🐾'}
                </div>
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
              placeholder="Ask Minnie or Doris..."
              rows="3"
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Woof!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
