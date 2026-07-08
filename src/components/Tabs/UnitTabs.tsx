import React from 'react';

type UnitTabsProps = {
  activeUnit: string;
  onUnitSelect: (unitId: string) => void;
};

const units = [
  { id: 'all', label: 'כל היחידות' },
  { id: 'a', label: 'יחידה א' },
  { id: 'b', label: 'יחידה ב' },
  { id: 'c', label: 'יחידה ג' },
  { id: 'd', label: 'יחידה ד' },
  { id: 'e', label: 'יחידה ה' },
  { id: 'f', label: 'יחידה ו' },
  { id: 'g', label: 'יחידה ז' },
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  alignItems: 'center',
  backgroundColor: '#f3f4f6',
  padding: '0.75rem',
  borderRadius: '12px',
  direction: 'rtl',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const tabStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '5.5rem',
  padding: '0.55rem 0.95rem',
  borderRadius: '999px',
  border: '1.5px solid transparent',
  backgroundColor: 'transparent',
  color: '#374151',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 150ms ease',
  outline: 'none',
  boxShadow: 'none',
};

const activeTabStyle: React.CSSProperties = {
  backgroundColor: '#0ea5b3',
  color: '#ffffff',
  boxShadow: 'none',
};

const hoverStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.04)',
};

export const UnitTabs: React.FC<UnitTabsProps> = ({ activeUnit, onUnitSelect }) => {
  return (
    <>
      <style>{`.unit-tab-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }`}</style>
      <div role="tablist" aria-label="בחירת יחידה" style={containerStyle}>
        {units.map((unit) => {
          const isActive = unit.id === activeUnit;

          return (
            <button
              key={unit.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                onUnitSelect(unit.id);
                (e.currentTarget as HTMLButtonElement).blur();
              }}
              className="unit-tab-btn"
              style={{
                ...tabStyle,
                ...(isActive ? activeTabStyle : {}),
              }}
              onMouseEnter={(event) => {
                if (!isActive) {
                  (event.currentTarget as HTMLButtonElement).style.backgroundColor = hoverStyle.backgroundColor!;
                }
              }}
              onMouseLeave={(event) => {
                if (!isActive) {
                  (event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {unit.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default UnitTabs;
