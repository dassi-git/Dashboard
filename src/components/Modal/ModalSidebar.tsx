import React, { useState } from 'react';

const sidebarStyle: React.CSSProperties = {
  height: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  boxSizing: 'border-box',
  backgroundColor: '#f8fafc',
  borderRadius: '18px',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  gap: '1rem',
};

const filterSectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
};

const filterLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#0f172a',
  fontSize: '0.95rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '14px',
  border: '1px solid rgba(148, 163, 184, 0.75)',
  padding: '0.85rem 1rem',
  fontSize: '0.95rem',
  color: '#0f172a',
  backgroundColor: '#ffffff',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '16px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

const cardTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#0f172a',
  fontSize: '0.95rem',
};

const cardToggleStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '1px solid #bfdbfe',
  backgroundColor: '#ffffff',
  color: '#2563eb',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  fontSize: '1.1rem',
  lineHeight: 1,
};

const cardBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const cardSearchStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: '16px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  minHeight: '44px',
};

const cardSearchInputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '0.95rem',
  color: '#0f172a',
  textAlign: 'right',
  direction: 'rtl',
};

const cardOptionListStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  maxHeight: '200px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const cardOptionRowStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: '14px',
  cursor: 'pointer',
};

const cardOptionLabelStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '0.95rem',
  textAlign: 'right',
  flex: 1,
};

const cardCheckboxStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  accentColor: '#2563eb',
};

const searchIconStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  color: '#94a3b8',
  flexShrink: 0,
};

const sidebarHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
};

const dateInputRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  flexDirection: 'column',
};

const dateInputColumnStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: '0.5rem',
};

const dateInputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '16px',
  border: '1px solid #d1d5db',
  padding: '0.85rem 0.8rem',
  fontSize: '0.95rem',
  color: '#0f172a',
  backgroundColor: '#ffffff',
};

const dateInputWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
};

const dateIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '18px',
  height: '18px',
  color: '#94a3b8',
  pointerEvents: 'none',
};

const actionsFooterStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: 'auto',
  paddingTop: '16px',
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#f8fafc',
  borderTop: '1px solid rgba(148, 163, 184, 0.25)',
};

const primaryActionStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: '14px',
  padding: '0.95rem 1rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryActionStyle: React.CSSProperties = {
  flex: 1,
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  padding: '0.95rem 1rem',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontWeight: 700,
  cursor: 'pointer',
};

const switchWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

const switchLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#0f172a',
  fontSize: '0.95rem',
};

const errorMessageStyle: React.CSSProperties = {
  color: '#ef4444',
  fontSize: '0.75rem',
  marginTop: '0.4rem',
  display: 'block',
  fontWeight: 500,
  direction: 'rtl',
};

const departmentOptions = ['מחלקה פנימית', 'מחלקה כירורגית', 'מחלקת ילדים', 'מחלקת נשים', 'מחלקת אורתופדיה'];

