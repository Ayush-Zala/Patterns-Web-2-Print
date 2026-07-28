import { FC, ReactNode } from 'react';
import { dashboardRegistry } from '../../core/registries/dashboard.registry';

interface DashboardGridProps {
  stats: ReactNode;
}

export const DashboardGrid: FC<DashboardGridProps> = ({ stats }) => {
  const widgets = dashboardRegistry.getWidgets();

  return (
    <div className="space-y-6">
      {/* Stats row */}
      {stats && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats}</div>}

      {/* Widgets grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => {
          const WidgetComponent = widget.component;

          let colSpan = 'col-span-1';
          if (widget.width === 'full') colSpan = 'col-span-1 md:col-span-2 lg:col-span-3';
          else if (widget.width === 'half') colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';

          return (
            <div key={widget.id} className={colSpan}>
              <WidgetComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
};
