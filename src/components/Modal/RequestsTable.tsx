import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequestItem } from './useRequestFilters';

export interface RequestsTableProps {
  filteredRequests: RequestItem[];
}

const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.22rem 0.65rem',
  borderRadius: '999px',
  backgroundColor: `${color}18`,
  color,
  fontWeight: 700,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  border: `1px solid ${color}28`,
});



const RequestsTable: React.FC<RequestsTableProps> = ({ filteredRequests }) => {
  const navigate = useNavigate();

  if (filteredRequests.length === 0) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '3rem', color: '#475569', fontSize: '0.98rem',
      }}>
        לא נמצאו פניות מתאימות עם המסננים הנוכחיים.
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      overflowY: 'auto',
      maxHeight: 'calc(90vh - 220px)',
      direction: 'rtl',
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: '14px',
      border: '1px solid rgba(15,23,42,0.08)',
      backgroundColor: '#ffffff',
    }}>
      {filteredRequests.map((req, index) => {

        return (
          <div
            key={req.id}
            onClick={() => navigate(`/request/${req.id}`)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              cursor: 'pointer',
              borderBottom: index < filteredRequests.length - 1
                ? '1px solid rgba(15,23,42,0.07)'
                : 'none',
              backgroundColor: '#ffffff',
              transition: 'background-color 120ms ease',
              direction: 'rtl',
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
              minHeight: '80px',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#ffffff';
            }}
          >
            {/* ── עמודה שמאלית: badge + תאריך ── */}
            <div style={{
              width: '105px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '1rem 0.75rem 1rem 0.5rem',
              gap: '0.4rem',
              borderLeft: '1px solid rgba(15,23,42,0.06)',
            }}>
              <span style={badgeStyle(req.statusColor)}>{req.statusText}</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {req.createdAt
                  ? new Date(req.createdAt).toLocaleDateString('he-IL')
                  : '-'}
              </span>
              {req.urgent && (
                <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>⚡ דחוף</span>
              )}
              {req.sla && (
                <span style={{ fontSize: '0.7rem', color: '#9333ea', fontWeight: 700 }}>⏱ SLA</span>
              )}
            </div>

            {/* ── גוף הכרטיסייה ── */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0.85rem 1.1rem',
              gap: '0.45rem',
              minWidth: 0,
            }}>

              {/* שורה 1: מספר פנייה + נושא */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                flexWrap: 'nowrap',
                overflow: 'hidden',
              }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                  #{req.id}
                </span>
                {req.topic && (
                  <>
                    <span style={{ color: '#cbd5e1', flexShrink: 0 }}>›</span>
                    <span style={{
                      fontSize: '0.9rem', fontWeight: 600, color: '#1e293b',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {req.topic}
                    </span>
                  </>
                )}
              </div>

              {/* שורה 2: פרטים — בלי כותרות */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                flexWrap: 'wrap',
                fontSize: '0.78rem',
                color: '#64748b',
              }}>
                {/* אווטאר + שם + ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <img
                    src="/img/anonimi.webp"
                    alt={req.patient}
                    style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      objectFit: 'cover', flexShrink: 0,
                      boxShadow: '0 0 0 2px rgba(15,23,42,0.1)',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.82rem' }}>{req.patient}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{req.patientId}</span>
                  </div>
                </div>

                <Dot />

                {/* יחידה */}
                <span>{req.unit}</span>

                <Dot />

                {/* מחוז */}
                <span>{req.district}</span>

                <Dot />

                {/* מחלקה + גורם מטפל מתחתיה */}
                <span style={{ fontWeight: 500, color: '#475569' }}>{req.department}</span>
                {req.handler && (
                  <span style={{ color: '#94a3b8', fontSize: '0.71rem' }}>({req.handler})</span>
                )}

                {/* תאריך עדכון עם כותרת */}
                {req.closedAt && (
                  <>
                    <Dot />
                    <span style={{ color: '#94a3b8' }}>
                      תאריך עדכון:{' '}
                      <span style={{ color: '#64748b', fontWeight: 500 }}>
                        {new Date(req.closedAt).toLocaleDateString('he-IL')}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Dot: React.FC = () => (
  <span style={{ color: '#cbd5e1', fontSize: '0.65rem', flexShrink: 0, userSelect: 'none' }}>·</span>
);

export default RequestsTable;
