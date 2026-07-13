import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';

type Props = {
  handlersData: number[];
  onChartClick?: (selection?: { unit?: string; handler?: string } | string) => void;
};

const handlerLabels = ['תומר', 'גיא', 'נועה', 'עדי', 'רועי'];
const handlerColors = ['#60a5fa', '#d8b4fe', '#fb923c', '#fca5a5', '#86efac'];

export default function HandlersChart({ handlersData, onChartClick }: Props) {
  const data = {
    labels: handlerLabels,
    datasets: [
      {
        label: 'גורמי מטפלים',
        data: handlersData,
        backgroundColor: handlerColors,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: { top: 20, right: 10, left: 10, bottom: 20 },
    },
    plugins: {
      legend: {
        display: false, // מכבים את המקרא המובנה כדי להשתמש בנקודות ה-HTML שלנו
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: '#334155' }, grid: { display: false } },
      y: { ticks: { color: '#334155' }, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  const topLabelsPlugin = {
    id: 'topLabels',
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;
      chart.data.datasets[0].data.forEach((value: number, i: number) => {
        const bar = chart.getDatasetMeta(0).data[i];
        ctx.save();
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value, bar.x, bar.y - 4);
        ctx.restore();
      });
    },
  };

  const handlerClickPlugin = {
    id: 'handlerClick',
    afterEvent(chart: any, args: any) {
      if (args.event.type !== 'click') return;
      const points = chart.getElementsAtEventForMode(args.event, 'nearest', { intersect: true }, true);
      if (points.length === 0) return;
      const firstPoint = points[0];
      const label = handlerLabels[firstPoint.index];
      if (label) {
        onChartClick?.({ handler: label });
      }
    },
  };

  return (
    <ChartCard title="חלוקה לפי גורם מטפלים" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        
        <div style={{ width: '100%', height: '100%', minHeight: 0, flex: 1, position: 'relative' }}>
          <Bar data={data} options={options} plugins={[topLabelsPlugin, handlerClickPlugin]} aria-label="חלוקה לפי גורמי מטפלים" />
        </div>

        {/* שורת 5 הנקודות הצבעוניות - ממורכזת ומרווחת בצורה בטוחה בתחתית */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '8px', paddingBottom: '4px', flexWrap: 'wrap', width: '100%' }}>
          {handlerLabels.map((label, idx) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', direction: 'rtl' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: handlerColors[idx], display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </ChartCard>
  );
}
