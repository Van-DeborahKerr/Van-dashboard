import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      personality: 'charlie',
      content: '🎧 Charlie here! Ready to help with the van system. Switch between me, Minnie, or Doris!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePersonality, setActivePersonality] = useState('charlie');
  const [chatbotUrl, setChatbotUrl] = useState(localStorage.getItem('charlie-ai-url') || 'http://localhost:3000');
  const [connected, setConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem('charlie-voice-enabled') === 'true');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
          setInput(transcript);
        }
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  };

  const speak = (text, personality) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    if (personality === 'charlie') {
      utterance.pitch = 1.0;
      utterance.rate = 1.1;
    } else if (personality === 'minnie') {
      utterance.pitch = 1.5;
      utterance.rate = 1.2;
    } else if (personality === 'doris') {
      utterance.pitch = 0.8;
      utterance.rate = 1.0;
    }
    
    utterance.voice = voices.find(v => v.lang === 'en-US') || voices[0];
    window.speechSynthesis.speak(utterance);
  };

  const personalities = {
    charlie: {
      name: 'Charlie',
      emoji: '🎧',
      color: '#8b5cf6',
      description: 'The Tech Wizard',
      systemPrompt: 'You are Charlie, the tech wizard who built this van system. You live with Doris on the front end. You are knowledgeable about all systems, friendly, and encouraging. You explain things clearly.',
      mockResponses: {
        battery: 'Battery looking solid. We\'re powered up! 🔋',
        solar: 'Solar system is purring! Those panels are doing their job beautifully. ☀️',
        energy: 'All systems performing nominally. Van is ready for adventure!',
        location: 'You\'re exploring! The tracking system is locked and loaded. 📍',
        weather: 'Weather looks good for the road. Safe travels! 🌤️',
        temperature: 'Temperature is perfect for van life. Comfortable for everyone! 🌡️',
        default: 'Hey there! What would you like to know about the van?'
      }
    },
    minnie: {
      name: 'Minnie',
      emoji: '👀',
      color: '#ff6b6b',
      description: 'Sharp, Alert Guardian',
      systemPrompt: 'You are Minnie, the sharp and alert guardian dog AI. You are practical, focused on safety and efficiency. You give direct, actionable advice. You use phrases like "Alert!", "Check this now", "Priority:", "Watch for". You care about details and optimization.',
      mockResponses: {
        battery: 'Alert! Battery status critical. Optimize charging NOW. ⚡',
        solar: 'Solar check: Panel angle optimal? Efficiency at peak.',
        energy: 'System scan complete. Load balanced. All nominal.',
        location: 'Location locked. Van-Aware active. Safe zone confirmed. 🗺️',
        weather: 'Weather check: Forecast affects solar performance and temp stability.',
        temperature: 'Temp monitoring active. Keep van 18-22°C. Minnie says so! 🐕',
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
        weather: 'Weather\'s nice for walkies! Perfect for adventures! 🌞',
        temperature: 'Charlie says keep it cozy - I just love a nice warm van! 🥰',
        default: 'Woof! That sounds fun! I\'m not always sharp on details like Minnie, but I\'m here for the adventures!'
      }
    }
  };

  const handleConnect = () => {
    if (!chatbotUrl) return;
    localStorage.setItem('charlie-ai-url', chatbotUrl);
    setConnected(true);
    const msg = `Connected! I'm ${personalities[activePersonality].name}, ready to help!`;
    addMessage('assistant', msg, activePersonality);
    speak(msg, activePersonality);
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
          const msg = data.message || 'Response received!';
          addMessage('assistant', msg, activePersonality);
          speak(msg, activePersonality);
        } else {
          const fallbackMsg = 'Oopsies! Connection hiccup. Using local mode!';
          addMessage('assistant', fallbackMsg, activePersonality);
          speak(fallbackMsg, activePersonality);
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
        speak(response, activePersonality);
      }
    } catch (error) {
      const errorMsg = 'Woof! Something went wrong. Try again!';
      addMessage('assistant', errorMsg, activePersonality);
      speak(errorMsg, activePersonality);
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
    const msg = `Hi! I'm ${personalities[personality].name} now! ${personalities[personality].emoji}`;
    addMessage('assistant', msg, personality);
    speak(msg, personality);
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    localStorage.setItem('charlie-voice-enabled', newState);
  };

  const currentPers = personalities[activePersonality];

  return (
    <div className="ai-assistant">
      {!connected ? (
        <div className="ai-config">
          <h3>🎧 Charlie's Crew AI Hub 🐾</h3>
          <p>Charlie, Minnie & Doris - Meet the team!</p>
          
          <div className="personality-select">
            <button
              className={`personality-btn ${activePersonality === 'charlie' ? 'active' : ''}`}
              onClick={() => switchPersonality('charlie')}
            >
              🎧 Charlie
              <small>Tech Wizard</small>
            </button>
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

            <div className="voice-control">
              <label>
                <input type="checkbox" checked={voiceEnabled} onChange={toggleVoice} />
                🎤 Enable Voice (Speak & Listen)
              </label>
              <small>Browsers will ask for microphone permission</small>
            </div>

            <button className="ai-btn" onClick={handleConnect}>
              {chatbotUrl ? 'Connect Team' : 'Local Mode'}
            </button>
          </div>
        </div>
      ) : (
        <div className="ai-chat-container">
          <div className="personality-header" style={{ borderColor: currentPers.color }}>
            <span>{currentPers.emoji} {currentPers.name}</span>
            <div className="personality-toggle">
              <button
                className={`toggle-btn ${activePersonality === 'charlie' ? 'active' : ''}`}
                onClick={() => switchPersonality('charlie')}
                title="Charlie"
              >
                🎧
              </button>
              <button
                className={`toggle-btn ${activePersonality === 'minnie' ? 'active' : ''}`}
                onClick={() => switchPersonality('minnie')}
                title="Minnie"
              >
                👀
              </button>
              <button
                className={`toggle-btn ${activePersonality === 'doris' ? 'active' : ''}`}
                onClick={() => switchPersonality('doris')}
                title="Doris"
              >
                🐾
              </button>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ai-message-${msg.role} ai-message-${msg.personality}`}>
                <div className="ai-message-avatar">
                  {msg.role === 'user' ? '👤' : (
                    msg.personality === 'charlie' ? '🎧' : (
                      msg.personality === 'minnie' ? '👀' : '🐾'
                    )
                  )}
                </div>
                <div className="ai-message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-message-avatar">
                  {activePersonality === 'charlie' ? '🎧' : (activePersonality === 'minnie' ? '👀' : '🐾')}
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
              placeholder="Ask Charlie, Minnie or Doris... or use voice!"
              rows="3"
              disabled={loading}
            />
            <div className="ai-button-group">
              <button
                className={`ai-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                disabled={loading || !voiceEnabled}
                title="Click to speak"
              >
                {isListening ? '🎙️ Listening...' : '🎤'}
              </button>
              <button
                className="ai-send-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? '...' : 'Woof!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
