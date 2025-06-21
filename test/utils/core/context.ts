/**
 * Test context creation utilities
 */

import { container } from 'tsyringe'
import type { Context } from '../../../src/graphql/context/context.types'
import type { ILogger } from '../../../src/core/services/logger.interface'
import { ConsoleLogger } from '../../../src/core/logging/console-logger'
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
    } as any,
    res: {
      headers: {},
      statusCode: 200,
    } as any,
    user: null,
    decodedToken: null,
    logger: logger.child({ test: true }),
    loaders: {
      users: new Map() as any,
      posts: new Map() as any,
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
export function createAuthContext(userIdOrValue: number | { value: number } = 1, overrides: Partial<Context> = {}): Context {
  const userId = typeof userIdOrValue === 'number' ? userIdOrValue : userIdOrValue.value
  const token = generateTestToken(userId)
  const payload = {
    userId,
    email: `user${userId}@example.com`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }

  return createMockContext({
    user: { id: userId, email: payload.email } as any,
    userId: typeof userIdOrValue === 'object' ? userIdOrValue : { value: userId },
    decodedToken: payload,
    security: {
      isAuthenticated: true,
      userId,
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
    } as any,
    ...overrides,
  })
}