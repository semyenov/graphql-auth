import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
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

beforeAll(async () => {
  try {
    console.log('Setting up test database...')

    // Set the shared prisma instance to use our test client
    setPrismaClient(prisma)

    // Connect to the database
    await prisma.$connect()

    // Apply schema directly using Prisma db push
    console.log('Applying database schema...')
    execSync('bunx prisma db push --force-reset --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DATABASE_URL
      },
      stdio: 'inherit',
      timeout: 15000
    })

    // Test the connection
    await prisma.$queryRaw`SELECT 1`
    console.log('Test database setup complete')
  } catch (error) {
    console.error('Failed to set up test database:', error)
    throw error
  }
}, 20000) // Increase timeout to 20 seconds

afterAll(async () => {
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Clean up database between tests
  try {
    // For in-memory database, tables should always exist after setup
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
  } catch (error) {
    console.error('Error cleaning database:', error)
    // Try to recreate schema if cleanup fails
    try {
      execSync('bunx prisma db push --force-reset --skip-generate', {
        env: {
          ...process.env,
          DATABASE_URL: TEST_DATABASE_URL
        },
        stdio: 'pipe',
        timeout: 10000
      })
    } catch (pushError) {
      console.error('Error recreating schema:', pushError)
    }
  }
})