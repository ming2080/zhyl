import type { PointsRuleConfig } from '../types';

// 长者敬老健康积分规则默认值（与积分规则页初始展示一致）
export const DEFAULT_POINTS_RULE: PointsRuleConfig = {
  ruleType: 'amount',
  spendAmount: 10,
  amountPoints: 1,
  orderPoints: 5,
  validityType: 'permanent',
  validityDays: 365,
  deductPoints: 100,
  hasDeductLimit: false,
  maxDeductPoints: 500,
  specifyProduct: false,
};

// 按当前规则配置生成摘要文案，供积分规则页实时预览
export function describePointsRule(config: PointsRuleConfig): string[] {
  const earn =
    config.ruleType === 'amount'
      ? `每消费 ${config.spendAmount} 元获取 ${config.amountPoints} 分`
      : `每消费 1 笔获取 ${config.orderPoints} 分`;
  const validity =
    config.validityType === 'permanent'
      ? '积分永久有效'
      : `积分获取后 ${config.validityDays} 天内有效`;
  const deduct = config.hasDeductLimit
    ? `${config.deductPoints} 分可抵扣 1 元，单笔最多抵扣 ${config.maxDeductPoints} 分`
    : `${config.deductPoints} 分可抵扣 1 元，抵扣不设上限`;
  return [earn, validity, deduct];
}
