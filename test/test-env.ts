// Use unique SQLite database file for each test run to avoid lock issues
const testDbUrl = `file:./test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.db`

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.APP_SECRET = 'test-secret-key-for-testing-purposes'
process.env.DATABASE_URL = testDbUrl
process.env.LOG_LEVEL = 'error' // Reduce noise in tests

export const TEST_DATABASE_URL = testDbUrl