import path from 'path'
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
      exclude: [
        'node_modules/',
        'test/',
        'prisma/',
        'dist/',
        'types/',
      ],
    },
    // Run tests sequentially to avoid database conflicts
    sequence: {
      concurrent: false,
    },
    // Use threads instead of forks for in-memory SQLite with cache=shared
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prisma/client': path.resolve(__dirname, './node_modules/@prisma/client'),
    },
  },
})