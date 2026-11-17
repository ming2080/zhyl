import React, { useState } from 'react';
import { ArrowUpDown, Download, TrendingUp } from 'lucide-react';
import {
  DAILY_REPORT_RANGE_OPTIONS,
  dailyOperationReports,
  filterDailyReportsByRange,
  formatPercent,
  getDailyReportRangeLabel,
  summarizeDailyReports,
  type DailyReportRange,
} from '../data/analyticsReports';

interface AnalyticsReportsProps {
  onNotice: (msg: string) => void;
  subPage: 'operation_stats' | 'elderly_portrait';
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  onNotice,
  subPage,
}) => {
  const [range, setRange] = useState<DailyReportRange>('all');
  const filteredReports = filterDailyReportsByRange(dailyOperationReports, range);
  const summary = summarizeDailyReports(filteredReports);
  const maxDate = filteredReports[0]?.date ?? '';
  const minDate = filteredReports[filteredReports.length - 1]?.date ?? '';
  const periodLabel = filteredReports.length > 0 ? `${minDate} 至 ${maxDate}` : '暂无数据';
  const rangeLabel = getDailyReportRangeLabel(range);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      {/* Top 4 KPI Metrics：由当前时间范围内的日报汇总得出 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="text-xs text-gray-400 mb-1">区间履约完成工单</div>
          <div className="text-2xl font-bold text-gray-800 font-mono">{summary.totalCompletedOrders.toLocaleString()} 单</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>区间新增服务工单 {summary.totalNewOrders} 单</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="text-xs text-gray-400 mb-1">区间工单履约率</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{formatPercent(summary.completionRate)}</div>
          <div className="text-[11px] text-gray-400 mt-1">完成数 / 新增数按区间日报汇总</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="text-xs text-gray-400 mb-1">区间安防告警触发</div>
          <div className={`text-2xl font-bold font-mono ${summary.totalAlarms > 0 ? 'text-rose-600' : 'text-gray-800'}`}>
            {summary.totalAlarms} 次
          </div>
          <div className="text-[11px] text-gray-400 mt-1">区间健康体征随访 {summary.totalHealthAssessments} 人次</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="text-xs text-gray-400 mb-1">区间平均服务好评率</div>
          <div className="text-2xl font-bold text-amber-500 font-mono">{formatPercent(summary.avgSatisfaction)}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            基于区间 {summary.dayCount} 天日报数据 · 平均在岗 {summary.avgActiveStaff.toFixed(1)} 人
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[580px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span>
            <h1 className="text-base font-semibold text-gray-800 tracking-tight">
              {subPage === 'elderly_portrait' ? '长者健康画像与慢病分布分析' : '报表统计 - 2026年9月运营日报表'}
            </h1>
            <span className="text-xs text-gray-400">统计周期：{periodLabel}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
              {DAILY_REPORT_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRange(option.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    range === option.value
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {filteredReports.length > 0 && (
              <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200">
                <ArrowUpDown className="w-3 h-3" />
                <span>按统计日期降序 ({maxDate} 至 {minDate})</span>
              </div>
            )}
            <button
              onClick={() => onNotice(`已导出${rangeLabel}运营统计分析报表`)}
              className="px-3.5 py-1.5 text-xs bg-[#10b981] hover:bg-[#059669] text-white rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出统计报表</span>
            </button>
          </div>
        </div>

        {/* Daily Summary Table */}
        <div className="mt-4 overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                <th className="py-3 px-3.5 text-left font-semibold w-36">
                  <div className="flex items-center space-x-1">
                    <span>报表日期</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-600" />
                  </div>
                </th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">新增服务工单</th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">履约完成数</th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">在岗服务护工</th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">安防告警触发</th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">健康体征随访</th>
                <th className="py-3 px-3.5 text-center font-semibold w-28">当日服务好评率</th>
                <th className="py-3 px-3.5 text-right font-semibold">运营评价与复核</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReports.map((row) => (
                <tr key={row.date} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-gray-800">
                      <span>{row.date}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-center font-bold text-gray-800">
                    {row.newOrders}
                  </td>

                  <td className="py-3 px-3.5 text-center font-medium text-emerald-600">
                    {row.completedOrders}
                  </td>

                  <td className="py-3 px-3.5 text-center text-gray-700">
                    {row.activeStaff} 人
                  </td>

                  <td className="py-3 px-3.5 text-center">
                    <span className={row.alarmCount > 0 ? 'text-rose-600 font-bold' : 'text-gray-400'}>
                      {row.alarmCount} 次
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-center text-gray-700">
                    {row.healthAssessments} 人次
                  </td>

                  <td className="py-3 px-3.5 text-center font-semibold text-emerald-700">
                    {formatPercent(row.satisfaction)}
                  </td>

                  <td className="py-3 px-3.5 text-right text-gray-500">
                    正常平稳运行 · 已归档
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    该时间范围内暂无运营日报数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
