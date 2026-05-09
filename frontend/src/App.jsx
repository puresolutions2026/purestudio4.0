import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import Sidebar from './components/layout/Sidebar';
import StudentDashboard from './pages/student/StudentDashboard';

const App = () => {
  const [userName] = useState("Seba");
  const [xp] = useState(5100);
  const [isNoDistractions, setIsNoDistractions] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [suggestedAgent, setSuggestedAgent] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const navigate = useNavigate();

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
    navigate('/chat');
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

      <Sidebar setCurrentView={(view) => navigate(view === 'dashboard' ? '/' : `/${view}`)} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              {!isNoDistractions && (
                <header className="top-bar">
                  <h2>Centro de Dominio</h2>
                  <div className="top-bar-right">
                    <div className="streak-badge"><TrendingUp size={18} /> {xp} XP</div>
                    <div className="user-avatar">{userName.charAt(0)}</div>
                  </div>
                </header>
              )}
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
          } />
          
          <Route path="/chat" element={
            <ChatRoom 
              agentId={selectedAgent} 
              isNoDistractions={isNoDistractions}
              toggleDistractions={() => setIsNoDistractions(!isNoDistractions)}
              onSuggestion={handleSuggestion}
            />
          } />

          <Route path="/student" element={<StudentDashboard userName={userName} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
