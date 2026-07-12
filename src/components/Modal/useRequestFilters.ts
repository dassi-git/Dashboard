import { useEffect, useMemo, useState } from 'react';
import { isInProgressRequest, isNewRequest, isSlaViolation, isUrgentRequest } from '../../services/api';

const ALL_SELECTED = 'הכל';

export const unitsRawData = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  let district = 'מרכז';
  if (id % 5 === 0) district = 'צפון';
  else if (id % 5 === 1) district = 'דרום';
  else if (id % 5 === 2) district = 'ירושלים';
  else if (id % 5 === 3) district = 'חיפה';
  return { label: `יחידה ${id}`, district };
});

export type FilterType = 'all' | 'urgent' | 'sla' | 'in_progress' | 'new';

export interface RequestItem {
  id: string;
  patientId: string;
  patient: string;
  topic: string;
  statusType: string;
  statusText: string;
  statusColor: string;
  unit: string;
  district: string;
  handler: string;
  department: string;
  urgent: boolean;
  sla: boolean;
  createdAt?: string; // תאריך קבלת הפנייה (פורמט ISO: YYYY-MM-DD)
  closedAt?: string; // תאריך סגירת הפנייה (פורמט ISO: YYYY-MM-DD)
}

export interface FilterCounts {
  all: number;
  new: number;
  treatment: number;
  handled: number;
  urgent: number;
  sla: number;
}

export interface AdvancedFilterState {
  selectedDistricts: string[];
  selectedUnits: string[];
  selectedHandlers: string[];
  generalSearch: string;
  startDate: string;
  endDate: string;
}

export interface UseRequestFiltersArgs {
  initialDistrict?: string;
  initialUnit?: string;
  initialKpiType?: string | null;
}

