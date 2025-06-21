import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/test-env.ts', './test/setup.ts'],
    env: {
      NODE_ENV: 'test',
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/', 'prisma/', 'dist/', 'types/'],
      provider: 'v8',
    },
    // Run tests sequentially to avoid database conflicts
    sequence: {
      concurrent: false,
    },
    // Use forks pool to ensure proper isolation
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Ensure proper isolation between test files
    isolate: true,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || __dirname, './src'),
      '@prisma/client': path.resolve(
        import.meta.dirname || __dirname,
        './node_modules/@prisma/client',
      ),
    },
  },
})
