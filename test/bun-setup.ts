import { afterAll, beforeAll, beforeEach } from 'bun:test'
import { execSync } from 'child_process'
import { rm } from 'fs/promises'
import { configureContainer } from '../src/app/config/container'
import { rateLimiter } from '../src/app/services/rate-limiter.service'
import { resetSchemaCache } from '../src/graphql/schema'
import { TEST_DATABASE_URL } from './test-database-url'
import { prisma } from './utils/database/prisma'

const dbFilePath = TEST_DATABASE_URL.replace('file:', '')

beforeAll(async () => {
  try {
    console.log(`Setting up test database: ${TEST_DATABASE_URL}`)
    configureContainer()

    await prisma.$connect()

    execSync('bunx prisma db push --force-reset --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DATABASE_URL,
      },
      stdio: 'pipe',
      timeout: 30000,
    })

    console.log('Test database setup complete')
  } catch (error) {
    console.error('Failed to set up test database:', error)
    throw error
  }
})

afterAll(async () => {
  try {
    await prisma.$disconnect()
    await rateLimiter.cleanup()
    await rm(dbFilePath, { force: true, recursive: true })
    console.log('Test database cleaned up.')
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
})

beforeEach(async () => {
  resetSchemaCache()

  // Use transactions to ensure atomic cleanup
  await prisma.$transaction([
    prisma.post.deleteMany({}),
    prisma.user.deleteMany({}),
  ])

  // Reset rate limiter between tests
  try {
    await rateLimiter.resetAll()
  } catch (rateLimitError) {
    console.error('Error resetting rate limiter:', rateLimitError)
  }
})
