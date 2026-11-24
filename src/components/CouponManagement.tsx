import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  ChevronDown,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Download,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { CouponItem, CouponDailyStat } from '../types';
import {
  INITIAL_COUPONS,
  INITIAL_COUPON_STATS,
  COUPON_STATS_TOTALS,
} from '../data/couponData';

interface CouponManagementProps {
  onNotice: (msg: string) => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({ onNotice }) => {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'stats'>('list');
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // List filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Form State (Matches Screenshot 2 & 3: 新增优惠券)
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCount, setFormCount] = useState('');
  const [thresholdType, setThresholdType] = useState<'threshold' | 'no-threshold'>('threshold');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [limitType, setLimitType] = useState<'limited' | 'unlimited'>('limited');
  const [maxPerUser, setMaxPerUser] = useState('1');
  const [validityType, setValidityType] = useState<'permanent' | 'fixed' | 'days'>('permanent');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [startHour, setStartHour] = useState('12');
  const [startMinute, setStartMinute] = useState('00');
  const [endDate, setEndDate] = useState('2026-09-19');
  const [endHour, setEndHour] = useState('12');
  const [endMinute, setEndMinute] = useState('00');
  const [validDays, setValidDays] = useState('7');
  const [specifyProduct, setSpecifyProduct] = useState(false);
  const [specifyCustomer, setSpecifyCustomer] = useState(false);
  const [couponType, setCouponType] = useState<'公开券' | '私有券'>('公开券');
  const [remarks, setRemarks] = useState('');

  // Stats view date filter
  const [statsDateRange, setStatsDateRange] = useState('2026-09-01 ~ 2026-09-19');
  const [statsData, setStatsData] = useState<CouponDailyStat[]>(INITIAL_COUPON_STATS);

