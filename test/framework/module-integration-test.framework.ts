/**
 * Module Integration Testing Framework
 *
 * Provides testing utilities that respect module boundaries and enable
 * comprehensive testing of inter-module communication patterns.
 */

import { NoopLogger } from '@/app/logging/noop-logger'
import { InMemoryModuleBus } from '@/app/messaging/in-memory-module-bus'
import type { IModuleBus } from '@/app/messaging/module-bus.interface'
import { createMockContext } from '@/graphql/context/context.factory'
import type { DefaultContext } from '@/graphql/context/context.types'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import type { PrismaClient } from '@prisma/client'
import { createTestPrismaClient } from '@test/utils/database/prisma'
import { describe, expect, vi } from 'vitest'

/**
 * Configuration for module integration tests
 */
export interface ModuleTestConfig {
  moduleName: string
  dependencies: string[]
  clientInterface: string
  isolationLevel: 'unit' | 'integration' | 'e2e'
  mockExternalDependencies: boolean
  enableMessageBus: boolean
}

/**
 * Test fixtures for module testing
 */
export interface ModuleTestFixtures {
  prisma: PrismaClient
  logger: ILogger
  messageBus: IModuleBus
  context: DefaultContext
  cleanupCallbacks: Array<() => Promise<void>>
}

/**
 * Module test result interface
 */
export interface ModuleTestResult {
  success: boolean
  modulesTested: string[]
  communicationPatterns: string[]
  violations: BoundaryViolation[]
  performance: PerformanceMetrics
}

/**
 * Boundary violation interface
 */
export interface BoundaryViolation {
  type: 'direct-import' | 'unauthorized-access' | 'circular-dependency'
  module: string
  target: string
  severity: 'error' | 'warning'
  message: string
}

/**
 * Performance metrics for testing
 */
export interface PerformanceMetrics {
  testDuration: number
  moduleLoadTime: number
  communicationLatency: number
  memoryUsage: number
}

/**
 * Mock registry for managing test doubles
 */
export class ModuleMockRegistry {
  private mocks = new Map<string, Record<string, any>>()
  private spies = new Map<string, Record<string, any>>()

  /**
   * Register a mock for a module
   */
  registerMock<T>(moduleName: string, serviceName: string, mock: T): void {
    if (!this.mocks.has(moduleName)) {
      this.mocks.set(moduleName, {})
    }
    this.mocks.get(moduleName)![serviceName] = mock
  }

  /**
   * Create a spy for a module service
   */
  createSpy<T extends Record<string, any>>(
    moduleName: string,
    serviceName: string,
    implementation: T,
  ): T {
    const spy = vi.fn().mockImplementation(implementation)

    if (!this.spies.has(moduleName)) {
      this.spies.set(moduleName, {})
    }
    this.spies.get(moduleName)![serviceName] = spy

    return spy as T
  }

  /**
   * Get mock for a module service
   */
  getMock<T>(moduleName: string, serviceName: string): T | undefined {
    return this.mocks.get(moduleName)?.[serviceName]
  }

  /**
   * Get spy for a module service
   */
  getSpy<T>(moduleName: string, serviceName: string): T | undefined {
    return this.spies.get(moduleName)?.[serviceName]
  }

  /**
   * Clear all mocks and spies
   */
  clear(): void {
    this.mocks.clear()
    this.spies.clear()
    vi.clearAllMocks()
  }

  /**
   * Verify interaction patterns
   */
  verifyInteractions(moduleName: string): {
    called: string[]
    notCalled: string[]
    patterns: Record<string, number>
  } {
    const moduleSpies = this.spies.get(moduleName) || {}
    const called: string[] = []
    const notCalled: string[] = []
    const patterns: Record<string, number> = {}

    Object.entries(moduleSpies).forEach(([serviceName, spy]) => {
      if (spy.mock.calls.length > 0) {
        called.push(serviceName)
        patterns[serviceName] = spy.mock.calls.length
      } else {
        notCalled.push(serviceName)
      }
    })

    return { called, notCalled, patterns }
  }
}

/**
 * Module boundary validator
 */
export class ModuleBoundaryValidator {
  private violations: BoundaryViolation[] = []

