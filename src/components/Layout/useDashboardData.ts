import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [selectedClosedYear, setSelectedClosedYear] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialUnit, setModalInitialUnit] = useState<string | undefined>(undefined);
  const [modalInitialHandler, setModalInitialHandler] = useState<string | undefined>(undefined);
  const [modalInitialDistrict, setModalInitialDistrict] = useState<string | undefined>(undefined);
  const [modalInitialKpiType, setModalInitialKpiType] = useState<string | null | undefined>(undefined);
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [transitionVersion, setTransitionVersion] = useState(0);
  const previousFilterSignatureRef = useRef('');

  useEffect(() => {
    const filterSignature = `${selectedUnit}|${selectedDistrict}|${activeKpi ?? 'none'}|${selectedClosedYear}`;
    if (previousFilterSignatureRef.current === filterSignature) {
      return;
    }

    previousFilterSignatureRef.current = filterSignature;
    setTransitionVersion((current) => current + 1);
  }, [selectedUnit, selectedDistrict, activeKpi, selectedClosedYear, retryKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRetryKey((current) => current + 1);
    }, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getDashboardData({
          unit: selectedUnit !== 'all' ? selectedUnit : undefined,
          district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
          kpiType: activeKpi,
          closedYear: selectedClosedYear,
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedUnit, selectedDistrict, activeKpi, selectedClosedYear, retryKey]);

  const uniqueDistricts = useMemo(() => ['all', ...districtLabels], []);

  const availableUnits = useMemo(() => {
    if (selectedDistrict === 'all') return unitLabels.slice();
    return unitLabels.filter((u) => unitDistrictMap[u] === selectedDistrict);
  }, [selectedDistrict]);

  const closedYearOptions = useMemo(() => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: Math.max(1, currentYear - startYear + 1) }, (_, index) => currentYear - index);
    return years.filter((year) => year >= startYear);
  }, []);

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
  const handleOpenRequests = (selection?: { unit?: string; handler?: string; district?: string; kpiType?: string } | string) => {
    if (typeof selection === 'string') {
      setModalInitialUnit(selection);
      setModalInitialHandler(undefined);
      setModalInitialDistrict(undefined);
      setModalInitialKpiType(undefined);
    } else if (selection?.unit) {
      setModalInitialUnit(selection.unit);
      setModalInitialHandler(undefined);
      setModalInitialDistrict(undefined);
      setModalInitialKpiType(undefined);
    } else if (selection?.handler) {
      setModalInitialHandler(selection.handler);
      setModalInitialUnit(undefined);
      setModalInitialDistrict(undefined);
      setModalInitialKpiType(undefined);
    } else if (selection?.district) {
      setModalInitialUnit(undefined);
      setModalInitialHandler(undefined);
      setModalInitialDistrict(selection.district);
      setModalInitialKpiType(undefined);
    } else if (selection?.kpiType) {
      setModalInitialUnit(undefined);
      setModalInitialHandler(undefined);
      setModalInitialDistrict(undefined);
      setModalInitialKpiType(selection.kpiType);
    } else {
      setModalInitialUnit(undefined);
      setModalInitialHandler(undefined);
      setModalInitialDistrict(undefined);
      setModalInitialKpiType(undefined);
    }
    setIsModalOpen(true);
  };

  const closeRequestsModal = () => {
    setIsModalOpen(false);
    setModalInitialUnit(undefined);
    setModalInitialHandler(undefined);
    setModalInitialDistrict(undefined);
    setModalInitialKpiType(undefined);
  };

  const handleSetSelectedDistrict = (district: string) => {
    setSelectedDistrict(district);
    if (selectedUnit !== 'all' && selectedUnit && unitDistrictMap[selectedUnit] !== district) {
      setSelectedUnit('all');
    }
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
    modalInitialUnit,
    modalInitialHandler,
    modalInitialDistrict,
    modalInitialKpiType,
    closeRequestsModal,
    selectedClosedYear,
    setSelectedClosedYear,
    closedYearOptions,
    data,
    isLoading,
    error,
    handleRetry,
    transitionVersion,
  } as const;
}
