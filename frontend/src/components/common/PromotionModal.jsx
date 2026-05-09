import React from 'react';
import { Star } from 'lucide-react';
import './PromotionModal.css';

const PromotionModal = ({ agentId, onAccept, onDecline }) => (
  <div className="promotion-modal-overlay">
    <div className="promotion-modal-content">
      <div className="promotion-modal-icon-container">
        <Star size={40} color="var(--vibrant-orange)" />
      </div>
      <h2 className="promotion-modal-title">¡Nivel Superado!</h2>
      <p className="promotion-modal-description">
        Has demostrado un dominio excepcional. <strong>{agentId?.toUpperCase()}</strong> tiene un desafío de nivel avanzado preparado para ti. ¿Aceptas el reto?
      </p>
      <div className="promotion-modal-actions">
        <button onClick={onAccept} className="promotion-modal-btn-accept">
          ¡ACEPTO EL RETO!
        </button>
        <button onClick={onDecline} className="promotion-modal-btn-decline">
          Después
        </button>
      </div>
    </div>
  </div>
);

export default PromotionModal;
