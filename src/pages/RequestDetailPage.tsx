import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f8fafc',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'inherit', direction: 'rtl',
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '18px',
        border: '1px solid rgba(15,23,42,0.08)', padding: '3rem 4rem',
        textAlign: 'center', maxWidth: '480px', width: '100%',
        boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          פנייה {id}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
          דף זה בפיתוח — כאן יוצגו פרטי הפנייה המלאים
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.65rem 1.75rem', borderRadius: '999px',
            backgroundColor: '#0ea5e9', color: '#fff', border: 'none',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          }}
        >
          ← חזרה לדשבורד
        </button>
      </div>
    </div>
  );
};

export default RequestDetailPage;
