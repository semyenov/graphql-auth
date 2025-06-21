// Generate a single test database URL for the entire test suite run
// This ensures all tests use the same database instance

// Use a fixed identifier for the test run
// The vitest config ensures tests run sequentially with singleThread: true
export const TEST_DATABASE_URL = 'file:./test-db.db'
