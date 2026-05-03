import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  BarChart2, 
  Library, 
  User, 
  MessageSquare, 
  Flame, 
  Compass, 
  Book, 
  TrendingUp, 
  Globe, 
  Cpu, 
  Languages,
  Send,
  Maximize2,
  Minimize2,
  Zap,
  Camera,
  AlertTriangle,
  Star
} from 'lucide-react';

/* MODAL DE TRANSICIÓN PROACTIVA */
const PromotionModal = ({ agentId, onAccept, onDecline }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(26, 60, 108, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, animation: 'fadeIn 0.3s ease'
  }}>
    <div style={{
      background: 'white', padding: '3rem', borderRadius: '32px', textAlign: 'center',
      maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '2px solid var(--vibrant-orange)'
    }}>
      <div style={{ background: 'var(--light-orange)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Star size={40} color="var(--vibrant-orange)" />
      </div>
      <h2 style={{ color: 'var(--academic-blue)', fontSize: '2rem', marginBottom: '1rem' }}>¡Nivel Superado!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>
        Has demostrado un dominio excepcional. <strong>{agentId.toUpperCase()}</strong> tiene un desafío de nivel avanzado preparado para ti. ¿Aceptas el reto?
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={onAccept} style={{ background: 'var(--vibrant-orange)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>
          ¡ACEPTO EL RETO!
        </button>
        <button onClick={onDecline} style={{ background: 'none', border: '1px solid #E2E8F0', padding: '1rem 2rem', borderRadius: '30px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          Después
        </button>
      </div>
    </div>
  </div>
);

const TutorCard = ({ id, title, description, icon: Icon, isExpert, onClick }) => (
  <div className={`tutor-card ${isExpert ? 'expert' : ''}`} onClick={() => onClick(id)}>
    <div className="tutor-icon"><Icon size={24} /></div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const ChatRoom = ({ agentId, onClose, isNoDistractions, toggleDistractions, onSuggestion }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: `Hola Seba, soy tu tutor especializado en ${agentId}. ¿Qué resolveremos hoy?`, time: '0.1s' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    const userMsg = { id: Date.now(), role: 'user', text: inputValue, hasImage: !!selectedImage };
    setMessages(prev => [...prev, userMsg]);
    const query = inputValue;
    const img = selectedImage;
    setInputValue("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
        const response = await fetch('http://localhost:3000/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query, 
            image: img, 
            agentId, 
            rut: 'SEBA-001' 
          })
        });
        
        const resData = await response.json();
        
        if (resData.error) throw new Error(resData.error);
        
        let currentText = "";
        const aiMsgId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '', time: resData.responseTime || "0.4s" }]);
        
        let index = 0;
        const interval = setInterval(() => {
          if (index < resData.answer.length) {
            currentText += resData.answer[index];
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
            index++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            if (resData.suggestedAgent) onSuggestion(resData.suggestedAgent);
          }
        }, 20);
    } catch (e) {
        console.error("API Error:", e);
        setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Error de conexión con el backend local. Verifica que el servidor de Node esté corriendo en el puerto 3000." }]);
        setIsTyping(false);
    }
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
            {m.hasImage && <div style={{ background: '#E2E8F0', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>🖼️ Archivo Vision Analizado</div>}
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
        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result);
          reader.readAsDataURL(e.target.files[0]);
        }} />
        <button className="nav-item" onClick={() => fileInputRef.current.click()}><Camera size={24} color={selectedImage ? 'var(--vibrant-orange)' : 'var(--text-secondary)'} /></button>
        <input type="text" className="chat-input" placeholder="Escribe tu consulta..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
        <button className="send-btn" onClick={handleSend}><Send size={20} /></button>
      </div>
    </div>
  );
};

const App = () => {
  const [userName] = useState("Seba");
  const [xp] = useState(5100); // Supera el umbral de 5000 para el desafío
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isNoDistractions, setIsNoDistractions] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [suggestedAgent, setSuggestedAgent] = useState(null);

  const tutors = [
    { id: 'semilla', title: 'Semilla (1°-3°)', description: 'Fundamentos básicos.', icon: Compass },
    { id: 'explora', title: 'Explora (4°-6°)', description: 'Autonomía y rigor.', icon: Book },
    { id: 'horizonte', title: 'Horizonte (7°-1°M)', description: 'Pensamiento crítico.', icon: BarChart2 },
    { id: 'cumbre', title: 'Cumbre (2°-4°M)', description: 'Rigor superior.', icon: Flame },
    { id: 'purefinance', title: 'PureFinance', description: 'Estrategia financiera.', icon: Globe, isExpert: true },
    { id: 'puretech', title: 'PureTech', description: 'Ingeniería AI avanzada.', icon: Cpu, isExpert: true },
  ];

  const handleTutorClick = (id) => { setSelectedAgent(id); setCurrentView('chat'); };

  return (
    <div className={`dashboard-container ${isNoDistractions ? 'no-distractions' : ''}`}>
      {showPromotion && (
        <PromotionModal 
          agentId={suggestedAgent} 
          onAccept={() => { setShowPromotion(false); handleTutorClick(suggestedAgent); }}
          onDecline={() => setShowPromotion(false)}
        />
      )}
      <aside className="sidebar">
        <div className="sidebar-logo">PureStudio 4.0</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><Home /> Home</a>
          <a href="#" className="nav-item"><BarChart2 /> Dominio</a>
        </nav>
        <button className="ai-help-btn" style={{ marginTop: 'auto' }}><MessageSquare size={18} /> Ayuda IA</button>
      </aside>
      <main className="main-content">
        {!isNoDistractions && (
            <header className="top-bar">
                <h2>{currentView === 'dashboard' ? 'Centro de Dominio' : 'Sala de Chat'}</h2>
                <div className="top-bar-right">
                <div className="streak-badge"><TrendingUp size={18} /> {xp} XP</div>
                <div className="user-avatar">{userName.charAt(0)}</div>
                </div>
            </header>
        )}
        
        {currentView === 'dashboard' ? (
          <>
            <section className="welcome-banner">
              <h1>¡Hola, {userName}! 👋</h1>
              <p>Tu precisión subió un 15% ayer. ¿Hoy resolvemos Termodinámica con PureTech?</p>
            </section>
            <section>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>ELEGIR TUTOR</h2>
              <div className="tutor-grid">
                {tutors.map(tutor => <TutorCard key={tutor.id} {...tutor} onClick={handleTutorClick} />)}
              </div>
            </section>
          </>
        ) : (
          <ChatRoom 
            agentId={selectedAgent} 
            onClose={() => setCurrentView('dashboard')} 
            isNoDistractions={isNoDistractions}
            toggleDistractions={() => setIsNoDistractions(!isNoDistractions)}
            onSuggestion={(agent) => { setSuggestedAgent(agent); setShowPromotion(true); }}
          />
        )}
      </main>
    </div>
  );
};
export default App;
