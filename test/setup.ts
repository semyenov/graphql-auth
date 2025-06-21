import { execSync } from 'child_process'
import { rm } from 'fs/promises'
import { afterAll, beforeAll, beforeEach } from 'vitest'
import { configureContainer } from '../src/app/config/container'
import { DatabaseClient } from '../src/app/database/client'
import { rateLimiter } from '../src/app/services/rate-limiter.service'
import { prisma } from '../src/prisma'
import { TEST_DATABASE_URL } from './test-database-url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

const dbFilePath = TEST_DATABASE_URL.replace('file:', '')

beforeAll(async () => {
  try {
    console.log(`Setting up test database: ${TEST_DATABASE_URL}`)

    // Configure dependency injection container for tests
    configureContainer()

    // Also set the test client for clean architecture DatabaseClient
    DatabaseClient.setTestClient(prisma)

    // Connect to the database
    await prisma.$connect()

    // Apply schema using Prisma db push with force reset
    console.log('Applying database schema...')
    execSync('bunx prisma db push --force-reset --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DATABASE_URL,
      },
      stdio: 'pipe',
      timeout: 30000,
    })
    
    // Wait a bit to ensure database is ready
    await new Promise(resolve => setTimeout(resolve, 100))

    // Test the connection and write access
    await prisma.$queryRaw`SELECT 1`

    // Test write access by creating and deleting a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test-write-access@example.com',
        password: 'test',
        name: 'Test Write Access',
      },
    })
    await prisma.user.delete({ where: { id: testUser.id } })

    console.log('Test database setup complete')
  } catch (error) {
    console.error('Failed to set up test database:', error)
    throw error
  }
}, 30000)

afterAll(async () => {
  try {
    await prisma.$disconnect()
    await rateLimiter.resetAll()

    // Clean up the temporary database file
    try {
      await rm(dbFilePath)
      console.log('Test database file cleaned up')
    } catch (_unlinkError) {
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
    // Use transactions to ensure atomic cleanup
    await prisma.$transaction([
      prisma.post.deleteMany({}),
      prisma.user.deleteMany({}),
    ])
    
    // Verify cleanup
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()
    
    if (userCount > 0 || postCount > 0) {
      throw new Error(`Database not clean: ${userCount} users, ${postCount} posts`)
    }
    
    // Reset rate limiter between tests
    try {
      await rateLimiter.resetAll()
    } catch (rateLimitError) {
      console.error('Error resetting rate limiter:', rateLimitError)
    }
  } catch (error) {
    console.error('Error cleaning database:', error)
    throw error
  }
})
