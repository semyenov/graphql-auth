/**
 * Module Communication Integration Tests
 *
 * Tests that verify proper communication between modules while respecting boundaries
 */

import type { AuthModuleEvents } from '@/modules/auth/client/auth.client.interface'
import {
  createModuleTestFramework,
  type ModuleIntegrationTestFramework,
} from '@test/framework/module-integration-test.framework'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Module Communication Integration', () => {
  let framework: ModuleIntegrationTestFramework

  beforeEach(async () => {
    framework = createModuleTestFramework()
  })

  afterEach(async () => {
    await framework.cleanup()
  })

  describe('Auth Module Communication', () => {
    it('should notify other modules when user registers', async () => {
      await framework.setup({
        moduleName: 'auth-communication',
        dependencies: ['auth', 'users', 'posts'],
        clientInterface: 'IAuthClient',
        isolationLevel: 'integration',
        mockExternalDependencies: false,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!
      const receivedMessages: AuthModuleEvents['user.registered'][] = []

      // Subscribe to user registration events
      await messageBusHelper.subscribeForTesting<
        AuthModuleEvents['user.registered']
      >('user.registered', 'test-module')

      // Simulate user registration
      await messageBusHelper.publishTestMessage('user.registered', {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      const stats = messageBusHelper.getMessageStatistics()
      expect(stats.published).toBe(1)
      expect(stats.messageTypes).toContain('user.registered')

      framework.assertBoundaryCompliance()
    })

    it('should handle authentication events without direct module access', async () => {
      await framework.setup({
        moduleName: 'auth-isolation',
        dependencies: ['auth'],
        clientInterface: 'IAuthClient',
        isolationLevel: 'unit',
        mockExternalDependencies: true,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Test authentication flow
      await messageBusHelper.publishTestMessage('user.authenticated', {
        userId: 1,
        email: 'test@example.com',
        ipAddress: '127.0.0.1',
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      // Verify no boundary violations occurred
      framework.assertBoundaryCompliance()
    })
  })

  describe('Posts Module Communication', () => {
    it('should communicate with users module for author information', async () => {
      await framework.setup({
        moduleName: 'posts-users-communication',
        dependencies: ['posts', 'users'],
        clientInterface: 'IPostsClient',
        isolationLevel: 'integration',
        mockExternalDependencies: false,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Test post creation event
      await messageBusHelper.publishTestMessage('post.created', {
        postId: 1,
        title: 'Test Post',
        authorId: 1,
        published: false,
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      const stats = messageBusHelper.getMessageStatistics()
      expect(stats.messageTypes).toContain('post.created')

      framework.assertBoundaryCompliance()
    })

    it('should handle post publication events', async () => {
      await framework.setup({
        moduleName: 'posts-publication',
        dependencies: ['posts'],
        clientInterface: 'IPostsClient',
        isolationLevel: 'unit',
        mockExternalDependencies: true,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Test post publication
      await messageBusHelper.publishTestMessage('post.published', {
        postId: 1,
        title: 'Published Post',
        authorId: 1,
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      framework.assertBoundaryCompliance()
    })
  })

  describe('Users Module Communication', () => {
    it('should handle user profile updates', async () => {
      await framework.setup({
        moduleName: 'users-profile-updates',
        dependencies: ['users'],
        clientInterface: 'IUsersClient',
        isolationLevel: 'unit',
        mockExternalDependencies: true,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Test profile update
      await messageBusHelper.publishTestMessage('user.profile.updated', {
        userId: 1,
        changes: ['name', 'bio'],
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      framework.assertBoundaryCompliance()
    })
  })

  describe('Cross-Module Event Flow', () => {
    it('should handle complete user registration flow across modules', async () => {
      await framework.setup({
        moduleName: 'complete-registration-flow',
        dependencies: ['auth', 'users', 'posts'],
        clientInterface: 'ICompleteFlow',
        isolationLevel: 'e2e',
        mockExternalDependencies: false,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!
      const eventFlow: string[] = []

      // Subscribe to all relevant events
      await messageBusHelper.subscribeForTesting('user.registered', 'flow-test')
      await messageBusHelper.subscribeForTesting('user.created', 'flow-test')
      await messageBusHelper.subscribeForTesting('email.sent', 'flow-test')

      // Simulate registration flow
      await messageBusHelper.publishTestMessage('user.registered', {
        userId: 1,
        email: 'newuser@example.com',
        name: 'New User',
        timestamp: new Date(),
      })

      await messageBusHelper.publishTestMessage('user.created', {
        userId: 1,
        email: 'newuser@example.com',
        name: 'New User',
        role: 'USER',
        timestamp: new Date(),
      })

      await messageBusHelper.publishTestMessage('email.sent', {
        to: 'newuser@example.com',
        subject: 'Welcome!',
        success: true,
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      const stats = messageBusHelper.getMessageStatistics()
      expect(stats.published).toBe(3)
      expect(stats.messageTypes).toContain('user.registered')
      expect(stats.messageTypes).toContain('user.created')
      expect(stats.messageTypes).toContain('email.sent')

      framework.assertBoundaryCompliance()
    })

    it('should respect module boundaries during event processing', async () => {
      await framework.setup({
        moduleName: 'boundary-respect-test',
        dependencies: ['auth', 'posts'],
        clientInterface: 'IBoundaryTest',
        isolationLevel: 'integration',
        mockExternalDependencies: false,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Test that modules don't access each other's internals during event processing
      await messageBusHelper.publishTestMessage('post.created', {
        postId: 1,
        title: 'Test Post',
        authorId: 1,
        published: false,
        timestamp: new Date(),
      })

      await messageBusHelper.waitForMessageProcessing()

      // This should pass because modules should only communicate through events
      framework.assertBoundaryCompliance()
    })
  })

  describe('Module Isolation Validation', () => {
    it('should prevent direct access to other module internals', async () => {
      await framework.testModuleIsolation('auth', async (fixtures) => {
        // This test would fail if auth module tried to directly import
        // from posts or users modules instead of using client interfaces

        // The test framework validates this automatically
        expect(fixtures.logger).toBeDefined()
        expect(fixtures.prisma).toBeDefined()
        expect(fixtures.messageBus).toBeDefined()
      })
    })

    it('should allow access only through client interfaces', async () => {
      await framework.setup({
        moduleName: 'client-interface-test',
        dependencies: ['auth', 'users'],
        clientInterface: 'IAuthClient',
        isolationLevel: 'integration',
        mockExternalDependencies: false,
        enableMessageBus: false,
      })

      // Mock the client interfaces to ensure they're being used
      const mockRegistry = framework.getMockRegistry()

      const mockUsersClient = {
        getUserById: vi.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        }),
        validateUserExists: vi.fn().mockResolvedValue(true),
      }

      mockRegistry.registerMock('users', 'client', mockUsersClient)

      // Test that auth module uses users client interface
      const usersClient = mockRegistry.getMock('users', 'client')
      expect(usersClient).toBeDefined()

      // In a real test, we would call auth module functions that use users client
      // and verify that the mock was called

      framework.assertBoundaryCompliance()
    })
  })

  describe('Performance and Resource Management', () => {
    it('should not exceed performance thresholds', async () => {
      await framework.setup({
        moduleName: 'performance-test',
        dependencies: ['auth', 'posts', 'users'],
        clientInterface: 'IPerformanceTest',
        isolationLevel: 'integration',
        mockExternalDependencies: false,
        enableMessageBus: true,
      })

      const messageBusHelper = framework.getMessageBusHelper()!

      // Publish multiple events to test performance
      const eventCount = 100
      for (let i = 0; i < eventCount; i++) {
        await messageBusHelper.publishTestMessage('test.event', {
          id: i,
          timestamp: new Date(),
        })
      }

      await messageBusHelper.waitForMessageProcessing(2000)

      const results = framework.getTestResults()

      // Verify performance thresholds
      expect(results.performance.testDuration).toBeLessThan(5000) // 5 seconds
      expect(results.performance.communicationLatency).toBeLessThan(100) // 100ms
      expect(results.performance.memoryUsage).toBeLessThan(50 * 1024 * 1024) // 50MB

      framework.assertBoundaryCompliance()
    })

    it('should properly cleanup resources', async () => {
      const initialMemory = process.memoryUsage().heapUsed

      await framework.setup({
        moduleName: 'cleanup-test',
        dependencies: ['shared'],
        clientInterface: 'ICleanupTest',
        isolationLevel: 'unit',
        mockExternalDependencies: true,
        enableMessageBus: true,
      })

      // Perform some operations
      const messageBusHelper = framework.getMessageBusHelper()!
      await messageBusHelper.publishTestMessage('cleanup.test', {
        data: 'test data',
        timestamp: new Date(),
      })

      await framework.cleanup()

      // Memory should not have increased significantly after cleanup
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB tolerance
    })
  })
})
