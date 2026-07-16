import KpiGrid, { type KpiGridData } from '../Dashboard/KpiGrid';

type Props = {
  data: KpiGridData;
  activeKpi: string | null;
  onKpiSelect: (kpiType: string | null) => void;
  closedRequests?: import('../../services/api').RequestItem[];
  onOpenClosedRequests?: () => void;
  transitionVersion?: number;
};

export default function KpiCards({ data, activeKpi, onKpiSelect, closedRequests, onOpenClosedRequests, transitionVersion }: Props) {
  return <KpiGrid data={data} activeKpi={activeKpi} onKpiSelect={onKpiSelect} closedRequests={closedRequests} onOpenClosedRequests={onOpenClosedRequests} transitionVersion={transitionVersion} />;
}
