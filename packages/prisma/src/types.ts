export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  skip?: number;
  take?: number;
  cursor?: string;
}
