import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/test-env.ts', './test/vitest-setup.ts'],
    env: {
      NODE_ENV: 'test',
    },
    // Disable threads completely to avoid module isolation issues
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: true,
      },
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
    // Ensure proper isolation between test files
    isolate: true,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
      // Force all graphql imports to resolve to the same module
      graphql: path.resolve(__dirname, 'node_modules/graphql/index.js'),
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
    // List all packages that should be deduped
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
  // Ensure graphql is treated as external in some cases
  ssr: {
    noExternal: ['graphql'],
  },
  // Add esbuild options to prevent issues
  esbuild: {
    target: 'node20',
  },
  // Optimize deps configuration
  optimizeDeps: {
    include: ['graphql', 'graphql-shield', '@apollo/server'],
    // Force pre-bundling of these deps
    force: true,
  },
})
