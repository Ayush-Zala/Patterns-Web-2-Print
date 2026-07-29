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

export const EVENT_NAMES = {
  WORKSPACE_UPDATED: 'workspace.updated',
  INTEGRATION_CONNECTED: 'integration.connected',
  INTEGRATION_DISCONNECTED: 'integration.disconnected',
  INTEGRATION_SECRET_ROTATED: 'integration.secret_rotated',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_PUBLISHED: 'product.published',
  PRODUCT_UNPUBLISHED: 'product.unpublished',
  ASSET_CREATED: 'asset.created',
  ASSET_UPDATED: 'asset.updated',
  ASSET_DELETED: 'asset.deleted',
  TEMPLATE_CREATED: 'template.created',
  TEMPLATE_UPDATED: 'template.updated',
  TEMPLATE_DELETED: 'template.deleted',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

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
