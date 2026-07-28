import { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: ReactNode;
  description?: string;
  badge?: string;
  order: number;
}

export interface NavigationGroup {
  id: string;
  label: string;
  order: number;
  items: NavigationItem[];
}

class NavigationRegistry {
  private groups: Map<string, NavigationGroup> = new Map();

  registerGroup(group: NavigationGroup) {
    if (this.groups.has(group.id)) {
      const existing = this.groups.get(group.id)!;
      existing.items.push(...group.items);
      // Re-sort items
      existing.items.sort((a, b) => a.order - b.order);
    } else {
      this.groups.set(group.id, {
        ...group,
        items: [...group.items].sort((a, b) => a.order - b.order),
      });
    }
  }

  getGroups(): NavigationGroup[] {
    return Array.from(this.groups.values()).sort((a, b) => a.order - b.order);
  }
}

export const navigationRegistry = new NavigationRegistry();
