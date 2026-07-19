import { useMemo, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';

type Props = {
  unitsData?: number[];
  slaActivity?: number[];
  slaBreaches?: number[];
  onChartClick?: (selection?: { unit?: string }) => void;
};

const unitLabels = Array.from({ length: 50 }, (_, i) => `יחידה ${i + 1}`);

export default function SlaByUnitChart({ unitsData, slaActivity, slaBreaches, onChartClick }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const sortedItems = useMemo(() => {
    const rawItems = unitLabels.map((label, idx) => {
      const activity = slaActivity?.[idx] ?? (() => {
        if (idx % 6 === 0) return Math.floor(Math.random() * 40) + 80;
        if (idx % 3 === 0) return Math.floor(Math.random() * 30) + 30;
        if (idx % 4 !== 0) return Math.floor(Math.random() * 15) + 5;
        return 0;
      })();
      const breach = slaBreaches?.[idx] ?? (activity > 0 ? Math.floor(activity * (0.15 + Math.random() * 0.4)) + 2 : 0);
      return { label, activity, breach };
    });
    return rawItems.filter(item => item.activity > 0).sort((a, b) => b.breach - a.breach);
  }, [slaActivity, slaBreaches, unitsData]);

  const data = {
    labels: sortedItems.map(item => item.label),
    datasets: [
      {
        label: 'פעילות',
        data: sortedItems.map(item => item.activity),
        backgroundColor: '#60a5fa',
        borderRadius: 4,
        barThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.4,
      },
      {
        label: 'חריגות SLA',
        data: sortedItems.map(item => item.breach),
        backgroundColor: '#fca5a5',
        borderRadius: 4,
        barThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.4,
      },
    ],
  };

  const maxValue = Math.max(...sortedItems.map((item) => Math.max(item.activity, item.breach)), 1);
  const xAxisTicks = [0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), Math.ceil(maxValue)];

  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 800,
      easing: 'easeOutQuart' as const,
      delay: (context: any) => (context.type === 'data' ? context.dataIndex * 30 : 0),
    },
    animations: {
      x: {
        duration: 800,
        easing: 'easeOutQuart' as const,
        from: 0,
      },
      y: {
        duration: 0,
      },
    },
    onHover: (_event: any, elements: any[], chart: any) => {
      chart.canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    plugins: { legend: { display: false } },
    layout: {
      padding: { top: 4, right: 8, left: 6, bottom: 8 },
    },
    scales: {
      x: {
        stacked: false,
        reverse: false,
        beginAtZero: true,
        ticks: { display: false },
        grid: { color: 'rgba(0,0,0,0.05)' },
        border: { display: false },
      },
      y: {
        stacked: false,
        ticks: { color: '#334155', font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    // חישוב מיקום יחסי ל-div הפנימי (גובה chartHeight) — לא ל-canvas שעלול ל-bubble
    const divRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - divRect.left;
    const y = e.clientY - divRect.top;

    const yScale = chart.scales['y'];
    if (!yScale) return;

    let closestIndex = -1;
    let closestDist = Infinity;
    const labelCount = data.labels?.length ?? 0;

    for (let i = 0; i < labelCount; i++) {
      const pixelY = yScale.getPixelForValue(i);
      const dist = Math.abs(pixelY - y);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }

    const chartArea = chart.chartArea;
    if (x < chartArea.left || x > chartArea.right) return;
    if (closestIndex === -1) return;

    const unitLabel = data.labels?.[closestIndex];
    if (unitLabel) {
      onChartClick?.({ unit: String(unitLabel) });
    }
  };

  const chartHeight = data.labels.length === 1 ? 220 : Math.max(220, data.labels.length * 32 + 60);
  const wrapperHeight = Math.min(chartHeight, 280);

  return (
    <ChartCard title="SLA לפי יחידה (פעילות נגד חריגות)" style={{ height: '100%', minHeight: 0, maxHeight: '100%', display: 'flex', flexDirection: 'column' }} animationDelay={120} animationDuration={650}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div
          ref={scrollContainerRef}
          style={{ height: `${wrapperHeight}px`, overflowY: chartHeight > wrapperHeight ? 'auto' : 'hidden', overflowX: 'hidden', direction: 'ltr' }}
        >
          <div
            style={{ height: chartHeight, minHeight: chartHeight, width: '100%', position: 'relative', cursor: 'pointer' }}
            onClick={handleCanvasClick}
          >
            <Bar
              ref={chartRef}
              data={data}
              options={options}
            />
          </div>
        </div>

        <div style={{ direction: 'ltr', height: '24px', display: 'flex', justifyContent: 'space-between', gap: '4px', padding: '3px 2px 0', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', flexShrink: 0, boxSizing: 'border-box', paddingLeft: '52px' }}>
          {xAxisTicks.map((tick) => (
            <span key={tick} style={{ color: '#64748b', fontSize: '0.72rem' }}>{tick}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '2px 0 0', borderTop: '1px solid #f1f5f9', flexShrink: 0, backgroundColor: '#fff', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', direction: 'rtl' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#2563eb' }} />
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>פעילות</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', direction: 'rtl' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#dc2626' }} />
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>חריגות SLA</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
