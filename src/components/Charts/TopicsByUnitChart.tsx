import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';
import { useMemo, useRef } from 'react';

type Props = {
  filteredUnits?: string[];
  selectedUnit?: string;
  topicsByUnit?: number[][];   // [unitIndex][topicIndex] — מגיע מה-API
  onChartClick?: (selection?: { unit?: string }) => void;
};

const allUnitLabels = Array.from({ length: 50 }, (_, i) => `יחידה ${i + 1}`);
const topics = ['נושא 1', 'נושא 2', 'נושא 3', 'נושא 4', 'נושא 5'];
const topicColors = ['#60a5fa', '#d8b4fe', '#fb923c', '#fca5a5', '#86efac'];

export default function TopicsByUnitChart({ filteredUnits, selectedUnit, topicsByUnit, onChartClick }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const chartDataItems = useMemo(() => {
    // קבע אילו יחידות להציג
    let displayUnits: string[];
    if (selectedUnit && selectedUnit !== 'all') {
      displayUnits = [selectedUnit];
    } else if (filteredUnits && filteredUnits.length > 0) {
      displayUnits = filteredUnits;
    } else {
      displayUnits = allUnitLabels;
    }

    return displayUnits
      .map((unit) => {
        const unitIdx = allUnitLabels.indexOf(unit);
        // השתמש בנתוני API אם קיימים, אחרת אפסים
        const data = topicsByUnit && unitIdx >= 0
          ? topics.map((_, tIdx) => topicsByUnit[unitIdx]?.[tIdx] ?? 0)
          : topics.map(() => 0);
        return { unit, data };
      })
      .filter(item => item.data.reduce((s, v) => s + v, 0) > 0)
      .sort((a, b) => {
        const sumA = a.data.reduce((s, v) => s + v, 0);
        const sumB = b.data.reduce((s, v) => s + v, 0);
        return sumB - sumA;
      });
  }, [filteredUnits, selectedUnit, topicsByUnit]);

  const data = {
    labels: chartDataItems.map(u => u.unit),
    datasets: topics.map((topic, topicIdx) => ({
      label: topic,
      data: chartDataItems.map(u => u.data[topicIdx]),
      backgroundColor: topicColors[topicIdx],
      barThickness: 10,
      barPercentage: 0.5,
      categoryPercentage: 0.4,
    })),
  };

  const maxValue = Math.max(...chartDataItems.map((item) => item.data.reduce((sum, value) => sum + value, 0)), 50);
  const xAxisTicks = [0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), Math.ceil(maxValue)];

  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    responsive: true,
    animation: {
<<<<<<< HEAD
      duration: 600,
      easing: 'easeInOutQuart',
=======
      duration: 700,
      easing: 'easeOutQuad' as const,
      delay: (context: any) => (context.type === 'data' ? context.dataIndex * 8 : 0),
    },
    animations: {
      x: {
        duration: 700,
        easing: 'easeOutQuad' as const,
        from: 0,
      },
      y: {
        duration: 700,
        easing: 'easeOutQuad' as const,
        from: 0,
      },
      colors: {
        duration: 500,
        easing: 'easeOutQuad' as const,
      },
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
    },
    onHover: (_event: any, elements: any[], chart: any) => {
      chart.canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    plugins: { legend: { display: false } },
    layout: { padding: { top: 4, right: 8, left: 6, bottom: 8 } },
    scales: {
      x: { stacked: true, reverse: false, beginAtZero: true, ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.05)' }, border: { display: false } },
      y: { stacked: true, grid: { display: false }, ticks: { color: '#334155', font: { size: 12 } } },
    },
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

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

  const isEmpty = chartDataItems.length === 0;

  return (
    <ChartCard title="נושא לפי יחידה (סטאקד אופקי)" style={{ height: '100%', minHeight: 0, maxHeight: '100%', display: 'flex', flexDirection: 'column' }} animationDelay={300} animationDuration={650}>
      <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isEmpty ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
            אין נתונים להצגה
          </div>
        ) : (
          <>
            <div
              ref={scrollContainerRef}
              style={{ height: `${wrapperHeight}px`, overflowY: chartHeight > wrapperHeight ? 'auto' : 'hidden', overflowX: 'hidden', direction: 'ltr' }}
            >
              <div
                style={{ height: chartHeight, minHeight: chartHeight, width: '100%', position: 'relative', cursor: 'pointer' }}
                onClick={handleCanvasClick}
              >
                <Bar ref={chartRef} data={data} options={options} />
              </div>
            </div>

            <div style={{ direction: 'ltr', height: '24px', display: 'flex', justifyContent: 'space-between', gap: '4px', padding: '3px 2px 0', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', flexShrink: 0, boxSizing: 'border-box', paddingLeft: '52px' }}>
              {xAxisTicks.map((tick) => (
                <span key={tick} style={{ color: '#64748b', fontSize: '0.72rem' }}>{tick}</span>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '4px 0 2px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', flexShrink: 0, boxSizing: 'border-box' }}>
          {topics.map((topic, idx) => (
            <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: topicColors[idx] }} />
              <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
