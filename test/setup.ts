import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { unlink } from 'fs/promises'
import { afterAll, beforeAll, beforeEach } from 'vitest'
import { setPrismaClient } from '../src/shared-prisma'
import { TEST_DATABASE_URL } from './test-env'

// Create a test database client
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: TEST_DATABASE_URL,
    },
  },
})

// Extract database file path for cleanup
const dbFilePath = TEST_DATABASE_URL.replace('file:', '')

beforeAll(async () => {
  try {
    console.log(`Setting up test database: ${TEST_DATABASE_URL}`)

    // Set the shared prisma instance to use our test client
    setPrismaClient(prisma)

    // Connect to the database
    await prisma.$connect()

    // Apply schema using Prisma db push
    console.log('Applying database schema...')
    execSync('bunx prisma db push --force-reset --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DATABASE_URL
      },
      stdio: 'pipe',
      timeout: 30000
    })

    // Test the connection
    await prisma.$queryRaw`SELECT 1`
    console.log('Test database setup complete')
  } catch (error) {
    console.error('Failed to set up test database:', error)
    throw error
  }
}, 30000)

afterAll(async () => {
  try {
    await prisma.$disconnect()

    // Clean up the temporary database file
    try {
      await unlink(dbFilePath)
      console.log('Test database file cleaned up')
    } catch (unlinkError) {
      // File might not exist or already be deleted, which is fine
      console.log('Database file cleanup: file may already be deleted')
    }
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
})

beforeEach(async () => {
  // Clean up database between tests
  try {
    // Delete all data in reverse order of dependencies
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
  } catch (error) {
    console.error('Error cleaning database:', error)
    throw error
  }
})