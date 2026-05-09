import React, { useState } from 'react';
import { 
  Home, 
  BarChart2, 
  MessageSquare, 
  Flame, 
  Compass, 
  Book, 
  TrendingUp, 
  Globe, 
  Cpu 
} from 'lucide-react';

// Componentes Refactorizados
import PromotionModal from './components/common/PromotionModal';
import TutorCard from './components/dashboard/TutorCard';
import ChatRoom from './components/chat/ChatRoom';

const App = () => {
  const [userName] = useState("Seba");
  const [xp] = useState(5100);
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

  const handleTutorClick = (id) => { 
    setSelectedAgent(id); 
    setCurrentView('chat'); 
  };

  const handleSuggestion = (agent) => {
    setSuggestedAgent(agent);
    setShowPromotion(true);
  };

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
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <Home /> Home
          </button>
          <button className="nav-item">
            <BarChart2 /> Dominio
          </button>
        </nav>
        <button className="ai-help-btn">
          <MessageSquare size={18} /> Ayuda IA
        </button>
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
              <h2 className="section-title">ELEGIR TUTOR</h2>
              <div className="tutor-grid">
                {tutors.map(tutor => (
                  <TutorCard key={tutor.id} {...tutor} onClick={handleTutorClick} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <ChatRoom 
            agentId={selectedAgent} 
            isNoDistractions={isNoDistractions}
            toggleDistractions={() => setIsNoDistractions(!isNoDistractions)}
            onSuggestion={handleSuggestion}
          />
        )}
      </main>
    </div>
  );
};

export default App;