  /**
   * Validate that module only uses allowed dependencies
   */
  validateDependencies(
    moduleName: string,
    allowedDependencies: string[],
    actualImports: string[],
  ): void {
    actualImports.forEach((importPath) => {
      const isAllowed = allowedDependencies.some((dep) =>
        importPath.includes(dep),
      )

      if (!(isAllowed || importPath.includes('/shared/'))) {
        this.violations.push({
          type: 'unauthorized-access',
          module: moduleName,
          target: importPath,
          severity: 'error',
          message: `Module ${moduleName} imports unauthorized dependency: ${importPath}`,
        })
      }
    })
  }

  /**
   * Validate client interface usage
   */
  validateClientInterfaceUsage(
    moduleName: string,
    expectedInterface: string,
    actualUsage: string[],
  ): void {
    const hasDirectAccess = actualUsage.some(
      (usage) =>
        usage.includes('/services/') || usage.includes('/repositories/'),
    )

    if (hasDirectAccess) {
      this.violations.push({
        type: 'direct-import',
        module: moduleName,
        target: expectedInterface,
        severity: 'error',
        message: `Module ${moduleName} should use client interface instead of direct service access`,
      })
    }
  }

  /**
   * Get all violations
   */
  getViolations(): BoundaryViolation[] {
    return [...this.violations]
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = []
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.violations.some((v) => v.severity === 'error')
  }
}

/**
 * Message bus testing utilities
 */
export class MessageBusTestHelper {
  private messageBus: IModuleBus
  private publishedMessages: Array<{
    type: string
    payload: any
    timestamp: Date
  }> = []
  private subscriptions: Array<{
    messageType: string
    moduleId: string
    handler: any
  }> = []

  constructor(messageBus: IModuleBus) {
    this.messageBus = messageBus
  }

  /**
   * Subscribe to messages for testing
   */
  subscribeForTesting<T>(messageType: string, moduleId: string): Promise<T[]> {
    const receivedMessages: T[] = []

    const subscription = this.messageBus.subscribe<any>(
      messageType,
      async (message: T) => {
        receivedMessages.push(message)
      },
      moduleId,
    )

    this.subscriptions.push({
      messageType,
      moduleId,
      handler: subscription,
    })

    return Promise.resolve(receivedMessages)
  }

  /**
   * Publish test message
   */
  async publishTestMessage<T>(messageType: string, payload: T): Promise<void> {
    this.publishedMessages.push({
      type: messageType,
      payload,
      timestamp: new Date(),
    })

    await this.messageBus.publish({
      type: messageType,
      moduleId: 'test',
      timestamp: new Date(),
      ...payload,
    } as any)
  }

  /**
   * Wait for message to be processed
   */
  async waitForMessageProcessing(timeout = 1000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  /**
   * Get message statistics
   */
  getMessageStatistics(): {
    published: number
    subscriptions: number
    messageTypes: string[]
  } {
    return {
      published: this.publishedMessages.length,
      subscriptions: this.subscriptions.length,
      messageTypes: [...new Set(this.publishedMessages.map((m) => m.type))],
    }
  }

  /**
   * Cleanup subscriptions
   */
  cleanup(): void {
    this.subscriptions.forEach((sub) => {
      if (sub.handler && typeof sub.handler.unsubscribe === 'function') {
        sub.handler.unsubscribe()
      }
    })
    this.subscriptions = []
    this.publishedMessages = []
  }
}

/**
 * Performance monitor for module tests
 */
export class ModulePerformanceMonitor {
  private startTime: number = 0
  private metrics: PerformanceMetrics = {
    testDuration: 0,
    moduleLoadTime: 0,
    communicationLatency: 0,
    memoryUsage: 0,
  }

  /**
   * Start monitoring
   */
  start(): void {
    this.startTime = performance.now()
    this.metrics.memoryUsage = process.memoryUsage().heapUsed
  }

  /**
   * Record module load time
   */
  recordModuleLoadTime(): void {
    this.metrics.moduleLoadTime = performance.now() - this.startTime
  }

  /**
   * Record communication latency
   */
  recordCommunicationLatency(startTime: number): void {
    this.metrics.communicationLatency = performance.now() - startTime
  }

