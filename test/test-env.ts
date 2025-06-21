// Import reflect-metadata before anything else
import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { configureContainer } from '../src/app/config/container'
import { setTestPrismaClient } from '../src/prisma'
import { TEST_DATABASE_URL as testDbUrl } from './test-database-url'

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.APP_SECRET = 'test-secret-key-for-testing-purposes'
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes' // Clean architecture expects JWT_SECRET
process.env.DATABASE_URL = testDbUrl
process.env.LOG_LEVEL = 'error' // Reduce noise in tests

// Initialize Prisma client for tests immediately
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testDbUrl,
    },
  },
})

// Set the test client immediately to avoid import errors
setTestPrismaClient(testPrisma)

// Configure dependency injection container early for tests
configureContainer()

export const TEST_DATABASE_URL = testDbUrl
export const prisma = testPrisma
