export type DashboardQueryDto = {
  unit?: string;
  district?: string;
  fromDate?: string;
  toDate?: string;
  kpiType?: string | null;
};

export type RequestItem = {
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
  createdAt: string;
  closedAt: string;
};

export type KpiData = {
  total: number;
  new: number;
  inProgress: number;
  urgent: number;
  slaBreaches: number;
  closedLast30Days: number;
};

export type ChartData = {
  districtsData: number[];
  statusesData: number[];
  unitsData: number[];
  topicsData: number[];
  handlersData: number[];
  topicsByUnit?: number[][];
  slaActivity?: number[];
  slaBreaches?: number[];
  trendData?: number[];
};

export type DashboardDataResponse = {
  kpi: KpiData;
  charts: ChartData;
  requests: RequestItem[];
  closedRequests: RequestItem[];
  allRequests: RequestItem[];
};

type RequestLike = Pick<RequestItem, 'urgent' | 'sla' | 'statusType'>;

export const isUrgentRequest = (request: RequestLike): boolean => request.urgent === true;
export const isSlaViolation = (request: RequestLike): boolean => request.sla === true;
export const isNewRequest = (request: RequestLike): boolean => request.statusType === 'new';
export const isInProgressRequest = (request: RequestLike): boolean => request.statusType === 'treatment';

const districtLabels = ['מערב', 'מזרח', 'דרום', 'צפון'];
const unitLabels = Array.from({ length: 50 }, (_, index) => `יחידה ${index + 1}`);

const topicLabels = ['נושא 1', 'נושא 2', 'נושא 3', 'נושא 4', 'נושא 5'];
const handlerLabels = ['תומר', 'גיא', 'נועה', 'עדי', 'רועי'];
const departmentLabels = ['מחלקה פנימית', 'מחלקה כירורגית', 'מחלקת ילדים', 'מחלקת נשים', 'מחלקת אורתופדיה'];

const initialData: ChartData = {
  districtsData: [60, 50, 45, 40],
  statusesData: [110, 80],
  unitsData: Array.from({ length: unitLabels.length }, (_, index) => 3 + (index % 6) + Math.floor(index / 10)),
  topicsData: [42, 48, 40, 36, 39],
  handlersData: [50, 46, 42, 38, 32],
  trendData: [55, 62, 68, 74, 70, 78, 82, 86],
};

// Visible statuses for the dashboard. Exclude 'handled' (closed) statuses.
const statusMap = [
  { type: 'new', text: 'חדש', color: '#3498db' },
  { type: 'treatment', text: 'בטיפול', color: '#e67e22' },
  { type: 'handled', text: 'נסגר', color: '#27ae60' },
] as const;

// The status type value that represents handled/closed requests in generated data.
const handledStatusType = 'handled';

const patientNames = [
  'אחמד מנצור',
  'פאטמה זועבי',
  'יעל כהן',
  'מרגי סילבה',
  'שחר לוי',
  'דניאל חזן',
  'רונית מולא',
  'ניר אלמגור',
  'אורנה פרץ',
  'אילן ברק',
  'לילך עבדאללה',
  'יוסף נעים',
];

let dbRequests: RequestItem[] = [];

