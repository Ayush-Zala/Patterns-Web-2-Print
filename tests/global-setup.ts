export default async function globalSetup() {
  console.log('\n[Jest Global Setup] Setting up test environment...');
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/patterns_test?schema=public';
}
