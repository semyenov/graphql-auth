import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    // Test Environment
    environment: 'node', // Use 'node' for backend tests
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
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        'prisma/',
        'src/gql/',
        'src/main.ts',
        'src/server.ts',
        'src/app/server.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        'src/types/',
        'src/graphql/generated/',
        'src/graphql/schema/index.ts', // Usually just imports/exports
        'src/graphql/schema/builder.ts', // Pothos setup
      ],
      all: true, // Ensure all files in `include` are covered, even if not tested
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
      // Forcing a single instance of GraphQL is critical to prevent schema mismatch errors,
      // especially when multiple packages in the dependency tree might resolve different versions.
      graphql: path.resolve(__dirname, 'node_modules/graphql/index.js'),
      // These are likely needed for the same reason to avoid duplication.
      'graphql/type': path.resolve(
        __dirname,
        'node_modules/graphql/type/index.js',
      ),
      'graphql/type/definition': path.resolve(
        __dirname,
        'node_modules/graphql/type/definition.js',
      ),
      'graphql/jsutils/instanceOf': path.resolve(
        __dirname,
        'node_modules/graphql/jsutils/instanceOf.js',
      ),
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
    // Prevents 'graphql' from being treated as an external module during server-side rendering simulation.
    noExternal: ['graphql'],
  },
  esbuild: {
    // Set target to match project's Node.js version.
    target: 'node20',
  },
  optimizeDeps: {
    // While this is typically for browser-based dev servers, Vitest can use it.
    // Including these helps ensure they are processed correctly.
    include: ['graphql', 'graphql-shield', '@apollo/server'],
    // Forcing pre-bundling can sometimes resolve obscure module resolution issues.
    force: true,
  },
})
