export const WORKSPACE_CONSTANTS = {
  VALIDATION: {
    MAX_NAME_LENGTH: 100,
    MAX_SLUG_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  LIMITS: {
    MAX_FREE_WORKSPACES: 5,
  },
  SORTING: {
    DEFAULT_SORT: 'createdAt',
    DEFAULT_ORDER: 'desc',
    ALLOWED_SORT_FIELDS: ['createdAt', 'updatedAt', 'name', 'status'],
  },
  CODE: {
    SEQUENCE_NAME: 'workspace_code_seq',
    PREFIX: 'WS',
    PADDING: 6,
  },
};
