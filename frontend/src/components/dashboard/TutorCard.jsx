import React from 'react';
import './TutorCard.css';

const TutorCard = ({ id, title, description, icon: Icon, isExpert, onClick }) => (
  <div className={`tutor-card ${isExpert ? 'expert' : ''}`} onClick={() => onClick(id)}>
    <div className="tutor-icon"><Icon size={24} /></div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default TutorCard;
