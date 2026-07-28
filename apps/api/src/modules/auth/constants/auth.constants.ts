export const AUTH_CONSTANTS = {
  COOKIE_NAMES: {
    REFRESH_TOKEN: 'patterns_refresh',
  },
  HEADERS: {
    AUTHORIZATION: 'Authorization',
  },
  RATE_LIMITS: {
    LOGIN: { points: 5, duration: 15 * 60 },
    REFRESH: { points: 30, duration: 60 },
    LOGOUT: { points: 60, duration: 60 },
  },
};
