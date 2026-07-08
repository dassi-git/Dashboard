import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';
import { pieOptions } from './chartOptions';

type Props = {
  statusesData: number[];
  closedCount?: number;
  onChartClick?: () => void;
};

const innerLabelsPlugin = {
  id: 'innerLabels',
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
      ctx.fillText(String(chart.data.datasets[0].data[i]), lx, ly);
      ctx.restore();
    });
  },
};

export default function StatusPieChart({ statusesData, closedCount, onChartClick }: Props) {
  const [newCount = 0, treatmentCount = 0] = statusesData;

  const labels = closedCount !== undefined
    ? ['בטיפול', 'חדש', 'נסגרו']
    : ['בטיפול', 'חדש'];
  const values = closedCount !== undefined
    ? [treatmentCount, newCount, closedCount]
    : [treatmentCount, newCount];
  const colors = closedCount !== undefined
    ? ['#60a5fa', '#86efac', '#f59e0b']
    : ['#60a5fa', '#86efac'];

  const data = {
    labels,
    datasets: [{ data: values, backgroundColor: colors }],
  };

  return (
    <ChartCard title="התפלגות לפי סטטוס" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }}>
      <div style={{ height: '100%', width: '100%', minHeight: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pie
          data={data}
          options={{
            ...pieOptions,
            layout: {
              padding: { top: 8, right: 8, left: 8, bottom: 20 },
            },
            plugins: {
              ...pieOptions.plugins,
              legend: { position: 'bottom' as const, labels: { color: '#334155', usePointStyle: true, boxWidth: 10 } },
            },
          }}
          plugins={[innerLabelsPlugin]}
          aria-label="התפלגות לפי סטטוס"
          onClick={() => onChartClick?.()}
        />
      </div>
    </ChartCard>
  );
}
