export interface EventMetadata {
  timestamp: string;
  source: string;
  correlationId?: string;
  userId?: string;
  workspaceId?: string;
}

export interface DomainEvent<T = unknown> {
  id: string;
  type: string;
  payload: T;
  meta: EventMetadata;
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}

// -----------------------------------------------------------------------------
// Workspace Events
// -----------------------------------------------------------------------------

export interface WorkspaceCreatedPayload {
  workspaceId: string;
  name: string;
  slug: string;
  plan: string;
  ownerUserId?: string;
}

export type WorkspaceCreatedEvent = DomainEvent<WorkspaceCreatedPayload>;

export interface WorkspaceUpdatedPayload {
  workspaceId: string;
  name?: string;
  logoUrl?: string;
  settings?: Record<string, unknown>;
}

export type WorkspaceUpdatedEvent = DomainEvent<WorkspaceUpdatedPayload>;
