export const USER_CONSTANTS = {
  VALIDATION: {
    MAX_NAME_LENGTH: 50,
    MAX_PHONE_LENGTH: 20,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  SORTING: {
    DEFAULT_SORT: 'createdAt',
    DEFAULT_ORDER: 'desc',
    ALLOWED_SORT_FIELDS: ['createdAt', 'updatedAt', 'email', 'firstName', 'lastName', 'status'],
  },
};
