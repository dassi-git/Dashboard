import React, { useEffect, useMemo } from 'react';
import Select from 'react-select';
import DashboardCharts from '../Charts/DashboardCharts';
import RequestsModal from '../Modal/RequestsModal';
import KpiCards from './KpiCards';
import useDashboardData from './useDashboardData';

const pageStyle: React.CSSProperties = {
  height: '100vh',
  backgroundColor: '#f8fafc',
  color: '#334155',
  fontFamily: 'Inter, system-ui, sans-serif',
  padding: '2px 2px 8px',
  direction: 'rtl',
  overflowX: 'hidden',
  overflowY: 'auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
};

const pageInnerStyle: React.CSSProperties = {
  width: '100%',
  margin: 0,
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr',
  gap: '1px',
  height: '100%',
  minHeight: 0,
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 800,
  margin: 0,
};

const chartsWrapperStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  borderRadius: '24px',
  padding: '1rem',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
};

export default function MainLayout() {
  const {
    selectedUnit,
    handleUnitSelect,
    selectedDistrict,
    setSelectedDistrict,
    uniqueDistricts,
    availableUnits,
    activeKpi,
    handleKpiSelect,
    isModalOpen,
    setIsModalOpen,
    chartData,
    kpiData,
    unitFilteredRequests,
    closedRequests,
    handleOpenRequests,
    isLoading,
    error,
    handleRetry,
  } = useDashboardData();

  const hasSelectedUnitNoData = !isLoading && !error && selectedUnit !== 'all' && unitFilteredRequests.length === 0;

  // clear unit selection when district changes
  useEffect(() => {
    handleUnitSelect('all');
  }, [selectedDistrict]);

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '3px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ ...titleStyle, margin: 0, fontSize: '1.15rem' }}>ניהול פניות</h1>
                <div style={{ color: '#475569', fontSize: '0.8rem' }}>תמונת מצב</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* District select */}
              <div style={{ minWidth: 160 }}>
                <Select
                  isSearchable
                  options={useMemo(
                    () => uniqueDistricts.map((d) => ({ value: d, label: d === 'all' ? 'כל המחוזות' : d })),
                    [uniqueDistricts],
                  )}
                  value={useMemo(() => {
                    const opts = uniqueDistricts.map((d) => ({ value: d, label: d === 'all' ? 'כל המחוזות' : d }));
                    return opts.find((o) => o.value === selectedDistrict) ?? opts[0];
                  }, [selectedDistrict, uniqueDistricts])}
                  onChange={(opt) => setSelectedDistrict((opt as any)?.value ?? 'all')}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: '9999px',
                      borderColor: state.isFocused ? '#0ea5b3' : 'rgba(148,163,184,0.5)',
                      boxShadow: state.isFocused ? '0 0 0 1px #0ea5b3' : 'none',
                      backgroundColor: '#ffffff',
                      padding: '2px 8px',
                      minHeight: '38px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#0ea5b3' },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#e6fffb' : state.isFocused ? '#f8fafc' : '#ffffff',
                      color: state.isSelected ? '#0f172a' : '#475569',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                      fontWeight: state.isSelected ? 600 : 400,
                      '&:active': { backgroundColor: '#e6fffb' },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textAlign: 'right',
                      width: '100%',
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      zIndex: 50,
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: '#64748b',
                      padding: '0 4px',
                      '&:hover': { color: '#0ea5b3' },
                    }),
                    indicatorSeparator: () => ({ display: 'none' }),
                  }}
                />
              </div>

              {/* react-select searchable Select */}
              <div style={{ minWidth: 260 }}>
                <Select
                  isSearchable
                  options={useMemo(
                    () => [
                      { value: 'all', label: 'כל היחידות' },
                      ...availableUnits.map((u) => ({ value: u, label: u })),
                    ],
                    [availableUnits],
                  )}
                  value={useMemo(() => {
                    const allOpts = [{ value: 'all', label: 'כל היחידות' }, ...availableUnits.map((u) => ({ value: u, label: u }))];
                    return allOpts.find((o) => o.value === selectedUnit) ?? allOpts[0];
                  }, [selectedUnit, availableUnits])}
                  onChange={(opt) => {
                    const v = (opt as any)?.value ?? 'all';
                    handleUnitSelect(v as string);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: '9999px',
                      borderColor: state.isFocused ? '#0ea5b3' : 'rgba(148,163,184,0.5)',
                      boxShadow: state.isFocused ? '0 0 0 1px #0ea5b3' : 'none',
                      backgroundColor: '#ffffff',
                      padding: '2px 8px',
                      minHeight: '38px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#0ea5b3',
                      },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#e6fffb' : state.isFocused ? '#f8fafc' : '#ffffff',
                      color: state.isSelected ? '#0f172a' : '#475569',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                      fontWeight: state.isSelected ? 600 : 400,
                      '&:active': {
                        backgroundColor: '#e6fffb',
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textAlign: 'right',
                      width: '100%',
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      zIndex: 50,
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: '#64748b',
                      padding: '0 4px',
                      '&:hover': {
                        color: '#0ea5b3',
                      },
                    }),
                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#475569', textAlign: 'left', whiteSpace: 'nowrap' }}>{new Date().toLocaleString()}</div>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: '0.5rem 0.75rem', borderRadius: 10, border: 'none', background: '#0ea5b3', color: '#fff', cursor: 'pointer' }}>רענון</button>
          </div>
        </header>

        <section style={{ padding: '0' }}>
          {error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', minHeight: '120px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '18px', color: '#be123c', padding: '1rem', boxShadow: '0 1px 2px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700 }}>
                <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                style={{ border: 'none', backgroundColor: '#be123c', color: '#ffffff', borderRadius: '999px', padding: '0.5rem 0.9rem', cursor: 'pointer', fontWeight: 700 }}
              >
                נסה שנית
              </button>
            </div>
          ) : isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                color: '#475569',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 1px 2px rgba(15,23,42,0.08)',
              }}
            >
              טוען נתונים...
            </div>
          ) : (
            <KpiCards data={kpiData} activeKpi={activeKpi} onKpiSelect={handleKpiSelect} closedRequests={closedRequests} />
          )}
        </section>

        <section style={{ ...chartsWrapperStyle, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '2px', padding: '2px', height: '100%' }}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minHeight: '220px',
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 1px 2px rgba(15,23,42,0.08)',
              }}
            >
              טוען נתונים...
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>דשבורד גרפים</div> */}
                  {/* <button
                    type="button"
                    onClick={handleOpenRequests}
                    aria-haspopup="dialog"
                    aria-controls="requests-modal"
                    aria-label="פתח טבלת פניות"
                    style={{
                      border: '1px solid rgba(14, 165, 233, 0.9)',
                      background: 'linear-gradient(180deg, #06b6d4, #0891b2)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    פתח טבלת פניות
                  </button> */}
                </div>
                {/* <span style={{ color: '#475569', fontSize: '0.8rem' }}>לחיצה על גרף תפתח את טבלת הפניות</span> */}
              </div>

              <div style={{ height: '100%', width: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
                <DashboardCharts
                  districtsData={chartData.districtsData}
                  statusesData={chartData.statusesData}
                  closedCount={activeKpi === 'closed_30d' ? kpiData.closedLast30Days : undefined}
                  unitsData={chartData.unitsData}
                  filteredUnits={availableUnits}
                  selectedUnit={selectedUnit}
                  slaActivity={chartData.slaActivity}
                  slaBreaches={chartData.slaBreaches}
                  onChartClick={handleOpenRequests}
                  handlersData={chartData.handlersData}
                />
                {hasSelectedUnitNoData && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(248, 250, 252, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '540px',
                        borderRadius: '22px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                        padding: '1.75rem 1.5rem',
                        textAlign: 'center',
                        position: 'relative',
                        minHeight: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '1rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleUnitSelect('all')}
                        aria-label="סגור הודעה"
                        style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          fontSize: '1.3rem',
                          cursor: 'pointer',
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                      <div style={{ fontSize: '2rem', lineHeight: 1, fontWeight: 700, color: '#0f172a' }}>אין פניות מיחידה זו.</div>
                      <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', padding: '0 0.25rem' }}>
                        בחר יחידה אחרת כדי לראות נתונים או לחץ על &quot;×&quot; כדי לחזור להצגת כל היחידות.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnitSelect('all')}
                        style={{
                          alignSelf: 'center',
                          backgroundColor: '#0ea5b3',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '0.8rem 1.4rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                        }}
                      >
                        הצג את כל היחידות
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <RequestsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allRequests={unitFilteredRequests}
        initialDistrict={selectedDistrict}
        initialUnit={selectedUnit}
        initialKpiType={activeKpi}
      />
    </div>
  );
}
