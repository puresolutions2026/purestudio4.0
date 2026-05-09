import React from 'react';
import { Home, BarChart2, MessageSquare, BookOpen } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'domain', label: 'Dominio', icon: BarChart2 },
    { id: 'student', label: 'Estudiante', icon: BookOpen },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">PureStudio 4.0</div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setCurrentView?.(item.id)} 
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>

      <button className="ai-help-btn">
        <MessageSquare size={18} /> Ayuda IA
      </button>
    </aside>
  );
};

export default Sidebar;
