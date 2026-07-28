export interface Session {
  id: string;
  status: string;
  activeWorkspaceId?: string | null;
}

export interface AnonymousContext {
  type: 'anonymous';
}

export interface AuthenticatedContext {
  type: 'authenticated';
  user: any;
  session: any;
}

export interface WorkspaceContext {
  type: 'workspace';
  user: any; // Replace with User type
  session: any; // Replace with Session type
  workspace: any; // Replace with Workspace type
  channel?: any;
  integration?: any;
  locale?: string;
  timezone?: string;
}

export type RequestContext = AnonymousContext | AuthenticatedContext | WorkspaceContext;
