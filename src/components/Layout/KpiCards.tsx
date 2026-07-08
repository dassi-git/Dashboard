import KpiGrid, { type KpiGridData } from '../Dashboard/KpiGrid';

type Props = {
  data: KpiGridData;
  activeKpi: string | null;
  onKpiSelect: (kpiType: string | null) => void;
  closedRequests?: import('../../services/api').RequestItem[];
};

export default function KpiCards({ data, activeKpi, onKpiSelect, closedRequests }: Props) {
  return <KpiGrid data={data} activeKpi={activeKpi} onKpiSelect={onKpiSelect} closedRequests={closedRequests} />;
}
