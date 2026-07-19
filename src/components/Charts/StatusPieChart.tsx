import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard.tsx';
import { pieOptions } from './chartOptions';
import type { RequestItem } from '../../services/api';

type Props = {
  statusesData: number[];
  closedCount?: number;
  activeKpi?: string | null;
  closedRequests?: RequestItem[];
  onChartClick?: (selection?: { kpiType?: string }) => void;
};

const labelToKpiType: Record<string, string> = {
  'בטיפול': 'in_progress',
  'חדש': 'new',
  'נסגרו': 'closed_30d',
};

const innerLabelsPlugin = {
  id: 'innerLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx, chartArea: { width, height, left, top } } = chart;
    const cx = left + width / 2;
    const cy = top + height / 2;
    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((arc: any, i: number) => {
      const value = chart.data.datasets[0].data[i];
      if (!value) return;
      const angle = (arc.startAngle + arc.endAngle) / 2;
      const r = arc.outerRadius * 0.65;
      const lx = cx + Math.cos(angle) * r;
      const ly = cy + Math.sin(angle) * r;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(value), lx, ly);
      ctx.restore();
    });
  },
};

export default function StatusPieChart({ statusesData, closedCount, activeKpi, closedRequests = [], onChartClick }: Props) {
  const isClosed30d = activeKpi === 'closed_30d';

  const slaComplianceData = useMemo(() => {
    if (!isClosed30d || closedRequests.length === 0) return null;
    let met = 0, risky = 0, missed = 0;
    for (const req of closedRequests) {
      if (req.sla)         missed++;
      else if (req.urgent) risky++;
      else                 met++;
    }
    return { met, risky, missed };
  }, [isClosed30d, closedRequests]);

  // ── מצב closed_30d: עוגת עמידה ביעד ────────────────────────────────────────
  if (isClosed30d && slaComplianceData) {
    const { met, risky, missed } = slaComplianceData;
<<<<<<< HEAD
    const total = met + risky + missed;
=======
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3

    const slaLabels  = ['עמד ביעד', 'עמד באופן מסוכן', 'לא עמד ביעד'];
    const slaValues  = [met, risky, missed];
    const slaColors  = ['#86efac', '#fb923c', '#fca5a5'];   // ירוק/כתום/ורוד — זהים לפלטת הפרויקט

    const slaChartData = {
      labels: slaLabels,
      datasets: [{
        data: slaValues,
        backgroundColor: slaColors,
        borderWidth: 1,
        borderColor: '#ffffff',
      }],
    };

<<<<<<< HEAD
    const slaPercentagesPlugin = {
      id: 'slaPercentages',
      afterDatasetsDraw(chart: any) {
        const { ctx, chartArea: { width, height, left, top } } = chart;
        const cx = left + width / 2;
        const cy = top + height / 2;
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((arc: any, i: number) => {
          const value = slaValues[i];
          if (!value) return;
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          const angle = (arc.startAngle + arc.endAngle) / 2;
          const r = arc.outerRadius * 0.65;
          const lx = cx + Math.cos(angle) * r;
          const ly = cy + Math.sin(angle) * r;
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${percent}%`, lx, ly);
          ctx.restore();
        });
      },
    };

=======
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
    const slaClickPlugin = {
      id: 'slaSliceClick',
      afterEvent(chart: any, args: any) {
        if (args.event.type !== 'click') return;
        const points = chart.getElementsAtEventForMode(
          args.event.native ?? args.event, 'nearest', { intersect: true }, true,
        );
        if (points.length === 0) return;
        onChartClick?.({ kpiType: 'closed_30d' });
      },
    };

    const hoverPlugin = {
      id: 'slaHover',
      afterEvent(chart: any, args: any) {
        const points = chart.getElementsAtEventForMode(
          args.event.native ?? args.event, 'nearest', { intersect: true }, true,
        );
        chart.canvas.style.cursor = points.length > 0 ? 'pointer' : 'default';
      },
    };

    return (
<<<<<<< HEAD
      <ChartCard title="עמידה ביעד טיפול" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }} key={`sla-${isClosed30d}`}>
=======
      <ChartCard title="עמידה ביעד טיפול" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }} animationDelay={160} animationDuration={650}>
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* עוגה */}
          <div style={{ width: '100%', height: '100%', minHeight: 0, flex: 1, paddingBottom: '8px', cursor: 'pointer' }}>
            <Pie
              data={slaChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
<<<<<<< HEAD
                animation: {
                  duration: 600,
                  easing: 'easeInOutQuart',
                },
                layout: { padding: { top: 4, right: 4, bottom: 4, left: 4 } },
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
              }}
              plugins={[slaPercentagesPlugin, slaClickPlugin, hoverPlugin]}
=======
                animation: { duration: 700, easing: 'easeOutQuad' as const, animateRotate: false, animateScale: true },
                layout: { padding: { top: 4, right: 4, bottom: 4, left: 4 } },
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
              }}
              plugins={[innerLabelsPlugin, slaClickPlugin, hoverPlugin]}
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
              aria-label="עמידה ביעד טיפול"
            />
          </div>

          {/* מקרא — זהה בדיוק ל-UnitsPieChart */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', paddingBottom: '4px' }}>
            {slaLabels.map((label, idx) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: slaColors[idx], display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    );
  }

  // ── מצב רגיל: עוגת סטטוס ───────────────────────────────────────────────────
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

  const sliceClickPlugin = {
    id: 'statusSliceClick',
    afterEvent(chart: any, args: any) {
      if (args.event.type !== 'click') return;
      const points = chart.getElementsAtEventForMode(
        args.event.native ?? args.event, 'nearest', { intersect: true }, true,
      );
      if (points.length === 0) return;
      const label = labels[points[0].index];
      const kpiType = labelToKpiType[label];
      if (kpiType) onChartClick?.({ kpiType });
    },
  };

  const hoverPlugin = {
    id: 'statusHover',
    afterEvent(chart: any, args: any) {
      const points = chart.getElementsAtEventForMode(
        args.event.native ?? args.event, 'nearest', { intersect: true }, true,
      );
      chart.canvas.style.cursor = points.length > 0 ? 'pointer' : 'default';
    },
  };

  return (
<<<<<<< HEAD
    <ChartCard title="התפלגות לפי סטטוס" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }} animationDelay={140} animationDuration={650} key={`status-${isClosed30d}`}>
=======
    <ChartCard title="התפלגות לפי סטטוס" style={{ height: '100%', minHeight: 0, maxHeight: '100%' }} animationDelay={140} animationDuration={650}>
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
      <div style={{ height: '100%', width: '100%', minHeight: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pie
          data={data}
          options={{
            ...pieOptions,
<<<<<<< HEAD
            animation: {
              duration: 600,
              easing: 'easeInOutQuart',
            },
=======
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
            layout: { padding: { top: 8, right: 8, left: 8, bottom: 20 } },
            plugins: {
              ...pieOptions.plugins,
              legend: { position: 'bottom' as const, labels: { color: '#334155', usePointStyle: true, boxWidth: 10 } },
            },
          }}
          plugins={[innerLabelsPlugin, sliceClickPlugin, hoverPlugin]}
          aria-label="התפלגות לפי סטטוס"
        />
      </div>
    </ChartCard>
  );
}
