import React from 'react';
import { Star } from 'lucide-react';

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
        Has demostrado un dominio excepcional. <strong>{agentId?.toUpperCase()}</strong> tiene un desafío de nivel avanzado preparado para ti. ¿Aceptas el reto?
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

export default PromotionModal;
