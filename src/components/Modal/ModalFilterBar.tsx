type FilterType = 'all' | 'urgent' | 'sla' | 'in_progress' | 'new';

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeFilters: FilterType[];
  setActiveFilters: (filters: FilterType[]) => void;
  totalResults: number;
  toggleSidebar: () => void;
  onExportCsv?: () => void;
  sortOrder?: 'newest' | 'oldest';
  onSortOrderChange?: (order: 'newest' | 'oldest') => void;
};

export default function ModalFilterBar({
  searchTerm,
  setSearchTerm,
  activeFilters,
  setActiveFilters,
  totalResults,
  toggleSidebar,
  onExportCsv,
  sortOrder = 'newest',
  onSortOrderChange,
}: Props) {
  const statusButtonStyle = (type: FilterType, isActive: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '6px 12px',
      borderRadius: '9999px',
      fontSize: '0.85rem',
      fontWeight: isActive ? 600 : 500,
      cursor: 'pointer',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      color: '#475569',
    };

    if (!isActive) {
      return base;
    }

    switch (type) {
      case 'urgent':
        return {
          ...base,
          backgroundColor: '#fff7ed',
          border: '1px solid #ea580c',
          color: '#ea580c',
        };
      case 'all':
        return {
          ...base,
          backgroundColor: '#e0f2fe',
          border: '1px solid #bae6fd',
          color: '#0369a1',
        };
      case 'sla':
        return {
          ...base,
          backgroundColor: '#fef2f2',
          border: '1px solid #dc2626',
          color: '#dc2626',
        };
      case 'in_progress':
        return {
          ...base,
          backgroundColor: '#f3e8ff',
          border: '1px solid #6b21a8',
          color: '#6b21a8',
        };
      case 'new':
        return {
          ...base,
          backgroundColor: '#fef9c3',
          border: '1px solid #854d0e',
          color: '#854d0e',
        };
      default:
        return base;
    }
  };

  const toggleFilter = (filter: FilterType) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
      return;
    }

    const nextFilters = activeFilters.filter((item) => item !== 'all');
    const isActive = nextFilters.includes(filter);

    if (filter === 'new') {
      const cleaned = nextFilters.filter((item) => item !== 'in_progress');
      if (isActive) {
        const updated = cleaned.filter((item) => item !== 'new');
        setActiveFilters(updated.length > 0 ? updated : ['all']);
        return;
      }
      setActiveFilters([...cleaned, 'new']);
      return;
    }

    if (filter === 'in_progress') {
      const cleaned = nextFilters.filter((item) => item !== 'new');
      if (isActive) {
        const updated = cleaned.filter((item) => item !== 'in_progress');
        setActiveFilters(updated.length > 0 ? updated : ['all']);
        return;
      }
      setActiveFilters([...cleaned, 'in_progress']);
      return;
    }

    if (isActive) {
      const updated = nextFilters.filter((item) => item !== filter);
      setActiveFilters(updated.length > 0 ? updated : ['all']);
      return;
    }

    setActiveFilters([...nextFilters, filter]);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'sans-serif' }}>
      
      {/* 1. Search Bar Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', direction: 'rtl' }}>
        <button
          type="button"
          onClick={toggleSidebar}
          style={{
            border: '1px solid rgba(148, 163, 184, 0.4)',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            padding: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="פתח/סגור מסננים"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle cx="8" cy="6" r="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="14" cy="12" r="2" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>

        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="שם/מס' זהות/מס' דרכון/מס' פניה"
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.9rem',
              color: '#1e293b',
              textAlign: 'right',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: '16px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            style={{
              border: '1px solid rgba(148, 163, 184, 0.4)',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
              color: '#475569',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
            }}
            aria-label="ייצוא ל-Excel"
            title="ייצוא ל-Excel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>ייצוא ל-Excel</span>
          </button>
        )}

        {onSortOrderChange && (
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'newest' | 'oldest')}
            style={{
              border: '1px solid rgba(148, 163, 184, 0.4)',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              padding: '0.6rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#475569',
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.2s ease',
              appearance: 'none',
              paddingRight: '2rem',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='4' y1='6' x2='20' y2='6'/%3E%3Cline x1='4' y1='12' x2='16' y2='12'/%3E%3Cline x1='4' y1='18' x2='12' y2='18'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left 0.6rem center',
              backgroundSize: '16px 16px',
              paddingLeft: '2rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
            }}
            aria-label="מיון תאריך"
            title="מיון תאריך"
          >
            <option value="newest">מיון: מהחדש לישן</option>
            <option value="oldest">מיון: מהישן לחדש</option>
          </select>
        )}
      </div>

      {/* 2. Quick Filter Buttons (Chips / Badges) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', direction: 'rtl', paddingRight: '4px' }}>
        
        {/* Chip: דחופות */}
        <button
          type="button"
          onClick={() => toggleFilter('urgent')}
          style={statusButtonStyle('urgent', activeFilters.includes('urgent'))}
        >
          דחוף
        </button>

        {/* Chip: הכל */}
        <button
          type="button"
          onClick={() => toggleFilter('all')}
          style={statusButtonStyle('all', activeFilters.includes('all'))}
        >
          הכל
        </button>

        {/* Chip: חריגות SLA */}
        <button
          type="button"
          onClick={() => toggleFilter('sla')}
          style={statusButtonStyle('sla', activeFilters.includes('sla'))}
        >
          חריגות SLA
        </button>

        {/* Chip: בטיפול */}
        <button
          type="button"
          onClick={() => toggleFilter('in_progress')}
          style={statusButtonStyle('in_progress', activeFilters.includes('in_progress'))}
        >
          בטיפול
        </button>

        {/* Chip: חדש */}
        <button
          type="button"
          onClick={() => toggleFilter('new')}
          style={statusButtonStyle('new', activeFilters.includes('new'))}
        >
          חדש
        </button>

      </div>

      {/* 3. Results Indication Line */}
      <div style={{ textAlign: 'right', direction: 'rtl', paddingRight: '4px', marginTop: '0' }}>
        <span style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'normal' }}>
          נמצאו {totalResults} פניות
        </span>
      </div>

    </div>
  );
}
