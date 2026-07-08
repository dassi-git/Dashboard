import { useState, useMemo } from 'react';
import type { RequestItem } from '../../services/api';
import UnitsPieChart from '../Charts/UnitsPieChart';
import HandlersChart from '../Charts/HandlersChart';
import SlaByUnitChart from '../Charts/SlaByUnitChart';

function BarChart2Icon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.75 19.5V9.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.75 19.5V5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.75 19.5V13.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.75 19.5V11.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 7.5v5.25l3 1.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangleIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5l8.25 14.25H3.75L12 4.5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.5v3.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16.25h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ZapIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5L7.5 13.5h4l-1 7.5L16.5 10.5h-4l1-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.75 13.5l4.5 4.5L18.25 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type KpiGridData = {
  total: number;
  new: number;
  inProgress: number;
  urgent: number;
  slaBreaches: number;
  closedLast30Days: number;
};

type Props = {
  data: KpiGridData;
  activeKpi: string | null;
  onKpiSelect: (kpiType: string | null) => void;
  closedRequests?: RequestItem[];
};

export default function KpiGrid({ data, activeKpi, onKpiSelect, closedRequests = [] }: Props) {
  const [isTableOpen, setIsTableOpen] = useState(false);

  const unitLabels = Array.from({ length: 50 }, (_, i) => `יחידה ${i + 1}`);
  const handlerLabels = ['תומר', 'גיא', 'נועה', 'עדי', 'רועי'];

  const closedUnitsData = useMemo(
    () => unitLabels.map((u) => closedRequests.filter((r) => r.unit === u).length),
    [closedRequests]
  );
  const closedHandlersData = useMemo(
    () => handlerLabels.map((h) => closedRequests.filter((r) => r.handler === h).length),
    [closedRequests]
  );
  const closedSlaActivity = useMemo(
    () => unitLabels.map((u) => closedRequests.filter((r) => r.unit === u).length),
    [closedRequests]
  );
  const closedSlaBreaches = useMemo(
    () => unitLabels.map((u) => closedRequests.filter((r) => r.unit === u && r.sla).length),
    [closedRequests]
  );
  const cardsData = [
    {
      id: 'total',
      title: 'סה"כ פניות',
      value: String(data.total),
      icon: BarChart2Icon,
      theme: {
        defaultIconBg: '#f3e8ff',
        defaultIconColor: '#a855f7',
        defaultNumberColor: '#a855f7',
        activeBg: '#f3e8ff',
        activeBorder: '#e9d5ff',
        activeText: '#a855f7'
      }
    },
    {
      id: 'sla',
      title: 'חריגות SLA',
      value: String(data.slaBreaches),
      icon: ClockIcon,
      theme: {
        defaultIconBg: '#fff1f2',
        defaultIconColor: '#dc2626',
        defaultNumberColor: '#dc2626',
        activeBg: '#fef2f2',
        activeBorder: '#fecdd3',
        activeText: '#dc2626'
      }
    },
    {
      id: 'urgent',
      title: 'פניות דחופות',
      value: String(data.urgent),
      icon: AlertTriangleIcon,
      theme: {
        defaultIconBg: '#fff7ed',
        defaultIconColor: '#ea580c',
        defaultNumberColor: '#ea580c',
        activeBg: '#fff7ed',
        activeBorder: '#fed7aa',
        activeText: '#ea580c'
      }
    },
    {
      id: 'in_progress',
      title: 'פניות בטיפול',
      value: String(data.inProgress),
      icon: ZapIcon,
      theme: {
        defaultIconBg: '#eff6ff',
        defaultIconColor: '#2563eb',
        defaultNumberColor: '#2563eb',
        activeBg: '#e0f2fe',
        activeBorder: '#bae6fd',
        activeText: '#2563eb'
      }
    },
    {
      id: 'new',
      title: 'פניות חדשות',
      value: String(data.new),
      icon: CheckIcon,
      theme: {
        defaultIconBg: '#e6f4ea',
        defaultIconColor: '#137333',
        defaultNumberColor: '#137333',
        activeBg: '#e8f5e9',
        activeBorder: '#c8e6c9',
        activeText: '#137333'
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', direction: 'rtl' }}>
      <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
        {cardsData.map((card) => {
          const IconComponent = card.icon;
          const isActive = activeKpi === card.id;
          const { theme } = card;

          return (
            <div
              key={card.id}
              onClick={() => onKpiSelect(isActive ? null : card.id)}
              style={{
                flex: 1,
                cursor: 'pointer',
                backgroundColor: isActive ? theme.activeBg : '#ffffff',
                border: `1px solid ${isActive ? theme.activeBorder : '#f1f5f9'}`,
                borderRadius: '12px',
                padding: '3px 6px',
                boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '80px',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isActive ? theme.activeText : '#475569' }}>
                  {card.title}
                </span>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: isActive ? '#ffffff' : theme.defaultIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.04)' : 'none' }}>
                  <IconComponent color={isActive ? theme.activeText : theme.defaultIconColor} />
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isActive ? theme.activeText : theme.defaultNumberColor, marginTop: '1px', lineHeight: 1 }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* שורה שנייה - נסגרו ב-30 יום האחרונים */}
      <div
        onClick={() => onKpiSelect(activeKpi === 'closed_30d' ? null : 'closed_30d')}
        style={{
          cursor: 'pointer',
          width: 'fit-content',
          backgroundColor: activeKpi === 'closed_30d' ? '#f0fdf4' : '#ffffff',
          border: `1px solid ${activeKpi === 'closed_30d' ? '#bbf7d0' : '#f1f5f9'}`,
          borderRadius: '12px',
          padding: '6px 12px',
          boxShadow: activeKpi === 'closed_30d' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.15s ease-in-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: activeKpi === 'closed_30d' ? '#ffffff' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon color='#16a34a' />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: activeKpi === 'closed_30d' ? '#16a34a' : '#475569' }}>נסגרו ב-30 יום האחרונים</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>{data.closedLast30Days}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsTableOpen(true); }}
            style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '2px 8px', cursor: 'pointer' }}
          >
            פתח טבלה
          </button>
        </div>
      </div>

      {isTableOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.35)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
          onClick={() => setIsTableOpen(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '1100px', maxHeight: '90vh', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(2,6,23,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', direction: 'rtl' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>פניות שנסגרו ב-30 יום האחרונים ({closedRequests.length})</div>
              <button type="button" onClick={() => setIsTableOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: '#64748b', cursor: 'pointer' }}>סגור</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ padding: '1rem' }}>
                {/* גרפים */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.25rem', height: '220px', flexShrink: 0 }}>
                  <UnitsPieChart unitsData={closedUnitsData} hideTableButton />
                  <HandlersChart handlersData={closedHandlersData} />
                  <SlaByUnitChart slaActivity={closedSlaActivity} slaBreaches={closedSlaBreaches} unitsData={closedUnitsData} />
                </div>
              </div>
              {/* טבלה בלי padding כדי ש-sticky יעבוד */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['מספר פנייה', 'מטופל', 'נושא', 'יחידה', 'מחוז', 'מטפל', 'תאריך פתיחה', 'תאריך סגירה'].map((h) => (
                      <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {closedRequests.map((r, idx) => (
                    <tr key={r.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.id}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.patient}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.topic}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.unit}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.district}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.handler}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#0f172a' }}>{r.createdAt}</td>
                      <td style={{ padding: '9px 14px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>{r.closedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
