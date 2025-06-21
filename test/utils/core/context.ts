/**
 * Test context creation utilities
 */

import type { DefaultContext } from '../../../src/graphql/context/context.types'
import { UserId } from '../../../src/types/value-objects'
import { generateTestToken } from './auth'

/**
 * Create a mock context for testing
 */
export function createMockContext(
  overrides: Partial<DefaultContext> = {},
): DefaultContext {
  return {
    req: {
      headers: {},
      method: 'POST',
      url: '/graphql',
      body: {},
      ip: '127.0.0.1',
    } as unknown as DefaultContext['req'],
    user: undefined,
    headers: {},
    method: 'POST',
    contentType: 'application/json',
    metadata: {
      ip: '127.0.0.1',
      userAgent: 'test',
      operationName: 'test',
      query: 'test',
      variables: {},
      startTime: Date.now(),
    },
    security: {
      isAuthenticated: false,
      userId: undefined,
      roles: [],
      permissions: [],
    },
    ...overrides,
  }
}

/**
 * Create an authenticated context for testing
 */
export function createAuthContext(
  userIdOrValue: number | UserId = 1,
  overrides: Partial<DefaultContext> = {},
): DefaultContext {
  const userId =
    typeof userIdOrValue === 'number' ? userIdOrValue : userIdOrValue.value
  const userIdVO =
    typeof userIdOrValue === 'number'
      ? UserId.create(userIdOrValue)
      : userIdOrValue
  const token = generateTestToken(userId)
  const payload = {
    userId,
    email: `user${userId}@example.com`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }

  return createMockContext({
    user: {
      id: userId,
      email: payload.email,
    } as unknown as DefaultContext['user'],
    userId: userIdVO,
    decodedToken: payload,
    security: {
      isAuthenticated: true,
      userId: userIdVO,
      roles: [],
      permissions: [],
    },
    req: {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'POST',
      url: '/graphql',
      body: {},
      ip: '127.0.0.1',
    } as unknown as DefaultContext['req'],
    ...overrides,
  })
}
