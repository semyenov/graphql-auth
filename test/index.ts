/**
 * Test utilities index - exports all test helpers in one place
 */

// Core test utilities
export {
  createMockContext,
  createAuthContext,
  createTestServer,
  executeOperation,
  extractGraphQLData,
  hasGraphQLErrors,
  getGraphQLErrors,
  generateTestToken,
  gqlHelpers,
  type VariableValues,
} from './test-utils'

// Relay ID conversion utilities
export {
  toGlobalId,
  fromGlobalId,
  toUserId,
  toPostId,
  extractNumericId,
} from './relay-utils'

// Test data factory functions
export {
  createTestUser,
  createTestPost,
  createUserWithPosts,
  seedTestUsers,
} from './test-data'

// Re-export prisma test client
export { prisma } from './setup'
