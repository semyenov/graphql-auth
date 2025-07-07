/**
 * Integration Test Configuration
 *
 * Centralized configuration for all integration testing patterns and tools
 */

import path from 'path'
import type { TestConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'

/**
 * Module test configuration interface
 */
export interface ModuleTestConfiguration {
  modules: ModuleConfig[]
  testFramework: TestFrameworkConfig
  boundaries: BoundaryTestConfig
  communication: CommunicationTestConfig
  performance: PerformanceTestConfig
  documentation: DocumentationConfig
}

export interface ModuleConfig {
  name: string
  path: string
  dependencies: string[]
  isolationLevel: 'unit' | 'integration' | 'e2e'
  clientInterface: string
  mockExternalDependencies: boolean
  enableMessageBus: boolean
  testPatterns: string[]
  skipTests?: string[]
}

export interface TestFrameworkConfig {
  timeout: number
  retries: number
  concurrency: number
  bail: boolean
  coverage: CoverageConfig
  reporters: ReporterConfig[]
}

export interface CoverageConfig {
  enabled: boolean
  threshold: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
  exclude: string[]
  include: string[]
}

export interface ReporterConfig {
  name: string
  options?: Record<string, any>
}

export interface BoundaryTestConfig {
  enabled: boolean
  strict: boolean
  allowedViolations: string[]
  excludePatterns: string[]
  analysisRules: BoundaryRule[]
}

export interface BoundaryRule {
  name: string
  pattern: string
  severity: 'error' | 'warning' | 'info'
  description: string
}

export interface CommunicationTestConfig {
  messageTimeout: number
  maxEvents: number
  enableEventHistory: boolean
  mockServices: boolean
  traceCommunication: boolean
}

export interface PerformanceTestConfig {
  enabled: boolean
  thresholds: {
    testDuration: number
    moduleLoadTime: number
    communicationLatency: number
    memoryUsage: number
  }
  sampling: {
    enabled: boolean
    interval: number
  }
}

export interface DocumentationConfig {
  generateOnTest: boolean
  outputPath: string
  includeExamples: boolean
  validateExamples: boolean
}

/**
 * Default integration test configuration
 */
export const defaultIntegrationTestConfig: ModuleTestConfiguration = {
  modules: [
    {
      name: 'auth',
      path: 'src/modules/auth',
      dependencies: ['shared'],
      isolationLevel: 'integration',
      clientInterface: 'IAuthClient',
      mockExternalDependencies: true,
      enableMessageBus: true,
      testPatterns: [
        'src/modules/auth/**/*.test.ts',
        'src/modules/auth/tests/**/*.test.ts',
      ],
      skipTests: [],
    },
    {
      name: 'posts',
      path: 'src/modules/posts',
      dependencies: ['shared', 'auth'],
      isolationLevel: 'integration',
      clientInterface: 'IPostsClient',
      mockExternalDependencies: true,
      enableMessageBus: true,
      testPatterns: [
        'src/modules/posts/**/*.test.ts',
        'src/modules/posts/tests/**/*.test.ts',
      ],
    },
    {
      name: 'users',
      path: 'src/modules/users',
      dependencies: ['shared', 'auth'],
      isolationLevel: 'integration',
      clientInterface: 'IUsersClient',
      mockExternalDependencies: true,
      enableMessageBus: true,
      testPatterns: [
        'src/modules/users/**/*.test.ts',
        'src/modules/users/tests/**/*.test.ts',
      ],
    },
    {
      name: 'oidc',
      path: 'src/modules/oidc',
      dependencies: ['shared', 'auth'],
      isolationLevel: 'integration',
      clientInterface: 'IOidcClient',
      mockExternalDependencies: true,
      enableMessageBus: false, // OIDC is more isolated
      testPatterns: ['src/modules/oidc/**/*.test.ts'],
    },
    {
      name: 'shared',
      path: 'src/modules/shared',
      dependencies: [],
      isolationLevel: 'unit',
      clientInterface: 'ISharedClient',
      mockExternalDependencies: false,
      enableMessageBus: false,
      testPatterns: ['src/modules/shared/**/*.test.ts'],
    },
  ],
  testFramework: {
    timeout: 30000, // 30 seconds
    retries: 2,
    concurrency: 4,
    bail: false,
    coverage: {
      enabled: true,
      threshold: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/.temp/**',
      ],
      include: [
        'src/modules/**/*.ts',
        'src/app/**/*.ts',
        'src/graphql/**/*.ts',
      ],
    },
    reporters: [
      { name: 'default' },
      {
        name: 'json',
        options: { outputFile: 'test-results/integration-results.json' },
      },
      {
        name: 'junit',
        options: { outputFile: 'test-results/integration-junit.xml' },
      },
    ],
  },
  boundaries: {
    enabled: true,
    strict: true,
    allowedViolations: [],
    excludePatterns: [
      '**/test/**',
      '**/tests/**',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    analysisRules: [
      {
        name: 'no-direct-service-imports',
        pattern: '/services/',
        severity: 'error',
        description:
          'Modules should not directly import services from other modules',
      },
      {
        name: 'no-cross-module-internals',
        pattern: '/modules/(?!shared).*(?<!\.module\.ts)$',
        severity: 'error',
        description: 'Modules should only access other modules through facades',
      },
      {
        name: 'prefer-facade-imports',
        pattern: '/modules/.*(?<!\.module\.ts)$',
        severity: 'warning',
        description: 'Prefer module facade imports over direct file imports',
      },
      {
        name: 'no-circular-dependencies',
        pattern: 'circular',
        severity: 'error',
        description: 'Circular dependencies between modules are not allowed',
      },
    ],
  },
  communication: {
    messageTimeout: 5000, // 5 seconds
    maxEvents: 1000,
    enableEventHistory: true,
    mockServices: true,
    traceCommunication: true,
  },
  performance: {
    enabled: true,
    thresholds: {
      testDuration: 10000, // 10 seconds
      moduleLoadTime: 1000, // 1 second
      communicationLatency: 100, // 100ms
      memoryUsage: 50 * 1024 * 1024, // 50MB
    },
    sampling: {
      enabled: true,
      interval: 100, // 100ms
    },
  },
  documentation: {
    generateOnTest: false,
    outputPath: 'docs/generated',
    includeExamples: true,
    validateExamples: false,
  },
}

/**
 * Create Vitest configuration for integration tests
 */
export function createIntegrationTestConfig(
  config: Partial<ModuleTestConfiguration> = {},
): TestConfig {
  const mergedConfig = {
    ...defaultIntegrationTestConfig,
    ...config,
  }

  return defineConfig({
    test: {
      name: 'integration',
      root: process.cwd(),
      globals: true,
      environment: 'node',
      timeout: mergedConfig.testFramework.timeout,
      testTimeout: mergedConfig.testFramework.timeout,
      hookTimeout: mergedConfig.testFramework.timeout,
      retry: mergedConfig.testFramework.retries,
      maxConcurrency: mergedConfig.testFramework.concurrency,
      bail: mergedConfig.testFramework.bail ? 1 : 0,

      // Test patterns
      include: [
        'test/integration/**/*.test.ts',
        'test/framework/**/*.test.ts',
        ...mergedConfig.modules.flatMap((m) => m.testPatterns),
      ],

      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.temp/**',
        ...mergedConfig.testFramework.coverage.exclude,
      ],

      // Coverage configuration
      coverage: {
        enabled: mergedConfig.testFramework.coverage.enabled,
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: 'coverage/integration',
        exclude: mergedConfig.testFramework.coverage.exclude,
        include: mergedConfig.testFramework.coverage.include,
        thresholds: {
          statements: mergedConfig.testFramework.coverage.threshold.statements,
          branches: mergedConfig.testFramework.coverage.threshold.branches,
          functions: mergedConfig.testFramework.coverage.threshold.functions,
          lines: mergedConfig.testFramework.coverage.threshold.lines,
        },
      },

      // Reporters
      reporters: mergedConfig.testFramework.reporters.map((r) =>
        r.options ? [r.name, r.options] : r.name,
      ),

      // Setup and teardown
      setupFiles: ['test/setup/integration-setup.ts'],

      globalSetup: ['test/setup/global-setup.ts'],

      // Module aliases
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '@test': path.resolve(process.cwd(), 'test'),
      },

      // Test environment
      env: {
        NODE_ENV: 'test',
        DATABASE_URL: 'file:./test.db',
        JWT_SECRET: 'test-secret-key-for-integration-tests',
        BCRYPT_ROUNDS: '4', // Faster for tests
      },

      // Pool configuration for better performance
      pool: 'threads',
      poolOptions: {
        threads: {
          minThreads: 1,
          maxThreads: mergedConfig.testFramework.concurrency,
        },
      },

      // File watching
      watchExclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.temp/**',
        '**/coverage/**',
        '**/test-results/**',
        '**/docs/generated/**',
      ],
    },

    // Additional configuration
    define: {
      __TEST_CONFIG__: JSON.stringify(mergedConfig),
    },

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '@test': path.resolve(process.cwd(), 'test'),
      },
    },
  })
}

/**
 * Get module configuration by name
 */
export function getModuleConfig(
  moduleName: string,
  config: ModuleTestConfiguration = defaultIntegrationTestConfig,
): ModuleConfig | undefined {
  return config.modules.find((m) => m.name === moduleName)
}

/**
 * Validate test configuration
 */
export function validateTestConfiguration(config: ModuleTestConfiguration): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate modules
  config.modules.forEach((module) => {
    if (!module.name) {
      errors.push(`Module missing name: ${JSON.stringify(module)}`)
    }

    if (!module.path) {
      errors.push(`Module ${module.name} missing path`)
    }

    if (!module.clientInterface) {
      warnings.push(`Module ${module.name} missing client interface`)
    }

    // Validate dependencies
    module.dependencies.forEach((dep) => {
      if (!config.modules.find((m) => m.name === dep)) {
        errors.push(`Module ${module.name} depends on unknown module: ${dep}`)
      }
    })
  })

  // Validate performance thresholds
  if (config.performance.thresholds.testDuration <= 0) {
    errors.push('Performance threshold testDuration must be positive')
  }

  if (config.performance.thresholds.memoryUsage <= 0) {
    errors.push('Performance threshold memoryUsage must be positive')
  }

  // Validate coverage thresholds
  const coverage = config.testFramework.coverage.threshold
  if (coverage.statements < 0 || coverage.statements > 100) {
    errors.push('Coverage threshold statements must be between 0 and 100')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Create module-specific test configuration
 */
export function createModuleTestConfig(
  moduleName: string,
  overrides: Partial<ModuleConfig> = {},
): ModuleConfig {
  const baseConfig = getModuleConfig(moduleName)

  if (!baseConfig) {
    throw new Error(`Module configuration not found: ${moduleName}`)
  }

  return {
    ...baseConfig,
    ...overrides,
  }
}

/**
 * Export the default configuration for use in vitest.config.ts
 */
export default createIntegrationTestConfig()
