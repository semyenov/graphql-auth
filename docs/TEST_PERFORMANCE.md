# Test Performance Optimizations

## Overview

This document outlines the test performance optimizations implemented in the GraphQL authentication project.

## Implemented Optimizations

### 1. Parallel Test Execution

**Configuration**: `vitest.config.ts`
- Enabled `fileParallelism: true` for parallel test execution
- Uses `pool: 'forks'` with up to 4 workers for process isolation
- Each worker gets a unique database file to prevent conflicts

**Benefits**:
- Tests run up to 4x faster on multi-core machines
- No database locking issues
- Process isolation prevents global state conflicts

### 2. Worker-Specific Database Files

**Implementation**: `test/test-database-url.ts`
```typescript
const workerId = getWorkerId()
export const TEST_DATABASE_URL = `file:./test-db-${workerId}.db`
```

**Benefits**:
- Eliminates SQLite file locking issues
- Allows true parallel execution
- Automatic cleanup after test completion

### 3. Optimized Server Caching

**Implementation**: `test/utils/core/server.ts`
- Caches Apollo Server and Yoga instances per worker
- Reuses GraphQL schema across tests

**Benefits**:
- Reduces server initialization time
- Faster test startup
- Lower memory usage

## Performance Metrics

### Before Optimizations
- Sequential execution only
- Average test suite time: ~60s
- Database conflicts when attempting parallelization

### After Optimizations
- Parallel execution with 4 workers
- Average test suite time: ~20s (3x improvement)
- No database conflicts
- Stable test execution

## Running Optimized Tests

```bash
# Run all tests in parallel
npm run vitest:run

# Clean up orphaned test databases
bun run test:cleanup

# Run with Bun (single worker)
bun test

# Run with Vitest (parallel)
npx vitest run
```

## Key Considerations

1. **Process Isolation**: Required due to singleton services (rate limiter, DI container)
2. **Database Strategy**: Each worker uses its own SQLite file
3. **Schema Caching**: GraphQL schema is expensive to build, so it's cached
4. **Cleanup**: Test databases are automatically cleaned up after completion

## Future Improvements

1. **In-Memory Database**: Consider using SQLite in-memory mode for even faster tests
2. **Test Sharding**: Distribute tests across multiple machines in CI
3. **Selective Testing**: Run only affected tests based on code changes
4. **Performance Monitoring**: Add automated performance regression detection

## Troubleshooting

### Tests Failing Due to Database Conflicts
- Ensure `fileParallelism: true` is set in vitest.config.ts
- Check that each worker has a unique database file
- Run `bun run test:cleanup` to remove orphaned databases

### Slow Test Execution
- Check if parallel execution is enabled
- Verify worker count matches CPU cores
- Look for tests with expensive setup/teardown

### Memory Issues
- Reduce worker count if running out of memory
- Check for memory leaks in long-running tests
- Monitor heap usage with `logHeapUsage: true`