const generateRequests = () => {
  const requests: RequestItem[] = [];
  const totalRequests = 240;

  const pickRandom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const pickWeighted = <T,>(items: readonly T[], weights: number[]) => {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    for (let index = 0; index < items.length; index += 1) {
      if (random < weights[index]) return items[index];
      random -= weights[index];
    }
    return items[items.length - 1];
  };

  // יחידות בעומס גבוה (60% מהפניות)
  const highLoadUnits = ['יחידה 3', 'יחידה 12', 'יחידה 25', 'יחידה 40'];
  
  // משקלות לנושאים - נושא 1 ו-3 משמעותיים יותר
  const topicWeights = [0.25, 0.15, 0.25, 0.18, 0.17];
  
  // משקלות למטפלים - גוון בעומס
  const handlerWeights = [0.28, 0.24, 0.20, 0.15, 0.13];
  
  // משקלות למחוזות - גוון בהתפלגות
  const districtWeights = [0.35, 0.25, 0.22, 0.18];
  
  const statusWeights = [0.35, 0.40, 0.25];
  let idCounter = 1;

  while (requests.length < totalRequests) {
    // בחירת יחידה עם משקל גבוה ליחידות בעומס גבוה
    let unit: string;
    if (Math.random() < 0.6) {
      // 60% - יחידות בעומס גבוה
      unit = pickRandom(highLoadUnits);
    } else {
      // 40% - יחידות אחרות
      const otherUnits = unitLabels.filter(u => !highLoadUnits.includes(u));
      unit = pickRandom(otherUnits);
    }
    
    // בחירת מחוז עם משקל מותאם
    const district = pickWeighted(districtLabels, districtWeights);
    
    // בחירת נושא עם משקל משמעותי
    const topic = pickWeighted(topicLabels, topicWeights);
    
    // בחירת מטפל עם משקל מותאם
    const handler = pickWeighted(handlerLabels, handlerWeights);
    const department = pickRandom(departmentLabels);
    
    // בחירת סטטוס
    const status = pickWeighted(statusMap, statusWeights);
    
    // הסתברות גבוהה יותר ליחידות בעומס גבוה
    const isHighLoadUnit = highLoadUnits.includes(unit);

    const createdAtDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const closedAtDate = new Date(createdAtDate);
    if (status.type === 'handled') {
      // נסגרו ב-30 יום האחרונים
      closedAtDate.setTime(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    } else {
      closedAtDate.setDate(createdAtDate.getDate() + Math.floor(Math.random() * 10) + 1);
    }

    requests.push({
      id: `PR-${idCounter}`,
      patientId: `P-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      patient: patientNames[(idCounter - 1) % patientNames.length],
      topic,
      statusType: status.type,
      statusText: status.text,
      statusColor: status.color,
      unit,
      district,
      handler,
      department,
      urgent: Math.random() < (isHighLoadUnit ? 0.28 : 0.16),
      sla: Math.random() < (isHighLoadUnit ? 0.28 : 0.12),
      createdAt: createdAtDate.toISOString().split('T')[0],
      closedAt: closedAtDate.toISOString().split('T')[0],
    });

    idCounter += 1;
  }

  return requests;
};

const initializeDbRequests = () => {
  if (dbRequests.length > 0) {
    return;
  }

  // כל עדכון לקוד יתנקה את ה-localStorage ויוצר נתונים חדשים
  const CACHE_VERSION = '4.1';
  const stored = localStorage.getItem('dashboard_requests');
  const storedVersion = localStorage.getItem('dashboard_requests_version');
  
  if (stored && storedVersion === CACHE_VERSION) {
    try {
      const parsed = JSON.parse(stored) as RequestItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        dbRequests = parsed;
        return;
      }
    } catch {
      // Ignore parse errors and fall back to fresh generation.
    }
  }

  // נתונים חדשים - מחק את הישן
  localStorage.removeItem('dashboard_requests');
  localStorage.removeItem('dashboard_requests_version');
  
  dbRequests = generateRequests();
  try {
    localStorage.setItem('dashboard_requests', JSON.stringify(dbRequests));
    localStorage.setItem('dashboard_requests_version', CACHE_VERSION);
  } catch {
    // Ignore storage errors and keep the generated data in-memory.
  }
};

const getVisibleRequests = () => dbRequests.filter((request) => request.statusType !== handledStatusType);
const getAllRequests = () => dbRequests;

const computeUnitKey = (unit: string | undefined) => (!unit || unit === 'all' ? null : unit);

const createDateFromString = (value: string): Date => new Date(value);

const requestMatchesFilters = (request: RequestItem, filters: DashboardQueryDto) => {
  if (filters.district && request.district !== filters.district) return false;
  const unitKey = computeUnitKey(filters.unit);
  if (unitKey && request.unit !== unitKey) return false;

  if (filters.kpiType && filters.kpiType !== 'total') {
    if (filters.kpiType === 'urgent' && !isUrgentRequest(request)) return false;
    if (filters.kpiType === 'sla' && !isSlaViolation(request)) return false;
    if (filters.kpiType === 'new' && !isNewRequest(request)) return false;
    if (filters.kpiType === 'in_progress' && !isInProgressRequest(request)) return false;
  }

  if (filters.fromDate) {
    const from = createDateFromString(filters.fromDate);
    const requestDate = createDateFromString(request.createdAt);
    if (requestDate < from) return false;
  }

  if (filters.toDate) {
    const to = createDateFromString(filters.toDate);
    const requestDate = createDateFromString(request.createdAt);
    if (requestDate > to) return false;
  }

  return true;
};

const computeChartData = (filteredRequests: RequestItem[], selectedUnit?: string): ChartData => {
  if (filteredRequests.length === 0) {
    const base = initialData;
    const topicsByUnit = (() => {
      if (!selectedUnit || selectedUnit === 'all') return undefined;
      return unitLabels.map(() => topicLabels.map(() => 0));
    })();

    const slaActivity = base.unitsData.slice();
    const slaBreaches = base.unitsData.map((v) => Math.round(v * 0.08));

    return {
      ...base,
      topicsByUnit,
      slaActivity,
      slaBreaches,
    };
  }

  const districtsData = districtLabels.map((label) => filteredRequests.filter((request) => request.district === label).length);
  const statusesData = statusMap.map((status) => filteredRequests.filter((request) => request.statusType === status.type).length);
  const unitsData = unitLabels.map((label) => filteredRequests.filter((request) => request.unit === label).length);
  const topicsData = topicLabels.map((label) => filteredRequests.filter((request) => request.topic === label).length);
  const handlersData = handlerLabels.map((label) => filteredRequests.filter((request) => request.handler === label).length);

  const topicsByUnit = unitLabels.map((unit) =>
    topicLabels.map((topic) => filteredRequests.filter((request) => request.unit === unit && request.topic === topic).length),
  );

  const slaActivity = unitLabels.map((unit) => filteredRequests.filter((request) => request.unit === unit).length);
  const slaBreaches = unitLabels.map((unit) => filteredRequests.filter((request) => request.unit === unit && request.sla).length);

  return {
    districtsData,
    statusesData,
    unitsData,
    topicsData,
    handlersData,
    topicsByUnit,
    slaActivity,
    slaBreaches,
  };
};

type KpiCounts = Omit<KpiData, 'closedLast30Days'>;

const computeKpiData = (filteredRequests: RequestItem[]): KpiCounts => {
  const total = filteredRequests.length;
  const newRequests = filteredRequests.filter((request) => isNewRequest(request)).length;
  const inProgress = filteredRequests.filter((request) => isInProgressRequest(request)).length;
  const urgent = filteredRequests.filter((request) => isUrgentRequest(request)).length;
  const slaBreaches = filteredRequests.filter((request) => isSlaViolation(request)).length;

  return {
    total,
    new: newRequests,
    inProgress,
    urgent,
    slaBreaches,
  };
};

const delay = (ms: number) => new Promise<void>((resolve) => {
  setTimeout(resolve, ms);
});

export async function getDashboardData(filters: DashboardQueryDto): Promise<DashboardDataResponse> {
  await delay(0);

  initializeDbRequests();

  const kpiFilters: DashboardQueryDto = {
    unit: filters.unit,
    district: filters.district,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  };

  const kpiRequests = getVisibleRequests().filter((request) => requestMatchesFilters(request, kpiFilters));
  const visibleChartRequests = getVisibleRequests().filter((request) => requestMatchesFilters(request, filters));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const closedRequests = getAllRequests().filter((request) => {
    if (request.statusType !== handledStatusType) return false;
    if (kpiFilters.district && request.district !== kpiFilters.district) return false;
    const unitKey = computeUnitKey(kpiFilters.unit);
    if (unitKey && request.unit !== unitKey) return false;
    return new Date(request.closedAt) >= thirtyDaysAgo;
  });

  const chartRequests = filters.kpiType === 'closed_30d'
    ? [...visibleChartRequests, ...closedRequests]
    : visibleChartRequests;
  const closedLast30Days = closedRequests.length;

  const chartData = computeChartData(chartRequests, filters.unit);
  const kpiData = computeKpiData(kpiRequests);
  const allReqs = getAllRequests();

  return {
    kpi: { ...kpiData, closedLast30Days },
    charts: chartData,
    requests: chartRequests,
    closedRequests,
    allRequests: allReqs,
  };
}
