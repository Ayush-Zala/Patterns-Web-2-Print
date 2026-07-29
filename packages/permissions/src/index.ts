export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource =
  'workspace' | 'user' | 'product' | 'order' | 'template' | 'asset' | 'all';

export interface Scope {
  resource: PermissionResource;
  action: PermissionAction;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scopes: Scope[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
