import { useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';
import type { RequestItem } from '../../services/api';

type Props = {
  unitsData: number[];
  onChartClick?: (selection?: { unit?: string; handler?: string } | string) => void;
  hideTableButton?: boolean;
  activeKpi?: string | null;
  closedRequests?: RequestItem[];
};

const unitLabels = Array.from({ length: 50 }, (_, i) => `יחידה ${i + 1}`);

export default function UnitsPieChart({ unitsData, onChartClick, hideTableButton = false, activeKpi, closedRequests = [] }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isClosed30d = activeKpi === 'closed_30d';

  // 1. Sort all 50 units dynamically based on incoming request counts
  const allUnitsSorted = useMemo(
    () => {
      if (isClosed30d) {
        // בנה את הנתונים מ-closedRequests בלבד
        const countByUnit: Record<string, number> = {};
        for (const req of closedRequests) {
          countByUnit[req.unit] = (countByUnit[req.unit] ?? 0) + 1;
        }
        return unitLabels
          .map((label) => ({ label, value: countByUnit[label] ?? 0 }))
          .filter((unit) => unit.value > 0)
          .sort((a, b) => b.value - a.value);
      }
      return unitLabels
        .map((label, idx) => ({
          label,
          value: unitsData[idx] ?? 0,
        }))
        .filter(unit => unit.value > 0)
        .sort((a, b) => b.value - a.value);
    },
    [unitsData, isClosed30d, closedRequests]
  );

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) {
      return allUnitsSorted;
    }

    const normalizedQuery = searchQuery.trim();
    return allUnitsSorted.filter((unit) => unit.label.includes(normalizedQuery));
  }, [allUnitsSorted, searchQuery]);

  const visibleDropdownOptions = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return allUnitsSorted.filter((unit) => unit.label.includes(searchQuery.trim()));
    }
    return allUnitsSorted;
  }, [allUnitsSorted, searchQuery]);

  const top5Units = allUnitsSorted.slice(0, 5);
  const totalRequests = allUnitsSorted.reduce((sum, item) => sum + item.value, 0);
  const pieDataItems = top5Units;

  const pieLabels = pieDataItems.map((u) => u.label);
  const pieValues = pieDataItems.map((u) => u.value);
  const pieColors = [
    '#60a5fa', '#d8b4fe', '#fb923c', '#fca5a5', '#86efac',
  ].slice(0, pieDataItems.length);

  const mainPieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieColors,
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const mainPieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: { duration: 1200, easing: 'easeInOutQuart' as const, animateRotate: true, animateScale: false },
    animations: {},
    layout: {
      padding: { top: 4, right: 4, bottom: 4, left: 4 },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const outerLabelsPlugin = {
    id: 'outerLabels',
    afterDatasetsDraw(chart: any) {
      const { ctx, chartArea: { width, height, left, top } } = chart;
      const cx = left + width / 2;
      const cy = top + height / 2;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((arc: any, i: number) => {
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const r = arc.outerRadius * 0.65;
        const lx = cx + Math.cos(angle) * r;
        const ly = cy + Math.sin(angle) * r;

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(pieValues[i]), lx, ly);
        ctx.restore();
      });
    },
  };

  const sliceClickPlugin = {
    id: 'sliceClick',
    afterEvent(chart: any, args: any) {
      if (args.event.type !== 'click') return;
      const points = chart.getElementsAtEventForMode(args.event, 'nearest', { intersect: true }, true);
      if (points.length === 0) return;
      
      const firstPoint = points[0];
      const idx = firstPoint.index;
      const label = mainPieData.labels?.[idx];
      
      if (label) {
        // eslint-disable-next-line no-console
        console.debug('Pie slice clicked:', label);
        onChartClick?.(String(label));
      }
    },
  };

  const titleContent = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
      <span>{isClosed30d ? 'פניות סגורות לפי יחידה (שנה)' : 'פניות לפי יחידה'}</span>
      {!hideTableButton && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(148,163,184,0.45)',
            backgroundColor: '#f8fafc',
            color: '#475569',
            padding: '0.45rem 0.8rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '9999px', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
            ↗
          </span>
          טבלה
        </button>
      )}
    </div>
  );

  return (
    <ChartCard title={titleContent} style={{ height: '100%', minHeight: 0, maxHeight: '100%' }} animationDelay={220} animationDuration={650}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: '100%', minHeight: 0, flex: 1, paddingBottom: '8px', cursor: 'pointer' }}>
          <Pie
            key={pieValues.join(',')}
            data={mainPieData}
            options={mainPieOptions}
            plugins={[outerLabelsPlugin, sliceClickPlugin]}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', paddingBottom: '4px' }}>
          {pieDataItems.map((u, idx) => (
            <div key={u.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: pieColors[idx], display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>{u.label}</span>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '16px', width: '680px', maxHeight: '90vh',
              padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px'
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', direction: 'rtl' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
                  {isClosed30d ? 'פירוט פניות סגורות (שנה) לפי יחידה' : 'פירוט פניות מלא לפי יחידה'}
                </h3>
                <button
                  onClick={() => { setIsModalOpen(false); setSearchQuery(''); setIsDropdownOpen(false); }}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: '#94a3b8', cursor: 'pointer' }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.9rem', color: '#475569' }}>
                <div>סה"כ יחידות: {allUnitsSorted.length}</div>
                <div>סה"כ פניות: {totalRequests}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '8px', position: 'relative' }}>
                <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%', maxWidth: '360px', position: 'relative', direction: 'rtl' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', padding: '8px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', color: '#64748b' }}>
                      🔍
                    </span>
                    <input
                      value={searchQuery}
                      onChange={(e) => {
                        const nextValue = e.target.value;
                        setSearchQuery(nextValue);
                        setIsDropdownOpen(nextValue.trim().length > 0);
                      }}
                      placeholder="חפש יחידה"
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        textAlign: 'right',
                      }}
                      onFocus={(e) => e.preventDefault()}
                    />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((current) => !current)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '1rem',
                        padding: 0,
                      }}
                      aria-label="Toggle unit search dropdown"
                    >
                      ▼
                    </button>
                  </div>

                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      left: 0,
                      maxHeight: '240px',
                      overflowY: 'auto',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '14px',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                      zIndex: 20,
                    }}>
                      {visibleDropdownOptions.length === 0 ? (
                        <div style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.95rem', textAlign: 'right' }}>
                          לא נמצאו יחידות תואמות
                        </div>
                      ) : (
                        visibleDropdownOptions.map((unit) => (
                          <button
                            key={unit.label}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSearchQuery(unit.label);
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'right',
                              padding: '12px 16px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#0f172a',
                              fontSize: '0.95rem',
                            }}
                          >
                            {unit.label}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', maxHeight: '62vh', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>יחידה</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>כמות פניות</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>נתח מסך הכל</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUnits.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b', fontSize: '0.95rem' }}>
                          לא נמצאו יחידות תואמות
                        </td>
                      </tr>
                    ) : (
                      filteredUnits.map((unit, idx) => {
                        const percent = totalRequests > 0 ? Math.round((unit.value / totalRequests) * 100) : 0;
                        return (
                          <tr key={unit.label} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.92rem', color: '#0f172a' }}>{unit.label}</td>
                            <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.92rem', color: '#0f172a' }}>{unit.value}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ width: '100%', height: '12px', borderRadius: '9999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                                <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#38bdf8' }} />
                              </div>
                              <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>{percent}%</div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
