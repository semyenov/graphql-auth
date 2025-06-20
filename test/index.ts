/**
 * Test utilities index - exports all test helpers in one place
 */

// Core test utilities
export {
  createAuthContext, createMockContext, createTestServer,
  executeOperation,
  extractGraphQLData, generateTestToken, getGraphQLErrors, gqlHelpers, hasGraphQLErrors, type VariableValues
} from './test-utils'

// Relay ID conversion utilities
export {
  extractNumericId, fromGlobalId, toGlobalId, toPostId, toUserId
} from './relay-utils'

// Test data factory functions
export {
  createTestPost, createTestUser, createUserWithPosts,
  seedTestUsers
} from './test-data'

// Re-export prisma test client
export { prisma } from './setup'
