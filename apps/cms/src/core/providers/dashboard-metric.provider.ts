export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: any;
  order: number;
}

export interface DashboardMetricProvider {
  name: string;
  getMetrics(workspaceId: string): Promise<DashboardMetric[]>;
}

class DashboardMetricRegistry {
  private providers: DashboardMetricProvider[] = [];

  registerProvider(provider: DashboardMetricProvider) {
    this.providers.push(provider);
  }

  getProviders(): DashboardMetricProvider[] {
    return this.providers;
  }
}

export const dashboardMetricRegistry = new DashboardMetricRegistry();
