export default () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '4000', 10),
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },
});
