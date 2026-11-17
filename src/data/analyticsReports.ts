import type { DailyOperationReport, DailyOperationSummary } from '../types';

// 2026年9月运营日报（2026-09-18 至 2026-09-01，按日期降序）
export const dailyOperationReports: DailyOperationReport[] = [
  { date: '2026-09-18', newOrders: 148, completedOrders: 142, activeStaff: 32, alarmCount: 2, healthAssessments: 16, satisfaction: 99.5 },
  { date: '2026-09-17', newOrders: 152, completedOrders: 149, activeStaff: 32, alarmCount: 1, healthAssessments: 18, satisfaction: 99.2 },
  { date: '2026-09-16', newOrders: 139, completedOrders: 136, activeStaff: 30, alarmCount: 1, healthAssessments: 14, satisfaction: 99.4 },
  { date: '2026-09-15', newOrders: 160, completedOrders: 155, activeStaff: 33, alarmCount: 0, healthAssessments: 20, satisfaction: 99.6 },
  { date: '2026-09-14', newOrders: 145, completedOrders: 141, activeStaff: 31, alarmCount: 1, healthAssessments: 15, satisfaction: 98.9 },
  { date: '2026-09-12', newOrders: 158, completedOrders: 153, activeStaff: 32, alarmCount: 0, healthAssessments: 19, satisfaction: 99.1 },
  { date: '2026-09-10', newOrders: 142, completedOrders: 139, activeStaff: 29, alarmCount: 1, healthAssessments: 12, satisfaction: 99.0 },
  { date: '2026-09-08', newOrders: 135, completedOrders: 131, activeStaff: 28, alarmCount: 0, healthAssessments: 11, satisfaction: 99.3 },
  { date: '2026-09-05', newOrders: 128, completedOrders: 125, activeStaff: 28, alarmCount: 1, healthAssessments: 10, satisfaction: 98.8 },
  { date: '2026-09-01', newOrders: 120, completedOrders: 118, activeStaff: 27, alarmCount: 0, healthAssessments: 22, satisfaction: 99.2 },
];

export type DailyReportRange = '7d' | '14d' | 'all';

export const DAILY_REPORT_RANGE_OPTIONS: { value: DailyReportRange; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: '14d', label: '近14天' },
  { value: '7d', label: '近7天' },
];

export function getDailyReportRangeLabel(range: DailyReportRange): string {
  if (range === '14d') return '近14天';
  if (range === '7d') return '近7天';
  return '2026年9月';
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 按时间范围筛选日报：以数据中最晚日期为基准，近7天取基准日前 6 天起，近14天取基准日前 13 天起
export function filterDailyReportsByRange(
  reports: DailyOperationReport[],
  range: DailyReportRange,
): DailyOperationReport[] {
  if (range === 'all') return [...reports];
  const maxDate = reports.reduce((max, r) => (r.date > max ? r.date : max), reports[0]?.date ?? '');
  if (!maxDate) return [];
  const days = range === '7d' ? 7 : 14;
  const cutoff = addDays(maxDate, -(days - 1));
  return reports.filter((r) => r.date >= cutoff);
}

// 由筛选后的日报汇总区间指标
export function summarizeDailyReports(reports: DailyOperationReport[]): DailyOperationSummary {
  const dayCount = reports.length;
  const totalNewOrders = reports.reduce((sum, r) => sum + r.newOrders, 0);
  const totalCompletedOrders = reports.reduce((sum, r) => sum + r.completedOrders, 0);
  const totalAlarms = reports.reduce((sum, r) => sum + r.alarmCount, 0);
  const totalHealthAssessments = reports.reduce((sum, r) => sum + r.healthAssessments, 0);
  const avgSatisfaction =
    dayCount === 0 ? 0 : reports.reduce((sum, r) => sum + r.satisfaction, 0) / dayCount;
  const avgActiveStaff =
    dayCount === 0 ? 0 : reports.reduce((sum, r) => sum + r.activeStaff, 0) / dayCount;
  return {
    dayCount,
    totalNewOrders,
    totalCompletedOrders,
    completionRate: totalNewOrders === 0 ? 0 : (totalCompletedOrders / totalNewOrders) * 100,
    totalAlarms,
    totalHealthAssessments,
    avgSatisfaction,
    avgActiveStaff,
  };
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