interface FilterCardProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  options: string[];
  selectedValues: string[];
  onToggleOption: (value: string) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
  title,
  searchValue,
  onSearchChange,
  isOpen,
  onToggleOpen,
  options,
  selectedValues,
  onToggleOption,
}) => {
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchValue.toLowerCase()));
  const visibleOptions = ['הכל', ...filteredOptions];

  const isChecked = (option: string) => {
    if (option === 'הכל') return selectedValues.includes('הכל');
    return selectedValues.includes(option);
  };

  // בחירות פעילות (ללא "הכל")
  const activeSelections = selectedValues.filter((v) => v !== 'הכל');

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={cardTitleStyle}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* תג מספר בחירות */}
              {activeSelections.length > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0 5px',
                }}>
                  {activeSelections.length}
                </span>
              )}
              <button type="button" onClick={onToggleOpen} style={cardToggleStyle} aria-expanded={isOpen}>
                {isOpen ? '−' : '+'}
              </button>
            </div>
          </div>

          {/* Tags של הבחירות הפעילות — גלויות תמיד */}
          {activeSelections.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', direction: 'rtl' }}>
              {activeSelections.map((val) => (
                <span
                  key={val}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px 2px 5px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    maxWidth: '100%',
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleOption(val); }}
                    aria-label={`הסר ${val}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: '#bfdbfe',
                      color: '#1d4ed8',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      lineHeight: 1,
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div style={cardBodyStyle}>
          <div style={cardSearchStyle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={searchIconStyle}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="חיפוש..."
              style={cardSearchInputStyle}
            />
          </div>

          <div style={cardOptionListStyle}>
            {visibleOptions.map((option) => (
              <label
                key={option}
                style={{
                  ...cardOptionRowStyle,
                  backgroundColor: isChecked(option) ? '#f0f9ff' : 'transparent',
                }}
              >
                <span style={cardOptionLabelStyle}>{option}</span>
                <input
                  type="checkbox"
                  checked={isChecked(option)}
                  onChange={() => onToggleOption(option)}
                  style={cardCheckboxStyle}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface ModalSidebarProps {
  isOpen: boolean;
  filters: any;
  clearAll: () => void;
}

const ModalSidebar: React.FC<ModalSidebarProps> = ({ isOpen, filters, clearAll }) => {
  const [dateError, setDateError] = useState<string | null>(null);
  const [filterByCloseDate, setFilterByCloseDate] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [handlerSearch, setHandlerSearch] = useState('');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [isHandlerOpen, setIsHandlerOpen] = useState(false);

  if (!isOpen) return null;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    filters.setStartDate(selectedDate);

    // ✅ בדיקה חכמה: אם startDate מאוחר מ-endDate, הצג שגיאה
    if (filters.endDate && selectedDate && new Date(selectedDate) > new Date(filters.endDate)) {
      setDateError("תאריך ההתחלה אינו יכול להיות מאוחר מתאריך הסיום");
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    filters.setEndDate(selectedDate);

    // ✅ בדיקה חכמה: אם endDate מוקדם מ-startDate, הצג שגיאה
    if (filters.startDate && selectedDate && new Date(selectedDate) < new Date(filters.startDate)) {
      setDateError("תאריך הסיום אינו יכול להיות מוקדם מתאריך ההתחלה");
    } else {
      setDateError(null);
    }
  };

  const handleClearAll = () => {
    setDateError(null);
    setDistrictSearch('');
    setUnitSearch('');
    setHandlerSearch('');
    clearAll();
  };

  const handleApplyFilters = () => {
    if (filters.applyFilters) {
      filters.applyFilters();
    }
  };

  const toggleMultiSelectValue = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
    availableOptions: string[],
  ) => {
    if (value === 'הכל') {
      setSelectedValues([]);
      return;
    }

    const currentValues = selectedValues.includes('הכל') ? [] : selectedValues;
    const isCurrentlySelected = currentValues.includes(value);

    const nextValues = isCurrentlySelected
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    if (nextValues.length === 0) {
      setSelectedValues([]);
    } else if (nextValues.length === availableOptions.length) {
      setSelectedValues(['הכל']);
    } else {
      setSelectedValues(nextValues);
    }
  };

  return (
    <aside style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        <span style={{ fontWeight: 700, color: '#0f172a' }}>מסננים מתקדמים</span>
        <button type="button" onClick={handleClearAll} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
          נקה הכל
        </button>
      </div>

      <div style={filterSectionStyle}>
        <input 
          type="text" 
          value={filters.generalSearch} 
          onChange={(e) => filters.setGeneralSearch(e.target.value)} 
          placeholder="חיפוש לפי: שם/מספר חולה, מטפל, פנייה או נושא..." 
          style={inputStyle} 
        />
      </div>

      <div style={filterSectionStyle}>
        <FilterCard
          title="מחוז"
          searchValue={districtSearch}
          onSearchChange={setDistrictSearch}
          isOpen={isDistrictOpen}
          onToggleOpen={() => setIsDistrictOpen((open) => !open)}
          options={filters.districtOptions}
          selectedValues={filters.selectedDistricts}
          onToggleOption={(value) => toggleMultiSelectValue(value, filters.selectedDistricts, filters.setSelectedDistricts, filters.districtOptions)}
        />
      </div>

      <div style={filterSectionStyle}>
        <FilterCard
          title="יחידה"
          searchValue={unitSearch}
          onSearchChange={setUnitSearch}
          isOpen={isUnitOpen}
          onToggleOpen={() => setIsUnitOpen((open) => !open)}
          options={filters.visibleUnitOptions}
          selectedValues={filters.selectedUnits}
          onToggleOption={(value) => toggleMultiSelectValue(value, filters.selectedUnits, filters.setSelectedUnits, filters.visibleUnitOptions)}
        />
      </div>

      <div style={filterSectionStyle}>
        <FilterCard
          title="גורם מטפל"
          searchValue={handlerSearch}
          onSearchChange={setHandlerSearch}
          isOpen={isHandlerOpen}
          onToggleOpen={() => setIsHandlerOpen((open) => !open)}
          options={departmentOptions}
          selectedValues={filters.selectedHandlers}
          onToggleOption={(value) => toggleMultiSelectValue(value, filters.selectedHandlers, filters.setSelectedHandlers, departmentOptions)}
        />
      </div>

      <div style={filterSectionStyle}>
        <div style={switchWrapperStyle}>
<<<<<<< HEAD
          <span style={switchLabelStyle}>סינון לפי תאריך עדכון</span>
=======
          <span style={switchLabelStyle}>סינון לפי תאריך סגירה</span>
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
          <button
            type="button"
            onClick={() => setFilterByCloseDate((value) => !value)}
            style={{
              position: 'relative',
              width: '44px',
              height: '24px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              backgroundColor: filterByCloseDate ? '#2563eb' : '#e2e8f0',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
            }}
            aria-pressed={filterByCloseDate}
            aria-label="Toggle date filter"
          >
            <span style={{
              position: 'absolute',
              top: '2px',
              left: filterByCloseDate ? '20px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              transition: 'left 200ms ease',
            }} />
          </button>
        </div>

        <div style={dateInputRowStyle}>
          <div style={{ ...dateInputColumnStyle }}>
            <label style={filterLabelStyle} htmlFor="start-date">
<<<<<<< HEAD
              {filterByCloseDate ? 'עודכן מתאריך' : 'נפתח מתאריך'}
=======
              {filterByCloseDate ? 'סגור מתאריך' : 'נפתח מתאריך'}
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
            </label>
            <div style={dateInputWrapperStyle}>
              <input
                type="date"
                id="start-date"
                value={filters.startDate || ''}
                onChange={handleStartDateChange}
                max={filters.endDate || ''}
                style={{
                  ...dateInputStyle,
                  paddingRight: '40px',
                  color: filters.startDate ? '#0f172a' : '#94a3b8',
                }}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={dateIconStyle}>
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
          </div>
          <div style={{ ...dateInputColumnStyle }}>
            <label style={filterLabelStyle} htmlFor="end-date">עד</label>
            <div style={dateInputWrapperStyle}>
              <input
                type="date"
                id="end-date"
                value={filters.endDate || ''}
                onChange={handleEndDateChange}
                min={filters.startDate || ''}
                style={{
                  ...dateInputStyle,
                  paddingRight: '40px',
                  color: filters.endDate ? '#0f172a' : '#94a3b8',
                }}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={dateIconStyle}>
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            {dateError && (
              <span style={errorMessageStyle}>⚠ {dateError}</span>
            )}
          </div>
        </div>
      </div>

      <div style={actionsFooterStyle}>
        <button type="button" onClick={handleApplyFilters} style={primaryActionStyle}>
          הצג תוצאות
        </button>
        <button type="button" onClick={handleClearAll} style={secondaryActionStyle}>
          איפוס
        </button>
      </div>
    </aside>
  );
};

export default ModalSidebar;
