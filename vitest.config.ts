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
    // Use threads pool for better performance in Vitest 3.x
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: false,
      },
    },
    // Vitest 3.x specific optimizations
    isolate: false,
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
