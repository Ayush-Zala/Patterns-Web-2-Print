import { FC } from 'react';
import { DashboardMetric } from '../../core/providers/dashboard-metric.provider';

interface StatWidgetProps {
  metric: DashboardMetric;
}

export const StatWidget: FC<StatWidgetProps> = ({ metric }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-sm font-medium text-neutral-400">{metric.label}</p>
        {metric.icon && (
          <div className="rounded-lg bg-neutral-800/50 p-2 text-neutral-400">{metric.icon}</div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-bold tracking-tight text-white">{metric.value}</h4>
        {metric.trend && (
          <span
            className={`text-sm font-medium ${metric.trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
          >
            {metric.trend.isPositive ? '+' : ''}
            {metric.trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};
