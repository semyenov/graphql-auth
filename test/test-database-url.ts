// Generate a unique test database URL for each test worker
// This allows tests to run in parallel without database conflicts

// Get worker ID from Vitest (available in test environment)
// Falls back to process.pid if not in Vitest environment
const getWorkerId = () => {
  // @ts-ignore - globalThis.__vitest_worker__ is injected by Vitest
  const vitestWorkerId = globalThis.__vitest_worker__?.id
  if (vitestWorkerId !== undefined) {
    return vitestWorkerId
  }
  // Fallback for non-Vitest environments (e.g., Bun tests)
  return process.pid || '0'
}

const workerId = getWorkerId()
export const TEST_DATABASE_URL = `file:./test-db-${workerId}.db`
