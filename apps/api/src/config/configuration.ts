export default () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '4000', 10),
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },
  auth: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
    passwordPepper: process.env.PASSWORD_PEPPER,
    cookieDomain: process.env.COOKIE_DOMAIN,
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    cookieSameSite: process.env.COOKIE_SAME_SITE,
    cookiePath: process.env.COOKIE_PATH,
  },
});