  /**
   * Stop monitoring and get results
   */
  stop(): PerformanceMetrics {
    this.metrics.testDuration = performance.now() - this.startTime
    this.metrics.memoryUsage =
      process.memoryUsage().heapUsed - this.metrics.memoryUsage
    return { ...this.metrics }
  }
}

/**
 * Module integration test framework
 */
export class ModuleIntegrationTestFramework {
  private fixtures: ModuleTestFixtures | null = null
  private mockRegistry = new ModuleMockRegistry()
  private boundaryValidator = new ModuleBoundaryValidator()
  private messageBusHelper: MessageBusTestHelper | null = null
  private performanceMonitor = new ModulePerformanceMonitor()

  /**
   * Setup test environment
   */
  async setup(config: ModuleTestConfig): Promise<ModuleTestFixtures> {
    this.performanceMonitor.start()

    // Create test database
    const prisma = createTestPrismaClient()

    // Create logger (noop for tests)
    const logger = new NoopLogger()

    // Create message bus if enabled
    let messageBus: IModuleBus
    if (config.enableMessageBus) {
      messageBus = new InMemoryModuleBus(logger)
      this.messageBusHelper = new MessageBusTestHelper(messageBus)
    } else {
      messageBus = {
        publish: vi.fn(),
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
        unsubscribeModule: vi.fn(),
        getSubscriptions: vi.fn(),
        getMessageHistory: vi.fn(),
        clearMessageHistory: vi.fn(),
        hasSubscribers: vi.fn(),
        getStatistics: vi.fn(),
        subscribeToMultiple: vi.fn(),
      } as any
    }

    // Create mock context
    const context = createMockContext({
      userId: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }) as DefaultContext

    this.fixtures = {
      prisma,
      logger,
      messageBus,
      context,
      cleanupCallbacks: [],
    }

    this.performanceMonitor.recordModuleLoadTime()
    return this.fixtures
  }

  /**
   * Test module isolation
   */
  async testModuleIsolation(
    moduleName: string,
    testFunction: (fixtures: ModuleTestFixtures) => Promise<void>,
  ): Promise<void> {
    if (!this.fixtures) {
      throw new Error('Test framework not initialized. Call setup() first.')
    }

    const startTime = performance.now()

    try {
      await testFunction(this.fixtures)
      this.performanceMonitor.recordCommunicationLatency(startTime)
    } catch (error) {
      this.boundaryValidator.validateDependencies(
        moduleName,
        [],
        [], // This would be populated by static analysis
      )
      throw error
    }
  }

  /**
   * Test inter-module communication
   */
  async testInterModuleCommunication(
    sourceModule: string,
    targetModule: string,
    communicationTest: (
      messageBus: MessageBusTestHelper,
      fixtures: ModuleTestFixtures,
    ) => Promise<void>,
  ): Promise<void> {
    if (!(this.fixtures && this.messageBusHelper)) {
      throw new Error(
        'Test framework not initialized with message bus enabled.',
      )
    }

    const startTime = performance.now()

    try {
      await communicationTest(this.messageBusHelper, this.fixtures)

      // Validate that communication went through proper channels
      const stats = this.messageBusHelper.getMessageStatistics()
      expect(stats.published).toBeGreaterThan(0)

      this.performanceMonitor.recordCommunicationLatency(startTime)
    } catch (error) {
      throw new Error(
        `Inter-module communication failed between ${sourceModule} and ${targetModule}: ${error}`,
      )
    }
  }

  /**
   * Test client interface compliance
   */
  async testClientInterfaceCompliance<T>(
    moduleName: string,
    clientInterface: new (...args: any[]) => T,
    implementation: T,
  ): Promise<void> {
    // Check that implementation conforms to interface
    const interfaceKeys = Object.getOwnPropertyNames(clientInterface.prototype)
    const implementationKeys = Object.getOwnPropertyNames(implementation)

    interfaceKeys.forEach((key) => {
      if (key !== 'constructor' && !implementationKeys.includes(key)) {
        this.boundaryValidator.getViolations().push({
          type: 'direct-import',
          module: moduleName,
          target: key,
          severity: 'error',
          message: `Implementation missing required method: ${key}`,
        })
      }
    })

    if (this.boundaryValidator.hasErrors()) {
      throw new Error(
        `Client interface compliance failed for ${moduleName}: ${this.boundaryValidator
          .getViolations()
          .map((v) => v.message)
          .join(', ')}`,
      )
    }
  }

