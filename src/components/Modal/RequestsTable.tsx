import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequestItem } from './useRequestFilters';

const tableContainerStyle: React.CSSProperties = {
  borderRadius: '18px',
  border: '1px solid rgba(15,23,42,0.06)',
  overflow: 'hidden',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
};

const tableScrollStyle: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 220px)',
  minHeight: 0,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  direction: 'rtl',
};

const thStyle: React.CSSProperties = {
  textAlign: 'right',
  padding: '0.95rem 1rem',
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  fontWeight: 700,
  fontSize: '0.92rem',
    borderBottom: '1px solid rgba(15,23,42,0.06)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const tdStyle: React.CSSProperties = {
  padding: '0.95rem 1rem',
    borderBottom: '1px solid rgba(15,23,42,0.04)',
  fontSize: '0.92rem',
  color: '#334155',
};

const statusBadgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.45rem 0.75rem',
  borderRadius: '999px',
  backgroundColor: `${color}20`,
  color: color,
  fontWeight: 600,
  fontSize: '0.85rem',
});

const noResultsStyle: React.CSSProperties = {
  padding: '2rem',
  textAlign: 'center',
  color: '#475569',
  fontSize: '0.98rem',
};

export interface RequestsTableProps {
  filteredRequests: RequestItem[];
}

const RequestsTable: React.FC<RequestsTableProps> = ({ filteredRequests }) => {
  const navigate = useNavigate();
  return (
    <div style={tableContainerStyle}>
      <div style={tableScrollStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th scope="col" style={thStyle}>מספר פנייה</th>
              <th scope="col" style={thStyle}>חולה</th>
              <th scope="col" style={thStyle}>יחידה</th>
              <th scope="col" style={thStyle}>תאריך קבלה</th>
              <th scope="col" style={thStyle}>תאריך עדכון</th>
              <th scope="col" style={thStyle}>גורם מטפל</th>
              <th scope="col" style={thStyle}>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} style={noResultsStyle}>לא נמצאו פניות מתאימות עם המסננים הנוכחיים.</td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => navigate(`/request/${request.id}`)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td style={tdStyle}>{request.id}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '6px',
                        backgroundColor: '#e0f2fe', color: '#0369a1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                      }}>
                        {request.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>{request.patientId}</div>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, textAlign: 'center' }}>{request.patient}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>{request.unit}</td>
                  <td style={tdStyle}>{request.createdAt ? new Date(request.createdAt).toLocaleDateString('he-IL') : '-'}</td>
                  <td style={tdStyle}>{request.closedAt ? new Date(request.closedAt).toLocaleDateString('he-IL') : '-'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>{request.department}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{request.handler}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <span style={statusBadgeStyle(request.statusColor)}>{request.statusText}</span>
                      {request.urgent && (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>⚡ דחוף</span>
                      )}
                      {request.sla && (
                        <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: 600 }}>⏱ חריגת SLA</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;
