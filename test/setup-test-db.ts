import { execSync } from 'child_process'

export async function setupTestDatabase() {
  // For in-memory database, we just need to apply migrations
  // The DATABASE_URL is already set in test-env.ts to use in-memory database
  const env = { ...process.env }

  try {
    // Use db push instead of migrate deploy for in-memory database
    execSync('bunx prisma db push --force-reset', {
      env,
      stdio: 'inherit',
      timeout: 30000
    })
  } catch (error) {
    console.error('Database push failed:', error)
    throw error
  }

  // Generate Prisma client
  execSync('bunx prisma generate', {
    env,
    stdio: 'inherit'
  })
}

// Run if called directly
if (require.main === module) {
  setupTestDatabase()
    .then(() => console.log('Test database setup complete'))
    .catch(console.error)
}