  /**
   * Create module test suite
   */
  createModuleTestSuite(
    config: ModuleTestConfig,
    tests: (framework: ModuleIntegrationTestFramework) => void,
  ): void {
    describe(`Module Integration: ${config.moduleName}`, () => {
      beforeEach(async () => {
        await this.setup(config)
      })

      afterEach(async () => {
        await this.cleanup()
      })

      tests(this)
    })
  }

  /**
   * Assert module boundary compliance
   */
  assertBoundaryCompliance(): void {
    const violations = this.boundaryValidator.getViolations()
    const errors = violations.filter((v) => v.severity === 'error')

    if (errors.length > 0) {
      throw new Error(
        `Module boundary violations found:\n${errors
          .map((e) => `  - ${e.message}`)
          .join('\n')}`,
      )
    }
  }

  /**
   * Get test results
   */
  getTestResults(): ModuleTestResult {
    return {
      success: !this.boundaryValidator.hasErrors(),
      modulesTested: [], // Would be populated during actual test runs
      communicationPatterns: [], // Would be populated during actual test runs
      violations: this.boundaryValidator.getViolations(),
      performance: this.performanceMonitor.stop(),
    }
  }

  /**
   * Cleanup test environment
   */
  async cleanup(): Promise<void> {
    if (this.fixtures) {
      // Run cleanup callbacks
      for (const cleanup of this.fixtures.cleanupCallbacks) {
        await cleanup()
      }

      // Disconnect from test database
      await this.fixtures.prisma.$disconnect()
    }

    // Cleanup mocks and spies
    this.mockRegistry.clear()
    this.boundaryValidator.clearViolations()

    if (this.messageBusHelper) {
      this.messageBusHelper.cleanup()
    }

    this.fixtures = null
  }

  /**
   * Get mock registry for test setup
   */
  getMockRegistry(): ModuleMockRegistry {
    return this.mockRegistry
  }

  /**
   * Get boundary validator for assertions
   */
  getBoundaryValidator(): ModuleBoundaryValidator {
    return this.boundaryValidator
  }

  /**
   * Get message bus helper for communication tests
   */
  getMessageBusHelper(): MessageBusTestHelper | null {
    return this.messageBusHelper
  }
}

/**
 * Convenience function to create test framework
 */
export function createModuleTestFramework(): ModuleIntegrationTestFramework {
  return new ModuleIntegrationTestFramework()
}

/**
 * Helper function to test module in isolation
 */
export async function testModuleInIsolation<T>(
  moduleName: string,
  dependencies: string[],
  testFunction: (fixtures: ModuleTestFixtures) => Promise<T>,
): Promise<T> {
  const framework = createModuleTestFramework()

  try {
    const fixtures = await framework.setup({
      moduleName,
      dependencies,
      clientInterface: `I${moduleName}Client`,
      isolationLevel: 'unit',
      mockExternalDependencies: true,
      enableMessageBus: false,
    })

    const result = await testFunction(fixtures)
    framework.assertBoundaryCompliance()

    return result
  } finally {
    await framework.cleanup()
  }
}

/**
 * Helper function to test inter-module communication
 */
export async function testInterModuleCommunication<T>(
  sourceModule: string,
  targetModule: string,
  testFunction: (
    messageBus: MessageBusTestHelper,
    fixtures: ModuleTestFixtures,
  ) => Promise<T>,
): Promise<T> {
  const framework = createModuleTestFramework()

  try {
    const fixtures = await framework.setup({
      moduleName: `${sourceModule}-${targetModule}`,
      dependencies: [sourceModule, targetModule],
      clientInterface: 'ICommunicationTest',
      isolationLevel: 'integration',
      mockExternalDependencies: false,
      enableMessageBus: true,
    })

    const messageBusHelper = framework.getMessageBusHelper()!
    const result = await testFunction(messageBusHelper, fixtures)

    framework.assertBoundaryCompliance()

    return result
  } finally {
    await framework.cleanup()
  }
}
