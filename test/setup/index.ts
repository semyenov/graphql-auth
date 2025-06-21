/**
 * Test utilities index - exports all test helpers in one place
 */

// Re-export prisma test client
export { prisma } from '../../src/prisma'
// Test data factory functions
export {
  createTestPost,
  createTestUser,
  createUserWithPosts,
  seedTestUsers,
} from '../utils/factories/test.factory'
// Core test utilities
export {
  createAuthContext,
  createMockContext,
  createTestServer,
  executeOperation,
  extractGraphQLData,
  generateTestToken,
  getGraphQLErrors,
  gqlHelpers,
  hasGraphQLErrors,
  type VariableValues,
} from '../utils/helpers/database.helpers'
// Relay ID conversion utilities
export {
  extractNumericId,
  fromGlobalId,
  toGlobalId,
  toPostId,
  toUserId,
} from '../utils/helpers/relay.helpers'
