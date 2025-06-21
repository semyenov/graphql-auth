/**
 * Test context creation utilities
 */

import { container } from 'tsyringe'
import { ConsoleLogger } from '../../../src/core/logging/console-logger'
import type { ILogger } from '../../../src/core/services/logger.interface'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import type { Context } from '../../../src/graphql/context/context.types'
import { generateTestToken } from './auth'

// Get logger from container
const getLogger = () => {
  if (!container.isRegistered('ILogger')) {
    container.registerSingleton<ILogger>('ILogger', ConsoleLogger)
  }
  return container.resolve<ILogger>('ILogger')
}

/**
 * Create a mock context for testing
 */
export function createMockContext(overrides: Partial<Context> = {}): Context {
  const logger = getLogger()
  return {
    req: {
      headers: {},
      method: 'POST',
      url: '/graphql',
      body: {},
      ip: '127.0.0.1',
    } as unknown as Context['req'],
    res: {
      headers: {},
      statusCode: 200,
    } as unknown as Context['res'],
    user: null,
    decodedToken: null,
    logger: logger.child({ test: true }),
    loaders: {
      users: new Map() as unknown as Context['loaders']['users'],
      posts: new Map() as unknown as Context['loaders']['posts'],
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
  overrides: Partial<Context> = {},
): Context {
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
    user: { id: userId, email: payload.email } as unknown as Context['user'],
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
    } as unknown as Context['req'],
    ...overrides,
  })
}