export function useRequestFilters(allRequests: RequestItem[], initialFilters?: UseRequestFiltersArgs) {
  const buildInitialDraftState = (): AdvancedFilterState => ({
    selectedDistricts: initialFilters?.initialDistrict && initialFilters.initialDistrict !== 'all' ? [initialFilters.initialDistrict] : [],
    selectedUnits: initialFilters?.initialUnit && initialFilters.initialUnit !== 'all' ? [initialFilters.initialUnit] : [],
    selectedHandlers: [],
    generalSearch: '',
    startDate: '',
    endDate: '',
  });

  const getInitialActiveFilters = (): FilterType[] => {
    // debug: log initialKpiType for troubleshooting closed_30d behavior
    try {
      // eslint-disable-next-line no-console
      console.log('useRequestFilters.getInitialActiveFilters initialKpiType', initialFilters?.initialKpiType);
    } catch (e) {}

    if (!initialFilters?.initialKpiType || initialFilters.initialKpiType === 'total') return ['all'];
    if (initialFilters.initialKpiType === 'urgent') return ['urgent'];
    if (initialFilters.initialKpiType === 'sla') return ['sla'];
    if (initialFilters.initialKpiType === 'new') return ['new'];
    if (initialFilters.initialKpiType === 'in_progress') return ['in_progress'];
    return ['all'];
  };

  const [activeFilters, setActiveFilters] = useState<FilterType[]>(getInitialActiveFilters);
  const [draftFilters, setDraftFilters] = useState<AdvancedFilterState>(buildInitialDraftState);
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFilterState>(buildInitialDraftState);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const nextDraftState = buildInitialDraftState();
    setActiveFilters(getInitialActiveFilters());
    setDraftFilters(nextDraftState);
    setAppliedFilters(nextDraftState);
  }, [initialFilters?.initialDistrict, initialFilters?.initialUnit, initialFilters?.initialKpiType]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(draftFilters.generalSearch);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [draftFilters.generalSearch]);

  const filteredRequests = useMemo(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('useRequestFilters: computing filteredRequests', {
        allRequestsLen: allRequests.length,
        activeFilters,
        appliedFilters,
      });
    } catch (e) {}

    const matchesActiveFilters = (request: RequestItem) => {
      if (activeFilters.includes('all')) return true;
      if (activeFilters.includes('urgent') && !isUrgentRequest(request)) return false;
      if (activeFilters.includes('sla') && !isSlaViolation(request)) return false;
      if (activeFilters.includes('new') && !isNewRequest(request)) return false;
      if (activeFilters.includes('in_progress') && !isInProgressRequest(request)) return false;
      return true;
    };

    const filtered = allRequests.filter((request) => {
      if (!matchesActiveFilters(request)) return false;

      const generalSearch = debouncedSearch.trim().toLowerCase();
      if (generalSearch) {
        const matchesPatientName = request.patient.toLowerCase().includes(generalSearch);
        const patientIdFromRequest = request.id.replace(/\D/g, '');
        const matchesPatientId = patientIdFromRequest.includes(generalSearch);
        const matchesHandlerName = request.handler.toLowerCase().includes(generalSearch);
        const matchesRequestId = request.id.toLowerCase().includes(generalSearch);
        const matchesTopic = request.topic.toLowerCase().includes(generalSearch);
        const matchesUnit = request.unit.toLowerCase().includes(generalSearch);
        const matchesAny = matchesPatientName || matchesPatientId || matchesHandlerName || matchesRequestId || matchesTopic || matchesUnit;
        if (!matchesAny) return false;
      }

      if (
        appliedFilters.selectedDistricts.length > 0 &&
        !appliedFilters.selectedDistricts.includes(ALL_SELECTED) &&
        !appliedFilters.selectedDistricts.includes(request.district)
      )
        return false;

      if (
        appliedFilters.selectedUnits.length > 0 &&
        !appliedFilters.selectedUnits.includes(ALL_SELECTED) &&
        !appliedFilters.selectedUnits.includes(request.unit)
      )
        return false;

      if (
        appliedFilters.selectedHandlers.length > 0 &&
        !appliedFilters.selectedHandlers.includes(ALL_SELECTED) &&
        !appliedFilters.selectedHandlers.includes(request.handler)
      )
        return false;

      if (appliedFilters.startDate && request.createdAt) {
        const startDateObj = new Date(appliedFilters.startDate);
        const requestDateObj = new Date(request.createdAt);
        if (requestDateObj < startDateObj) return false;
      }

      if (appliedFilters.endDate && request.createdAt) {
        const endDateObj = new Date(appliedFilters.endDate);
        const requestDateObj = new Date(request.createdAt);
        if (requestDateObj > endDateObj) return false;
      }

      return true;
    });

    // Sort by createdAt
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    try {
      // eslint-disable-next-line no-console
      console.log('useRequestFilters: filteredRequests count', sorted.length);
    } catch (e) {}

    return sorted;
  }, [allRequests, activeFilters, appliedFilters, debouncedSearch, sortOrder]);

  const filterCounts = useMemo<FilterCounts>(() => {
    const counts = {
      all: 0,
      new: 0,
      treatment: 0,
      handled: 0,
      urgent: 0,
      sla: 0,
    };

    for (const r of filteredRequests) {
      counts.all += 1;
      if (isNewRequest(r)) counts.new += 1;
      if (isInProgressRequest(r)) counts.treatment += 1;
      if (r.statusType === 'handled') counts.handled += 1;
      if (isUrgentRequest(r)) counts.urgent += 1;
      if (isSlaViolation(r)) counts.sla += 1;
    }

    return counts as FilterCounts;
  }, [filteredRequests]);

  const districtOptions = useMemo(
    () => Array.from(new Set(unitsRawData.map((unit) => unit.district))).sort(),
    [],
  );

  const unitOptions = useMemo(
    () => unitsRawData.map((unit) => unit.label).sort(),
    [],
  );

  const visibleUnitOptions = useMemo(() => {
    if (!draftFilters.selectedDistricts || draftFilters.selectedDistricts.length === 0 || draftFilters.selectedDistricts.includes(ALL_SELECTED)) {
      return unitOptions;
    }

    return unitsRawData
      .filter((unit) => draftFilters.selectedDistricts.includes(unit.district))
      .map((unit) => unit.label)
      .sort();
  }, [draftFilters.selectedDistricts, unitOptions]);

  useEffect(() => {
    const activeDistricts = draftFilters.selectedDistricts;
    if (!activeDistricts || activeDistricts.length === 0 || activeDistricts.includes(ALL_SELECTED)) {
      return;
    }

    setDraftFilters((prevFilters) => {
      if (prevFilters.selectedUnits.includes(ALL_SELECTED)) {
        return prevFilters;
      }

      const filteredUnits = prevFilters.selectedUnits.filter((unitName) => {
        const unitData = unitsRawData.find((u) => u.label === unitName);
        return Boolean(unitData && activeDistricts.includes(unitData.district));
      });

      return {
        ...prevFilters,
        selectedUnits: filteredUnits.length > 0 ? filteredUnits : [ALL_SELECTED],
      };
    });
  }, [draftFilters.selectedDistricts]);

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const clearAll = () => {
    const resetState = buildInitialDraftState();
    setActiveFilters(getInitialActiveFilters());
    setDraftFilters(resetState);
    setAppliedFilters(resetState);
  };

  const isAnyFilterActive =
    !(activeFilters.length === 1 && activeFilters[0] === 'all') ||
    appliedFilters.generalSearch.trim() ||
    (appliedFilters.selectedDistricts.length > 0 && !appliedFilters.selectedDistricts.includes(ALL_SELECTED)) ||
    (appliedFilters.selectedUnits.length > 0 && !appliedFilters.selectedUnits.includes(ALL_SELECTED)) ||
    (appliedFilters.selectedHandlers.length > 0 && !appliedFilters.selectedHandlers.includes(ALL_SELECTED)) ||
    appliedFilters.startDate ||
    appliedFilters.endDate;

  const exportToCsv = () => {
    const BOM = '\uFEFF';
    const headers = ['מזהה', 'שם מטופל', 'נושא', 'סטטוס', 'יחידה', 'מחוז', 'מטפל', 'דחוף', 'SLA', 'תאריך יצירה'];

    const rows = filteredRequests.map((request) => [
      request.id,
      request.patient,
      request.topic,
      request.statusText,
      request.unit,
      request.district,
      request.handler,
      request.urgent ? 'כן' : 'לא',
      request.sla ? 'כן' : 'לא',
      request.createdAt ?? '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered_requests.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    activeFilters,
    setActiveFilters,
    generalSearch: draftFilters.generalSearch,
    setGeneralSearch: (next: string) => setDraftFilters((prev) => ({ ...prev, generalSearch: next })),
    selectedDistricts: draftFilters.selectedDistricts,
    setSelectedDistricts: (next: string[]) => setDraftFilters((prev) => ({ ...prev, selectedDistricts: next })),
    selectedUnits: draftFilters.selectedUnits,
    setSelectedUnits: (next: string[]) => setDraftFilters((prev) => ({ ...prev, selectedUnits: next })),
    selectedHandlers: draftFilters.selectedHandlers,
    setSelectedHandlers: (next: string[]) => setDraftFilters((prev) => ({ ...prev, selectedHandlers: next })),
    startDate: draftFilters.startDate,
    setStartDate: (next: string) => setDraftFilters((prev) => ({ ...prev, startDate: next })),
    endDate: draftFilters.endDate,
    setEndDate: (next: string) => setDraftFilters((prev) => ({ ...prev, endDate: next })),
    filteredRequests,
    filterCounts,
    districtOptions,
    unitOptions,
    visibleUnitOptions,
    applyFilters,
    clearAll,
    isAnyFilterActive,
    appliedFilters,
    exportToCsv,
    sortOrder,
    setSortOrder,
  } as const;
}

export default useRequestFilters;
