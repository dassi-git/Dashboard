import { useState } from 'react';

export default function KpiGrid() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cardsData = [
    {
      id: 'sla',
      title: 'חריגות יעד (SLA)',
      value: '28',
      icon: ({ color }: { color: string }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 7V12L15 15"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      ),
      theme: {
        defaultIconBg: '#fff1f2',
        defaultIconColor: '#dc2626',
        defaultNumberColor: '#dc2626',
        activeBg: '#fef2f2',
        activeBorder: '#fecdd3',
        activeText: '#9f1239',
      },
    },
    {
      id: 'continuity',
      title: 'תקלות ברציפות תפקודית',
      value: '26',
      icon: ({ color }: { color: string }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.29 3.86L1.82 18C1.29 18.93 1.92 20 2.99 20H21.01C22.08 20 22.71 18.93 22.18 18L13.71 3.86C13.16 2.88 12.03 2.88 11.48 3.86Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      theme: {
        defaultIconBg: '#fff1f2',
        defaultIconColor: '#dc2626',
        defaultNumberColor: '#dc2626',
        activeBg: '#fff5f5',
        activeBorder: '#fed7d7',
        activeText: '#c53030',
      },
    },
    {
      id: 'in_progress',
      title: 'פניות בטיפול',
      value: '121',
      icon: ({ color }: { color: string }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12L19 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      theme: {
        defaultIconBg: '#eff6ff',
        defaultIconColor: '#2563eb',
        defaultNumberColor: '#2563eb',
        activeBg: '#e0f2fe',
        activeBorder: '#bae6fd',
        activeText: '#0369a1',
      },
    },
    {
      id: 'new',
      title: 'פניות חדשות',
      value: '119',
      icon: ({ color }: { color: string }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      theme: {
        defaultIconBg: '#e6f4ea',
        defaultIconColor: '#137333',
        defaultNumberColor: '#137333',
        activeBg: '#e8f5e9',
        activeBorder: '#c8e6c9',
        activeText: '#2e7d32',
      },
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '12px', direction: 'rtl' }}>
      {cardsData.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeCard === card.id;
        const { theme } = card;

        return (
          <div
            key={card.id}
            onClick={() => setActiveCard(isActive ? null : card.id)}
            style={{
              flex: 1,
              cursor: 'pointer',
              backgroundColor: isActive ? theme.activeBg : '#ffffff',
              border: `1px solid ${isActive ? theme.activeBorder : '#f1f5f9'}`,
              borderRadius: '16px',
              padding: '16px',
              boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? theme.activeText : '#475569',
                }}
              >
                {card.title}
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#ffffff' : theme.defaultIconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                <IconComponent color={isActive ? theme.activeText : theme.defaultIconColor} />
              </div>
            </div>

            <div
              style={{
                fontSize: '2.2rem',
                fontWeight: 700,
                color: isActive ? theme.activeText : theme.defaultNumberColor,
                marginTop: '8px',
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
