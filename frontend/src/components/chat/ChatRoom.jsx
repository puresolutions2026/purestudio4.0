import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Minimize2, Maximize2, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

const ChatRoom = ({ agentId, isNoDistractions, toggleDistractions, onSuggestion }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { messages, isTyping, sendMessage } = useChat(agentId, onSuggestion);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = () => {
    sendMessage(inputValue, selectedImage);
    setInputValue("");
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="chat-room">
      <button className="mode-toggle" onClick={toggleDistractions}>
        {isNoDistractions ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        {isNoDistractions ? "Salir de Foco" : "Modo Enfoque"}
      </button>

      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.hasImage && (
              <div style={{ background: '#E2E8F0', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                🖼️ Archivo Vision Analizado
              </div>
            )}
            {m.text}
            {m.role === 'ai' && m.text.length > 20 && (
              <div className="insight-badge">
                <Zap size={12} /> Respuesta generada en {m.time}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="message ai">...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <button className="nav-item" onClick={() => fileInputRef.current.click()}>
          <Camera size={24} color={selectedImage ? 'var(--vibrant-orange)' : 'var(--text-secondary)'} />
        </button>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Escribe tu consulta..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
        />
        <button className="send-btn" onClick={handleSend}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