  // Filtered & sorted coupons (strictly descending by publishTime)
  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((c) => {
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const q = keyword.trim().toLowerCase();
        const matchesKeyword =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          c.scope.toLowerCase().includes(q) ||
          c.targetUser.toLowerCase().includes(q);

        return matchesStatus && matchesKeyword;
      })
      .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
  }, [coupons, statusFilter, keyword]);

  const totalPages = Math.ceil(filteredCoupons.length / pageSize) || 1;
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCoupons.slice(start, start + pageSize);
  }, [filteredCoupons, currentPage]);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormName('');
    setFormAmount('');
    setFormCount('');
    setThresholdType('threshold');
    setThresholdAmount('200');
    setLimitType('limited');
    setMaxPerUser('1');
    setValidityType('permanent');
    setStartDate('2026-09-18');
    setStartHour('12');
    setStartMinute('00');
    setEndDate('2026-09-19');
    setEndHour('12');
    setEndMinute('00');
    setValidDays('7');
    setSpecifyProduct(false);
    setSpecifyCustomer(false);
    setCouponType('公开券');
    setRemarks('');
    setViewMode('create');
  };

  const handleOpenEdit = (c: CouponItem) => {
    setEditingCoupon(c);
    setFormName(c.name);
    setFormAmount(String(c.discountAmount));
    setFormCount(String(c.totalCount));
    if (c.minSpend > 0) {
      setThresholdType('threshold');
      setThresholdAmount(String(c.minSpend));
    } else {
      setThresholdType('no-threshold');
      setThresholdAmount('');
    }
    setLimitType('limited');
    setMaxPerUser('1');
    setValidityType('permanent');
    setCouponType(c.couponType);
    setRemarks(c.remarks || '');
    setViewMode('create');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onNotice('请输入优惠券名称');
      return;
    }
    const amountVal = parseFloat(formAmount) || 20;
    const minSpendVal = thresholdType === 'threshold' ? parseFloat(thresholdAmount) || 200 : 0;
    const contentStr =
      minSpendVal > 0 ? `¥${amountVal} 满${minSpendVal}元可用` : `¥${amountVal} 无门槛`;

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((item) =>
          item.id === editingCoupon.id
            ? {
                ...item,
                name: formName.trim(),
                discountAmount: amountVal,
                minSpend: minSpendVal,
                content: contentStr,
                totalCount: parseInt(formCount, 10) || item.totalCount,
                couponType,
                remarks: remarks.trim(),
              }
            : item
        )
      );
      onNotice(`已更新优惠券【${formName.trim()}】`);
    } else {
      const newCoupon: CouponItem = {
        id: `cp-${Date.now()}`,
        name: formName.trim(),
        status: '可领用',
        content: contentStr,
        discountAmount: amountVal,
        minSpend: minSpendVal,
        scope: specifyProduct ? '指定适老服务/设备' : '全部商品',
        targetUser: specifyCustomer ? '指定敬老用户群' : '全部客户',
        claimedCount: 0,
        totalCount: parseInt(formCount, 10) || 200,
        publishTime: '2026-09-19 16:00:00',
        couponType,
        remarks: remarks.trim(),
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      onNotice(`已成功发布优惠券【${newCoupon.name}】`);
    }

    setViewMode('list');
  };

  const handleDelete = (c: CouponItem) => {
    setCoupons((prev) => prev.filter((item) => item.id !== c.id));
    setSelectedIds((prev) => prev.filter((id) => id !== c.id));
    onNotice(`已删除优惠券【${c.name}】`);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedCoupons.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchOperation = () => {
    if (selectedIds.length === 0) {
      onNotice('请先选择需要批量操作的优惠券');
      return;
    }
    onNotice(`已对选中的 ${selectedIds.length} 张优惠券执行批量上架/停发操作`);
  };

  // -----------------------------------------------------------------
  // VIEW: STATS (Matches Screenshot 4: 优惠券数据)
  // -----------------------------------------------------------------
  if (viewMode === 'stats') {
    return (
      <div className="p-6 max-w-[1600px] mx-auto text-xs space-y-5">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span>
              <h1 className="text-sm font-semibold text-gray-800">优惠券数据</h1>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回列表</span>
            </button>
          </div>

          {/* Metric Cards (5 cards in a row matching Screenshot 4) */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs">领取总数量</p>
              <p className="text-2xl font-bold text-gray-800 font-mono mt-1">{COUPON_STATS_TOTALS.totalClaimed}</p>
            </div>
            <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs">领取人数</p>
              <p className="text-2xl font-bold text-gray-800 font-mono mt-1">{COUPON_STATS_TOTALS.claimedUsers}</p>
            </div>
            <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs">使用总数量</p>
              <p className="text-2xl font-bold text-gray-800 font-mono mt-1">{COUPON_STATS_TOTALS.totalUsed}</p>
            </div>
            <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs">使用人数</p>
              <p className="text-2xl font-bold text-gray-800 font-mono mt-1">{COUPON_STATS_TOTALS.usedUsers}</p>
            </div>
            <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs">优惠金额 (元)</p>
              <p className="text-2xl font-bold text-gray-800 font-mono mt-1">{COUPON_STATS_TOTALS.totalDiscount}</p>
            </div>
          </div>

          {/* Date Filter & Export Button */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">选择日期</span>
              <div className="flex items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white space-x-2">
                <input
                  type="text"
                  value="2026-09-01"
                  readOnly
                  className="w-20 text-center text-xs text-gray-700 focus:outline-none"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="text"
                  value="2026-09-19"
                  readOnly
                  className="w-20 text-center text-xs text-gray-700 focus:outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNotice('已成功导出2026年9月优惠券核销数据报表')}
              className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>

          {/* Stats Table (Descending from 2026-09-19 down to 2026-09-01) */}
          <div className="overflow-x-auto border-t border-gray-100 pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-normal">
                  <th className="py-3 px-4 w-12 text-center">
                    <input type="checkbox" className="rounded text-[#10b981] accent-[#10b981]" />
                  </th>
                  <th className="py-3 px-4 font-normal text-gray-600">日期</th>
                  <th className="py-3 px-4 font-normal text-gray-600">可领取数量</th>
                  <th className="py-3 px-4 font-normal text-gray-600">领取数量</th>
                  <th className="py-3 px-4 font-normal text-gray-600">领取人数</th>
                  <th className="py-3 px-4 font-normal text-gray-600">使用数量</th>
                  <th className="py-3 px-4 font-normal text-gray-600">使用人数</th>
                  <th className="py-3 px-4 font-normal text-gray-600 font-mono">优惠金额 (元)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {statsData.map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded text-[#10b981] accent-[#10b981]" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">{stat.date}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{stat.availableCount}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{stat.claimedCount}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{stat.claimedUsers}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{stat.usedCount}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{stat.usedUsers}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">{stat.discountAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // VIEW: CREATE / EDIT (Matches Screenshots 2 & 3: 新增优惠券)
  // -----------------------------------------------------------------
  if (viewMode === 'create') {
    return (
      <div className="p-6 max-w-[1600px] mx-auto text-xs">
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center space-x-2.5 pb-5 border-b border-gray-100">
            <span className="w-1 h-4 bg-[#10b981] rounded-full"></span>
            <h1 className="text-sm font-semibold text-gray-800">
              {editingCoupon ? '编辑优惠券' : '新增优惠券'}
            </h1>
          </div>

          <form onSubmit={handleSaveCoupon} className="space-y-6 max-w-3xl">
            {/* 优惠券名称 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">
                <span className="text-red-500 mr-0.5">*</span>优惠券名称
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入"
                  className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* 优惠券金额 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">
                <span className="text-red-500 mr-0.5">*</span>优惠券金额
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-36 px-3 py-2 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs font-mono"
                />
                <span className="text-gray-500">元</span>
              </div>
            </div>

            {/* 数量 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">
                <span className="text-red-500 mr-0.5">*</span>数量
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={formCount}
                  onChange={(e) => setFormCount(e.target.value)}
                  className="w-36 px-3 py-2 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs font-mono"
                />
                <span className="text-gray-500">张</span>
              </div>
            </div>

            {/* 优惠券门槛 */}
            <div className="flex items-start">
              <label className="w-28 pt-1.5 text-gray-600">优惠券门槛</label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="threshold"
                      checked={thresholdType === 'threshold'}
                      onChange={() => setThresholdType('threshold')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">有门槛 订单满</span>
                  </label>
                  <input
                    type="number"
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    disabled={thresholdType !== 'threshold'}
                    className="w-28 px-2.5 py-1.5 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs font-mono disabled:bg-gray-50"
                  />
                  <span className="text-gray-600">元 可用</span>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="threshold"
                      checked={thresholdType === 'no-threshold'}
                      onChange={() => setThresholdType('no-threshold')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">无门槛</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 每人最多领取数量限制 */}
            <div className="flex items-start">
              <label className="w-28 pt-1.5 text-gray-600 leading-snug">
                每人最多领取数量限制
              </label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="limit"
                      checked={limitType === 'limited'}
                      onChange={() => setLimitType('limited')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">有限制 最多领取</span>
                  </label>
                  <input
                    type="number"
                    value={maxPerUser}
                    onChange={(e) => setMaxPerUser(e.target.value)}
                    disabled={limitType !== 'limited'}
                    className="w-24 px-2.5 py-1.5 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs font-mono disabled:bg-gray-50"
                  />
                  <span className="text-gray-600">张</span>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="limit"
                      checked={limitType === 'unlimited'}
                      onChange={() => setLimitType('unlimited')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">无限制</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 有效期 */}
            <div className="flex items-start">
              <label className="w-28 pt-1.5 text-gray-600">有效期</label>
              <div className="flex-1 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="validity"
                    checked={validityType === 'permanent'}
                    onChange={() => setValidityType('permanent')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">永久有效</span>
                </label>

                {/* 固定期限 */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="validity"
                      checked={validityType === 'fixed'}
                      onChange={() => setValidityType('fixed')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">固定期限</span>
                  </label>

                  {validityType === 'fixed' && (
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-200 rounded-md px-2.5 py-1.5 bg-white space-x-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-gray-700 focus:outline-none text-xs"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-md px-2.5 py-1.5 bg-white space-x-1">
                          <input
                            type="text"
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                            className="w-6 text-center text-xs"
                          />
                          <span>:</span>
                          <input
                            type="text"
                            value={startMinute}
                            onChange={(e) => setStartMinute(e.target.value)}
                            className="w-6 text-center text-xs"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </div>
                        <span className="text-gray-500">至</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-200 rounded-md px-2.5 py-1.5 bg-white space-x-2">
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-gray-700 focus:outline-none text-xs"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-md px-2.5 py-1.5 bg-white space-x-1">
                          <input
                            type="text"
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                            className="w-6 text-center text-xs"
                          />
                          <span>:</span>
                          <input
                            type="text"
                            value={endMinute}
                            onChange={(e) => setEndMinute(e.target.value)}
                            className="w-6 text-center text-xs"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 领取后 N 天内有效 */}
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="validity"
                      checked={validityType === 'days'}
                      onChange={() => setValidityType('days')}
                      className="text-[#10b981] accent-[#10b981]"
                    />
                    <span className="text-gray-700">领取后</span>
                  </label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                    disabled={validityType !== 'days'}
                    className="w-20 px-2 py-1 border border-gray-200 rounded-md text-gray-800 text-xs text-center font-mono disabled:bg-gray-50"
                  />
                  <span className="text-gray-600">天 内有效</span>
                </div>
              </div>
            </div>

            {/* 指定商品可用 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">指定商品可用</label>
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
                    onNotice('已展开适老关怀商品及居家照护服务目录');
                  }}
                  className="text-[#10b981] hover:underline"
                >
                  +选择商品
                </button>
              </div>
            </div>

            {/* 指定客户可用 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">指定客户可用</label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={specifyCustomer}
                  onChange={(e) => setSpecifyCustomer(e.target.checked)}
                  className="rounded text-[#10b981] accent-[#10b981]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSpecifyCustomer(true);
                    onNotice('已展开长者标签与慢病风险人群选择器');
                  }}
                  className="text-[#10b981] hover:underline"
                >
                  +选择客户
                </button>
              </div>
            </div>

            {/* 优惠券类型 */}
            <div className="flex items-center">
              <label className="w-28 text-gray-600">优惠券类型</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="couponType"
                    checked={couponType === '公开券'}
                    onChange={() => setCouponType('公开券')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">公开券</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="couponType"
                    checked={couponType === '私有券'}
                    onChange={() => setCouponType('私有券')}
                    className="text-[#10b981] accent-[#10b981]"
                  />
                  <span className="text-gray-700">私有券</span>
                </label>
              </div>
            </div>

            {/* 备注 (Image 3) */}
            <div className="flex items-start">
              <label className="w-28 pt-2 text-gray-600">备注</label>
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="请输入"
                  className="w-full max-w-xl p-3 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#10b981] text-xs placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[#10b981] text-white rounded-md hover:bg-[#059669] font-medium transition-colors"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
              >
                返回
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // VIEW: LIST (Matches Screenshot 1: 优惠券管理)
  // -----------------------------------------------------------------
  return (
    <div className="p-6 max-w-[1600px] mx-auto text-xs space-y-4">
      {/* Top Filter Card */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center space-x-2 pb-2">
          <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span>
          <h1 className="text-sm font-semibold text-gray-800">优惠券管理</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 whitespace-nowrap">状态</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-700 focus:outline-none focus:border-[#10b981]"
              >
                <option value="all">请选择</option>
                <option value="可领用">可领用</option>
                <option value="已领完">已领完</option>
                <option value="已下架">已下架</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center flex-1 max-w-sm">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="请输入关键字"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#10b981] placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() => onNotice(`已检索到 ${filteredCoupons.length} 张优惠券`)}
            className="w-8 h-8 rounded-md bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center transition-colors"
            title="搜索"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setKeyword('');
              setCurrentPage(1);
              onNotice('已重置优惠券筛选条件');
            }}
            className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        {/* Action buttons: 新增 / 批量操作 */}
        <div className="flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-md font-medium transition-colors"
          >
            新增
          </button>
          <button
            type="button"
            onClick={handleBatchOperation}
            className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors"
          >
            批量操作
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-normal">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedCoupons.length > 0 &&
                      paginatedCoupons.every((c) => selectedIds.includes(c.id))
                    }
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="rounded text-[#10b981] accent-[#10b981]"
                  />
                </th>
                <th className="py-3 px-4 font-normal text-gray-600">优惠券名称</th>
                <th className="py-3 px-4 font-normal text-gray-600">状态</th>
                <th className="py-3 px-4 font-normal text-gray-600">内容</th>
                <th className="py-3 px-4 font-normal text-gray-600">适用范围</th>
                <th className="py-3 px-4 font-normal text-gray-600">适用客户</th>
                <th className="py-3 px-4 font-normal text-gray-600 font-mono">
                  领取数量/总数量
                </th>
                <th className="py-3 px-4 font-normal text-gray-600 font-mono">发布时间</th>
                <th className="py-3 px-4 font-normal text-gray-600 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedCoupons.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      isSelected ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(c.id)}
                        className="rounded text-[#10b981] accent-[#10b981]"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">{c.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center text-[#10b981] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#10b981]"></span>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-mono">{c.content}</td>
                    <td className="py-3.5 px-4 text-gray-600">{c.scope}</td>
                    <td className="py-3.5 px-4 text-gray-600">{c.targetUser}</td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono">
                      {c.claimedCount}/{c.totalCount}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono">{c.publishTime}</td>
                    <td className="py-3.5 px-4 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => setViewMode('stats')}
                        className="text-[#10b981] hover:underline"
                      >
                        数据
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="text-[#10b981] hover:underline"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="text-red-500 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedCoupons.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
                    暂无匹配的优惠券记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div>
            共 <span className="font-semibold text-gray-800">{filteredCoupons.length}</span> 条
          </div>
          <div className="flex items-center space-x-2">
            <span>每页 10 条</span>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                  currentPage === page
                    ? 'bg-[#10b981] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
