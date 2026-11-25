import type { LevelItem } from '../types';

// 等级管理页初始等级列表（与原页面初始展示一致）
export const INITIAL_LEVELS: LevelItem[] = [
  {
    id: 'lvl-01',
    name: 'Lv1',
    status: true,
    levelType: '一级',
    upgradeType: '注册',
    benefits: '1倍积分; 新人礼包; 基础健康档案',
    receiver: '张珊',
    sendMethod: '系统消息',
    updateTime: '2026-09-19 16:30:00',
    upgradeConditions: {
      spendAmountEnabled: false,
      spendAmount: '',
      growthEnabled: false,
      growthValue: '',
    },
    benefitSettings: {
      discountEnabled: false,
      discountValue: '',
      pointsMultiplierEnabled: false,
      pointsMultiplierValue: '',
      healthAssessmentEnabled: true,
    },
    description: '长者完成实名注册认证即可享受的基础银发会员等级。',
  },
  {
    id: 'lvl-02',
    name: 'Lv2',
    status: true,
    levelType: '一级',
    upgradeType: '注册',
    benefits: '2倍积分; 9.8折优惠; 健康测评',
    receiver: '张珊',
    sendMethod: '系统消息',
    updateTime: '2026-09-18 14:20:10',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '500',
      growthEnabled: true,
      growthValue: '200',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '9.8',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '2',
      healthAssessmentEnabled: true,
    },
    description: '累计消费满500元或成长值达200点，享季度健康档案评估及折扣。',
  },
  {
    id: 'lvl-03',
    name: 'Lv3',
    status: true,
    levelType: '一级',
    upgradeType: '注册',
    benefits: '2倍积分; 9.8折优惠; 健康测评',
    receiver: '张珊',
    sendMethod: '系统消息',
    updateTime: '2026-09-17 11:15:30',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '1200',
      growthEnabled: true,
      growthValue: '600',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '9.5',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '2',
      healthAssessmentEnabled: true,
    },
    description: '享社区助餐优先排期及双月心脑血管健康综合评估。',
  },
  {
    id: 'lvl-04',
    name: 'Lv4',
    status: true,
    levelType: '一级',
    upgradeType: '注册',
    benefits: '2倍积分; 9.8折优惠; 健康测评',
    receiver: '张珊',
    sendMethod: '系统消息',
    updateTime: '2026-09-16 15:40:00',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '3000',
      growthEnabled: true,
      growthValue: '1500',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '9.2',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '2',
      healthAssessmentEnabled: true,
    },
    description: '赠送专车陪诊服务券及每月骨密度、慢病动态随访。',
  },
  {
    id: 'lvl-05',
    name: 'Lv5',
    status: true,
    levelType: '二级',
    upgradeType: '累计消费',
    benefits: '2.5倍积分; 8.8折优惠; 专属管家; 绿色通道',
    receiver: '李明明',
    sendMethod: '短信通知',
    updateTime: '2026-09-14 09:30:00',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '6000',
      growthEnabled: true,
      growthValue: '3500',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '8.8',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '2.5',
      healthAssessmentEnabled: true,
    },
    description: '配备专属健康管理师，建立家庭医生档案，提供全年体检全套服务。',
  },
  {
    id: 'lvl-06',
    name: 'Lv6',
    status: true,
    levelType: '二级',
    upgradeType: '照护签约',
    benefits: '3倍积分; 8.5折优惠; 设备免押; 三甲会诊',
    receiver: '运营主管',
    sendMethod: '系统消息',
    updateTime: '2026-09-10 14:10:00',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '12000',
      growthEnabled: true,
      growthValue: '7000',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '8.5',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '3',
      healthAssessmentEnabled: true,
    },
    description: '居家智能监测设备免收押金，优先享有三甲医院专家深度会诊名额。',
  },
  {
    id: 'lvl-07',
    name: 'Lv7',
    status: true,
    levelType: '三级',
    upgradeType: '定制签约',
    benefits: '3.5倍积分; 8.0折优惠; 24h家庭医生; 旅居康养',
    receiver: '会长专线',
    sendMethod: '微信服务号',
    updateTime: '2026-09-04 10:00:00',
    upgradeConditions: {
      spendAmountEnabled: true,
      spendAmount: '30000',
      growthEnabled: true,
      growthValue: '20000',
    },
    benefitSettings: {
      discountEnabled: true,
      discountValue: '8.0',
      pointsMultiplierEnabled: true,
      pointsMultiplierValue: '3.5',
      healthAssessmentEnabled: true,
    },
    description: '定制全天候私人照护计划，提供全国连锁医养中心度假与绿色直通。',
  },
];
export interface LevelStats {
  total: number;
  enabled: number;
  disabled: number;
  levelTypeCounts: Record<string, number>;
}

// 由等级数据层派生的汇总统计：等级总数、启用/停用数、各层级等级数
export const computeLevelStats = (levels: LevelItem[]): LevelStats => {
  const levelTypeCounts: Record<string, number> = {};
  let enabled = 0;
  levels.forEach((lvl) => {
    if (lvl.status) enabled += 1;
    levelTypeCounts[lvl.levelType] = (levelTypeCounts[lvl.levelType] ?? 0) + 1;
  });
  return {
    total: levels.length,
    enabled,
    disabled: levels.length - enabled,
    levelTypeCounts,
  };
};
