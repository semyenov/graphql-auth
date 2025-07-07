import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    // Test Environment
    environment: 'happy-dom', // Use 'node' for backend tests
    globals: true,
    setupFiles: ['./test/test-env.ts', './test/vitest-setup.ts'],
    passWithNoTests: true, // Allow test files without tests to pass
    logHeapUsage: true, // Monitor memory usage

    // Execution and Isolation
    // Run tests sequentially to prevent database race conditions.
    // 'forks' pool provides process-level isolation, crucial for DB tests,
    // though slower than 'threads'.
    fileParallelism: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        isolate: true, // Isolate each test file in a separate process
      },
    },

    // Coverage
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts', 'modules/**/*.ts'],
      exclude: ['node_modules/', 'dist/', 'test/'],
      all: true,
    },

    // Environment Variables
    env: {
      NODE_ENV: 'test',
    },
  },

  // Module Resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
      graphql: path.resolve(__dirname, './node_modules/graphql'),
    },
    // Deduping ensures that only one version of a package is loaded, which is vital for
    // packages that rely on singletons or global state, like Pothos and GraphQL.
    dedupe: [
      'graphql',
      '@apollo/server',
      'graphql-shield',
      '@pothos/core',
      '@pothos/plugin-prisma',
      '@pothos/plugin-relay',
      '@pothos/plugin-errors',
      '@pothos/plugin-scope-auth',
      '@pothos/plugin-validation',
      '@pothos/plugin-dataloader',
    ],
  },

  // Vite-specific options used by Vitest
  // These settings are related to how Vitest processes modules with Vite's engine.
  ssr: {
    // Prevents modules from being treated as external during server-side rendering simulation.
    noExternal: true,
  },
  esbuild: {
    // Set target to match project's Node.js version.
    target: 'node20',
    platform: 'node',
  },
  optimizeDeps: {
    include: ['graphql'],
    exclude: ['@pothos/core', 'graphql-shield'],
  },
})
