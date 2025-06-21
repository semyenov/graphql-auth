import { execSync } from 'child_process'
import path from 'path'
import { rm } from 'fs/promises'
import { afterAll, beforeAll, beforeEach } from 'vitest'
import { configureContainer } from '../src/app/config/container'
import { rateLimiter } from '../src/app/services/rate-limiter.service'
import { resetSchemaCache } from '../src/graphql/schema'
import { prisma } from '../src/prisma'
import { TEST_DATABASE_URL } from './test-database-url'

const __filename = '' // This will be replaced by vitest
const __dirname = path.dirname(__filename)

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
}, 60000)

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
  const tableNames = await prisma.$queryRaw<
    { name: string }[]
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`

  for (const { name } of tableNames) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`)
  }
})
