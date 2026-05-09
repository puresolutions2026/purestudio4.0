import React from 'react';
import { Bell } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import './StudentDashboard.css';

const StudentDashboard = ({ userName = "Estudiante" }) => {
  return (
    <div className="student-dashboard">
      <Sidebar currentView="dashboard" />

      <main className="student-main">
        <header className="student-header">
          <div className="header-left">
            <h2 className="header-title">Panel General</h2>
          </div>
          
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={22} />
            </button>
            
            <div className="user-identity">
              <div className="user-name-tag">{userName}</div>
              <span className="user-role-badge">Estudiante</span>
              <div className="user-avatar-small">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <section className="content-card">
          <div className="welcome-msg">
            <h1>¡Bienvenido de vuelta, {userName}! 👋</h1>
            <p>Es un excelente día para continuar con tus desafíos de aprendizaje.</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Puntos Acumulados</span>
              <p className="stat-value">5,100 XP</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Racha Actual</span>
              <p className="stat-value highlight">12 Días</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Desafíos Pendientes</span>
              <p className="stat-value success">4</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
