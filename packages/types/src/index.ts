// -----------------------------------------------------------------------------
// Core Utility Types
// -----------------------------------------------------------------------------

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type UUID = string;
export type Timestamp = string | Date;
export type Dictionary<T> = Record<string, T>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// -----------------------------------------------------------------------------
// API Result Types
// -----------------------------------------------------------------------------

export interface ApiResult<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}
