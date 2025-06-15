// Use file-based SQLite database for testing
const testDbUrl = 'file:./test.db'

// Force override DATABASE_URL
process.env.DATABASE_URL = testDbUrl

export const TEST_DATABASE_URL = testDbUrl