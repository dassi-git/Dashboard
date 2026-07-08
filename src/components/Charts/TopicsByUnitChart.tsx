import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';
import { useMemo } from 'react';

type Props = {
  filteredUnits?: string[]; 
  selectedUnit?: string;
  onChartClick?: () => void;
};

const topics = ['נושא 1', 'נושא 2', 'נושא 3', 'נושא 4', 'נושא 5'];

export default function TopicsByUnitChart({ filteredUnits, selectedUnit, onChartClick }: Props) {
  
  let displayUnits = filteredUnits && filteredUnits.length > 0 
    ? filteredUnits 
    : Array.from({ length: 50 }, (_, i) => `יחידה ${i + 1}`);

  if (selectedUnit && selectedUnit !== 'all') {
    displayUnits = [selectedUnit];
  }

  // FIXED: Memoize stable mock data and sort strictly by cumulative topics volume descending
  const chartDataItems = useMemo(() => {
    return displayUnits
      .map((unit) => ({
        unit,
        data: topics.map((_, tIdx) => Math.floor(Math.random() * 15) + (tIdx * 2)),
      }))
      .filter(item => item.data.reduce((s, v) => s + v, 0) > 0)
      .sort((a, b) => {
        const sumA = a.data.reduce((s, v) => s + v, 0);
        const sumB = b.data.reduce((s, v) => s + v, 0);
        return sumB - sumA; // Highest volume items at the top
      });
  }, [filteredUnits, selectedUnit]);

  const data = {
    labels: chartDataItems.map(u => u.unit),
    datasets: topics.map((topic, topicIdx) => ({
      label: topic,
      data: chartDataItems.map(u => u.data[topicIdx]),
      backgroundColor: [
        '#60a5fa', '#d8b4fe',
        '#fb923c', '#fca5a5', '#86efac'
      ][topicIdx],
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
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: { top: 4, right: 8, left: 6, bottom: 8 },
    },
    scales: {
      x: { stacked: true, reverse: false, beginAtZero: true, ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.05)' }, border: { display: false } },
      y: { stacked: true, grid: { display: false }, ticks: { color: '#334155', font: { size: 12 } } },
    },
  };

  const chartHeight = data.labels.length === 1 ? 220 : Math.max(220, data.labels.length * 32 + 60);
  const wrapperHeight = Math.min(chartHeight, 280);

  return (
    <ChartCard title="נושא לפי יחידה (סטאקד אופקי)" style={{ height: '100%', minHeight: 0, maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: `${wrapperHeight}px`, overflowY: chartHeight > wrapperHeight ? 'auto' : 'hidden', overflowX: 'hidden', direction: 'ltr' }}>
          <div style={{ height: chartHeight, minHeight: chartHeight, width: '100%', position: 'relative' }}>
            <Bar data={data} options={options} onClick={() => onChartClick?.()} />
          </div>
        </div>

        <div style={{ direction: 'ltr', height: '24px', display: 'flex', justifyContent: 'space-between', gap: '4px', padding: '3px 2px 0', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', flexShrink: 0, boxSizing: 'border-box', paddingLeft: '52px' }}>
          {xAxisTicks.map((tick) => (
            <span key={tick} style={{ color: '#64748b', fontSize: '0.72rem' }}>{tick}</span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '4px 0 2px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', flexShrink: 0, boxSizing: 'border-box' }}>
          {topics.map((topic, idx) => {
            const colors = ['#60a5fa', '#d8b4fe', '#fb923c', '#fca5a5', '#86efac'];
            return (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colors[idx] }} />
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{topic}</span>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
}


