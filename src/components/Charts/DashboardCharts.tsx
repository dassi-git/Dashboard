import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from 'chart.js';
import DistrictsChart from './DistrictsChart.tsx';
import StatusPieChart from './StatusPieChart.tsx';
import TopicsByUnitChart from './TopicsByUnitChart.tsx';
import UnitsPieChart from './UnitsPieChart.tsx';
import SlaByUnitChart from './SlaByUnitChart.tsx';
import HandlersChart from './HandlersChart.tsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Legend, Tooltip, Title);

export type DashboardChartsProps = {
  districtsData: number[];
  statusesData: number[];
  closedCount?: number;
  unitsData: number[];
  filteredUnits?: string[];
  selectedUnit?: string;
  slaActivity?: number[];
  slaBreaches?: number[];
  handlersData: number[];
  onChartClick?: () => void;
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '20px',
  width: '100%',
  boxSizing: 'border-box',
  marginBottom: '0',
  direction: 'rtl',
  alignItems: 'stretch',
};

const secondRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '20px',
  width: '100%',
  boxSizing: 'border-box',
  direction: 'rtl',
  alignItems: 'stretch',
};

const cardWrapperStyle: React.CSSProperties = {
  minHeight: '30px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: 0,
  flex: 1,
  overflow: 'hidden',
};

const responsiveStyle = `
.dashboard-charts-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; width: 100%; box-sizing: border-box; margin-bottom: 0; direction: rtl; align-items: stretch; }
.dashboard-charts-row:last-child { margin-bottom: 0; }
.dashboard-chart-card-wrapper { min-height: 30px; height: 100%; display: flex; flex-direction: column; width: 100%; min-width: 0; flex: 1; overflow: hidden; }
.dashboard-charts-second-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; width: 100%; box-sizing: border-box; direction: rtl; align-items: stretch; }
@media (max-width: 1024px) { .dashboard-charts-row { gap: 12px; } .dashboard-charts-second-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) { .dashboard-charts-row { flex-direction: column; margin-bottom: 0; } .dashboard-charts-row:last-child { margin-bottom: 0; } .dashboard-charts-second-row { grid-template-columns: 1fr; gap: 12px; } }
`;

export default function DashboardCharts({
  districtsData,
  statusesData,
  closedCount,
  unitsData,
  filteredUnits,
  selectedUnit,
  slaActivity,
  slaBreaches,
  handlersData,
  onChartClick,
}: DashboardChartsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '12px' }}>
      <style>{responsiveStyle}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '20px' }}>
        <div className="dashboard-charts-row" style={{ ...rowStyle, flex: 1, minHeight: 0 }}>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <DistrictsChart districtsData={districtsData} onChartClick={onChartClick} />
          </div>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <SlaByUnitChart slaActivity={slaActivity ?? []} slaBreaches={slaBreaches ?? []} unitsData={unitsData} onChartClick={onChartClick} />
          </div>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <StatusPieChart statusesData={statusesData} closedCount={closedCount} onChartClick={onChartClick} />
          </div>
        </div>

        <div className="dashboard-charts-second-row" style={{ ...secondRowStyle, flex: 1, minHeight: 0 }}>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <UnitsPieChart unitsData={unitsData} onChartClick={onChartClick} />
          </div>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <HandlersChart handlersData={handlersData} onChartClick={onChartClick} />
          </div>
          <div className="dashboard-chart-card-wrapper" style={cardWrapperStyle}>
            <TopicsByUnitChart filteredUnits={filteredUnits} selectedUnit={selectedUnit} onChartClick={onChartClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

