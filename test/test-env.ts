// Import reflect-metadata before anything else
import 'reflect-metadata'
import { TEST_DATABASE_URL as testDbUrl } from './test-database-url'

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.APP_SECRET = 'test-secret-key-for-testing-purposes'
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes' // Clean architecture expects JWT_SECRET
process.env.DATABASE_URL = testDbUrl
process.env.LOG_LEVEL = 'error' // Reduce noise in tests

export const TEST_DATABASE_URL = testDbUrl
