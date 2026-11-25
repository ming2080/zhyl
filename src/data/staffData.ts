import type { StaffMember, StaffStatusSummary } from '../types';

// 护工人员库筛选选项（与 StaffMember 类型中的字面量保持一致）
export const STAFF_SERVICE_TYPES: StaffMember['serviceType'][] = [
  '家政护理',
  '康复理疗',
  '上门体检',
  '适老改造',
];

export const STAFF_STATUS_OPTIONS: StaffMember['status'][] = [
  '服务中',
  '空闲接单',
  '轮休',
];

// 在岗状态徽章样式（由数据层统一维护，组件只查表）
export const STAFF_STATUS_BADGE_STYLES: Record<StaffMember['status'], string> = {
  '服务中': 'bg-blue-50 text-blue-700 border-blue-200',
  '空闲接单': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '轮休': 'bg-gray-100 text-gray-600 border-gray-200',
};

// 汇总条卡片定义：标题、取值键、数值后缀
export const STAFF_SUMMARY_CARDS: {
  key: keyof StaffStatusSummary;
  label: string;
  suffix: string;
}[] = [
  { key: 'total', label: '在册人员', suffix: '名' },
  { key: 'serving', label: '服务中', suffix: '名' },
  { key: 'idle', label: '空闲接单', suffix: '名' },
  { key: 'resting', label: '轮休', suffix: '名' },
  { key: 'totalMonthlyOrders', label: '9月累计工单', suffix: '单' },
  { key: 'avgSatisfactionRate', label: '长者平均好评率', suffix: '' },
];

// 由人员列表实时汇总统计：切换任意护工状态后汇总条随之联动
export function getStaffStatusSummary(list: StaffMember[]): StaffStatusSummary {
  const serving = list.filter((s) => s.status === '服务中').length;
  const idle = list.filter((s) => s.status === '空闲接单').length;
  const resting = list.filter((s) => s.status === '轮休').length;
  const totalMonthlyOrders = list.reduce((sum, s) => sum + s.monthlyOrders, 0);
  const avgSatisfactionRate =
    list.length === 0
      ? '—'
      : `${(
          list.reduce((sum, s) => sum + parseFloat(s.satisfactionRate), 0) /
          list.length
        ).toFixed(1)}%`;

  return {
    total: list.length,
    serving,
    idle,
    resting,
    totalMonthlyOrders,
    avgSatisfactionRate,
  };
}
