import { useEffect, useMemo, useState } from 'react';
import type { KpiGridData } from '../Dashboard/KpiGrid';
import { getDashboardData, type DashboardDataResponse } from '../../services/api';

type UnitId = 'all' | string;

const districtLabels = ['מערב', 'מזרח', 'דרום', 'צפון'];
const unitLabels = Array.from({ length: 50 }, (_, index) => `יחידה ${index + 1}`);

// Deterministic mapping of units -> districts
const unitDistrictMap: Record<string, string> = unitLabels.reduce((acc, unit, idx) => {
  const n = idx + 1;
  let d = 'מערב';
  if (n <= 12) d = 'צפון';
  else if (n <= 25) d = 'דרום';
  else if (n <= 38) d = 'מזרח';
  else d = 'מערב';
  acc[unit] = d;
  return acc;
}, {} as Record<string, string>);

const initialDashboardData: DashboardDataResponse = {
  kpi: {
    total: 0,
    new: 0,
    inProgress: 0,
    urgent: 0,
    slaBreaches: 0,
    closedLast30Days: 0,
  },
  charts: {
    districtsData: [0, 0, 0, 0],
    statusesData: [0, 0],
    unitsData: Array.from({ length: unitLabels.length }, () => 0),
    topicsData: Array.from({ length: 5 }, () => 0),
    handlersData: Array.from({ length: 5 }, () => 0),
    topicsByUnit: undefined,
    slaActivity: undefined,
    slaBreaches: undefined,
    trendData: undefined,
  },
  requests: [],
  closedRequests: [],
  allRequests: [],
};

const hasKpiFilter = (request: { urgent: boolean; sla: boolean; statusType: string }, activeKpi: string | null) => {
  if (!activeKpi || activeKpi === 'total') return true;
  if (activeKpi === 'urgent') return request.urgent;
  if (activeKpi === 'sla') return request.sla;
  return request.statusType === activeKpi;
};

export default function useDashboardData() {
  const [selectedUnit, setSelectedUnit] = useState<UnitId>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRetryKey((current) => current + 1);
    }, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const isFirstLoad = data === null;

    const fetchData = async () => {
      if (isFirstLoad) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const response = await getDashboardData({
          unit: selectedUnit !== 'all' ? selectedUnit : undefined,
          district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
          kpiType: activeKpi,
        });
        if (isMounted) {
          setData(response);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (isMounted) {
          setError('אירעה שגיאה בטעינת הנתונים. אנא נסה לרענן את העמוד או לפנות לתמיכה.');
        }
      } finally {
        if (isMounted && isFirstLoad) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedUnit, selectedDistrict, activeKpi, retryKey]);

  const uniqueDistricts = useMemo(() => ['all', ...districtLabels], []);

  const availableUnits = useMemo(() => {
    if (selectedDistrict === 'all') return unitLabels.slice();
    return unitLabels.filter((u) => unitDistrictMap[u] === selectedDistrict);
  }, [selectedDistrict]);

  const unitFilteredRequests = useMemo(() => data?.requests ?? [], [data]);
  const closedRequests = useMemo(() => data?.closedRequests ?? [], [data]);

  const chartFilteredRequests = useMemo(
    () => (data?.requests ?? []).filter((request) => hasKpiFilter(request, activeKpi)),
    [activeKpi, data],
  );

  const chartData = data?.charts ?? initialDashboardData.charts;

  const kpiData: KpiGridData = useMemo(() => ({
    total: data?.kpi.total ?? initialDashboardData.kpi.total,
    new: data?.kpi.new ?? initialDashboardData.kpi.new,
    inProgress: data?.kpi.inProgress ?? initialDashboardData.kpi.inProgress,
    urgent: data?.kpi.urgent ?? initialDashboardData.kpi.urgent,
    slaBreaches: data?.kpi.slaBreaches ?? initialDashboardData.kpi.slaBreaches,
    closedLast30Days: data?.kpi.closedLast30Days ?? 0,
  }), [data]);

  const handleUnitSelect = (unitId: string) => setSelectedUnit(unitId as UnitId);
  const handleKpiSelect = (kpiType: string | null) => setActiveKpi((current) => (current === kpiType ? null : kpiType));
  const handleOpenRequests = () => setIsModalOpen(true);

  const handleSetSelectedDistrict = (district: string) => {
    setSelectedDistrict(district);
    setSelectedUnit('all');
  };

  const handleRetry = () => {
    setError(null);
    setRetryKey((current) => current + 1);
  };

  return {
    selectedUnit,
    selectedDistrict,
    setSelectedDistrict: handleSetSelectedDistrict,
    handleUnitSelect,
    activeKpi,
    handleKpiSelect,
    isModalOpen,
    setIsModalOpen,
    unitFilteredRequests,
    closedRequests,
    chartFilteredRequests,
    chartData,
    kpiData,
    uniqueDistricts,
    availableUnits,
    handleOpenRequests,
    data,
    isLoading,
    error,
    handleRetry,
  } as const;
}
