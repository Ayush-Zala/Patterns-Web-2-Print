import { ReactNode, ComponentType } from 'react';

export interface DashboardWidget {
  id: string;
  title: string;
  component: ComponentType<any>;
  order: number;
  width: 'full' | 'half' | 'third';
}

class DashboardRegistry {
  private widgets: DashboardWidget[] = [];

  registerWidget(widget: DashboardWidget) {
    this.widgets.push(widget);
    this.widgets.sort((a, b) => a.order - b.order);
  }

  getWidgets(): DashboardWidget[] {
    return this.widgets;
  }
}

export const dashboardRegistry = new DashboardRegistry();
