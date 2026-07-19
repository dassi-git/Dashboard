import type { RequestItem } from '../../services/api';

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
  onOpenClosedRequests?: () => void;
  transitionVersion?: number;
  selectedClosedYear?: number;
  onClosedYearChange?: (year: number) => void;
  closedYearOptions?: number[];
};

export default function KpiGrid({ data, activeKpi, onKpiSelect, transitionVersion = 0, selectedClosedYear, onClosedYearChange, closedYearOptions = [] }: Props) {

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
              <div
                key={`value-${transitionVersion}-${card.id}`}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: isActive ? theme.activeText : theme.defaultNumberColor,
                  marginTop: '1px',
                  lineHeight: 1,
                  transition: 'opacity 360ms ease, transform 360ms ease, color 360ms ease',
                  willChange: 'opacity, transform',
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* שורה שנייה - נסגרו בשנה האחרונה */}
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
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: activeKpi === 'closed_30d' ? '#16a34a' : '#475569' }}>
            {`נסגרו בשנת ${selectedClosedYear ?? new Date().getFullYear() - 1}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            key={`closed-${transitionVersion}`}
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#16a34a',
              transition: 'opacity 360ms ease, transform 360ms ease',
              willChange: 'opacity, transform',
              opacity: 1,
              transform: 'translateY(0)',
            }}
          >
            {data.closedLast30Days}
          </span>
          {closedYearOptions.length > 0 && (
            <select
              value={selectedClosedYear ?? ''}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onClosedYearChange?.(Number(event.target.value))}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#334155',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '86px',
              }}
              aria-label="בחר שנה"
            >
              {closedYearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* הטבלה נפתחת דרך RequestsModal ב-MainLayout */}
    </div>
  );
}
