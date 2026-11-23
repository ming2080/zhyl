import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, RotateCcw, ShoppingBag } from 'lucide-react';
import { DEFAULT_POINTS_RULE, describePointsRule } from '../data/pointsRuleData';

interface PointsRuleManagementProps {
  onNotice: (msg: string) => void;
}

export const PointsRuleManagement: React.FC<PointsRuleManagementProps> = ({ onNotice }) => {
  // Form state（初始值取自积分规则默认配置 src/data/pointsRuleData.ts）
  const [ruleType, setRuleType] = useState<'amount' | 'order'>(DEFAULT_POINTS_RULE.ruleType);
  const [spendAmount, setSpendAmount] = useState(String(DEFAULT_POINTS_RULE.spendAmount));
  const [amountPoints, setAmountPoints] = useState(String(DEFAULT_POINTS_RULE.amountPoints));
  const [orderPoints, setOrderPoints] = useState(String(DEFAULT_POINTS_RULE.orderPoints));

  const [validityType, setValidityType] = useState<'permanent' | 'days'>(DEFAULT_POINTS_RULE.validityType);
  const [validityDays, setValidityDays] = useState(String(DEFAULT_POINTS_RULE.validityDays));

  const [deductPoints, setDeductPoints] = useState(String(DEFAULT_POINTS_RULE.deductPoints)); // 100分抵扣1元
  const [hasDeductLimit, setHasDeductLimit] = useState(DEFAULT_POINTS_RULE.hasDeductLimit);
  const [maxDeductPoints, setMaxDeductPoints] = useState(String(DEFAULT_POINTS_RULE.maxDeductPoints));

  const [specifyProduct, setSpecifyProduct] = useState(DEFAULT_POINTS_RULE.specifyProduct);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 规则摘要随表单实时联动
  const ruleSummary = useMemo(
    () =>
      describePointsRule({
        ruleType,
        spendAmount: Number(spendAmount) || 0,
        amountPoints: Number(amountPoints) || 0,
        orderPoints: Number(orderPoints) || 0,
        validityType,
        validityDays: Number(validityDays) || 0,
        deductPoints: Number(deductPoints) || 0,
        hasDeductLimit,
        maxDeductPoints: Number(maxDeductPoints) || 0,
        specifyProduct,
      }),
    [ruleType, spendAmount, amountPoints, orderPoints, validityType, validityDays, deductPoints, hasDeductLimit, maxDeductPoints, specifyProduct],
  );

  const handleReset = () => {
    setRuleType(DEFAULT_POINTS_RULE.ruleType);
    setSpendAmount(String(DEFAULT_POINTS_RULE.spendAmount));
    setAmountPoints(String(DEFAULT_POINTS_RULE.amountPoints));
    setOrderPoints(String(DEFAULT_POINTS_RULE.orderPoints));
    setValidityType(DEFAULT_POINTS_RULE.validityType);
    setValidityDays(String(DEFAULT_POINTS_RULE.validityDays));
    setDeductPoints(String(DEFAULT_POINTS_RULE.deductPoints));
    setHasDeductLimit(DEFAULT_POINTS_RULE.hasDeductLimit);
    setMaxDeductPoints(String(DEFAULT_POINTS_RULE.maxDeductPoints));
    setSpecifyProduct(DEFAULT_POINTS_RULE.specifyProduct);
    setSavedSuccess(false);
    onNotice('已恢复长者敬老健康积分规则默认值');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onNotice('已成功保存长者敬老健康积分规则并实时同步生效');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto text-xs">
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2.5 pb-5 border-b border-gray-100">
          <span className="w-1 h-4 bg-[#10b981] rounded-full"></span>
          <h1 className="text-sm font-semibold text-gray-800">积分规则</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {/* 获取规则 */}
          <div className="flex items-start">
            <label className="w-24 pt-2 text-gray-600">获取规则</label>
            <div className="flex-1 space-y-3">
              {/* 每消费 N 元 获取 N 分 */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pointsRule"
                    checked={ruleType === 'amount'}
                    onChange={() => setRuleType('amount')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">每消费</span>
                </label>
                <input
                  type="number"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  disabled={ruleType !== 'amount'}
                  className="w-28 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono disabled:bg-gray-50 focus:outline-none focus:border-[#10b981]"
                />
                <span className="text-gray-600">元 获取</span>
                <input
                  type="number"
                  value={amountPoints}
                  onChange={(e) => setAmountPoints(e.target.value)}
                  disabled={ruleType !== 'amount'}
                  className="w-28 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono disabled:bg-gray-50 focus:outline-none focus:border-[#10b981]"
                />
                <span className="text-gray-600">分</span>
              </div>

              {/* 每消费 1 笔 获取 N 分 */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pointsRule"
                    checked={ruleType === 'order'}
                    onChange={() => setRuleType('order')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">每消费</span>
                </label>
                <span className="text-gray-600">笔 获取</span>
                <input
                  type="number"
                  value={orderPoints}
                  onChange={(e) => setOrderPoints(e.target.value)}
                  disabled={ruleType !== 'order'}
                  className="w-28 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono disabled:bg-gray-50 focus:outline-none focus:border-[#10b981]"
                />
                <span className="text-gray-600">分</span>
              </div>
            </div>
          </div>

          {/* 积分有效期 */}
          <div className="flex items-start">
            <label className="w-24 pt-1.5 text-gray-600">积分有效期</label>
            <div className="flex-1 space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="pointsValidity"
                  checked={validityType === 'permanent'}
                  onChange={() => setValidityType('permanent')}
                  className="text-[#10b981] accent-[#10b981]"
                />
                <span className="text-gray-700">永久有效</span>
              </label>

              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pointsValidity"
                    checked={validityType === 'days'}
                    onChange={() => setValidityType('days')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">获取后</span>
                </label>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                  disabled={validityType !== 'days'}
                  className="w-24 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono disabled:bg-gray-50 focus:outline-none focus:border-[#10b981]"
                />
                <span className="text-gray-600">天 内有效</span>
              </div>
            </div>
          </div>

          {/* 抵扣比例 */}
          <div className="flex items-center">
            <label className="w-24 text-gray-600">抵扣比例</label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">获取</span>
              <input
                type="number"
                value={deductPoints}
                onChange={(e) => setDeductPoints(e.target.value)}
                className="w-28 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono focus:outline-none focus:border-[#10b981]"
              />
              <span className="text-gray-600">分 可抵扣1元</span>
            </div>
          </div>

          {/* 抵扣限制 */}
          <div className="flex items-center">
            <label className="w-24 text-gray-600">抵扣限制</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasDeductLimit}
                onChange={(e) => setHasDeductLimit(e.target.checked)}
                className="rounded text-[#10b981] accent-[#10b981]"
              />
              <span className="text-gray-600">最多抵扣</span>
              <input
                type="number"
                value={maxDeductPoints}
                onChange={(e) => setMaxDeductPoints(e.target.value)}
                disabled={!hasDeductLimit}
                className="w-28 px-3 py-1.5 border border-gray-200 rounded-md text-gray-800 text-xs font-mono disabled:bg-gray-50 focus:outline-none focus:border-[#10b981]"
              />
              <span className="text-gray-600">分</span>
            </div>
          </div>

          {/* 指定商品可用 */}
          <div className="flex items-center">
            <label className="w-24 text-gray-600">指定商品可用</label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={specifyProduct}
                onChange={(e) => setSpecifyProduct(e.target.checked)}
                className="rounded text-[#10b981] accent-[#10b981]"
              />
              <button
                type="button"
                onClick={() => {
                  setSpecifyProduct(true);
                  onNotice('已载入康养生活、适老洗护及慢病体检积分抵扣专区商品');
                }}
                className="text-[#10b981] hover:underline"
              >
                +选择商品
              </button>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="pt-6 border-t border-gray-100 flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-2 bg-[#10b981] text-white rounded-md hover:bg-[#059669] font-medium transition-colors"
            >
              保存
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 font-medium transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>
            {savedSuccess && (
              <span className="flex items-center text-emerald-600 space-x-1 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>规则已成功保存</span>
              </span>
            )}
          </div>
        </form>

        {/* 规则摘要：随表单实时联动 */}
        <div className="max-w-3xl bg-emerald-50/60 border border-emerald-100 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-gray-800 font-medium">
            <ShoppingBag className="w-4 h-4 text-[#10b981]" />
            <span>规则摘要</span>
          </div>
          {ruleSummary.map((line) => (
            <p key={line} className="flex items-center space-x-2 text-gray-600">
              <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span>{line}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
