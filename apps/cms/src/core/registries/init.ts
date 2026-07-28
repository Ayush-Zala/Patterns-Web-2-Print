import { navigationRegistry } from './navigation.registry';

export function initializeNavigation() {
  if (navigationRegistry.getGroups().length > 0) return; // Prevent double init in dev

  navigationRegistry.registerGroup({
    id: 'general',
    label: 'Overview',
    order: 1,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dashboard',
        order: 1,
      },
    ],
  });

  navigationRegistry.registerGroup({
    id: 'commerce',
    label: 'Commerce',
    order: 2,
    items: [
      {
        id: 'products',
        label: 'Products',
        route: '/products',
        order: 1,
      },
    ],
  });

  navigationRegistry.registerGroup({
    id: 'settings',
    label: 'Administration',
    order: 3,
    items: [
      {
        id: 'workspaces',
        label: 'Workspaces',
        route: '/workspaces',
        order: 1,
      },
      {
        id: 'users',
        label: 'Users',
        route: '/users',
        order: 2,
      },
      {
        id: 'settings',
        label: 'Settings',
        route: '/settings',
        order: 3,
      },
    ],
  });
}
