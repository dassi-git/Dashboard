import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';

type Props = {
  districtsData: number[];
  onChartClick?: () => void;
};

const districtLabels = ['מערב', 'מזרח', 'דרום', 'צפון'];
const districtColors = ['#60a5fa', '#d8b4fe', '#fb923c', '#86efac'];

export default function DistrictsChart({ districtsData, onChartClick }: Props) {
  const data = {
    labels: districtLabels,
    datasets: [
      {
        label: 'התפלגות לפי מחוז',
        data: districtsData,
        backgroundColor: districtColors,
        borderRadius: 8,
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
        display: false,
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
      const { ctx, scales } = chart;
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

  return (
    <ChartCard title="התפלגות לפי מחוז" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        
        <div style={{ width: '100%', height: '100%', minHeight: 0, flex: 1, position: 'relative' }}>
          <Bar data={data} options={options} plugins={[topLabelsPlugin]} aria-label="התפלגות לפי מחוז" onClick={() => onChartClick?.()} />
        </div>

        {/* שורת 4 הנקודות המותאמת עבור המחוזות */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '8px', paddingBottom: '4px', flexWrap: 'wrap', width: '100%' }}>
          {districtLabels.map((label, idx) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', direction: 'rtl' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: districtColors[idx], display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </ChartCard>
  );
}
