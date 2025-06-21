/**
 * GraphQL Context Factory
 *
 * Creates and enhances the GraphQL execution context with authentication,
 * authorization, and performance tracking capabilities.
 */

import type { HeaderMap } from '@apollo/server'
import type { HTTPMethod } from 'fetchdts'
import type { IncomingMessage, ServerResponse } from 'http'
import { container } from 'tsyringe'
import type { ILogger } from '../../app/services/logger.interface'
import { createDataLoaders } from '../../data/loaders'
import { prisma } from '../../prisma'
import type { UserId } from '../../types/value-objects'
import type { RequestMetadata, SecurityContext, User } from '../../types.d'
import { verifyToken } from '../../utils/jwt'
import type { Context, DefaultContext } from './context.types'

/**
 * Extract JWT token from Authorization header
 */
function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1] || null
}

/**
 * Create base context from HTTP request
 */
async function createBaseContext(
  req: IncomingMessage,
  _res: ServerResponse,
): Promise<DefaultContext> {
  const headers = req.headers as Record<string, string>

  return {
    // Request information
    req: {
      url: req.url || '/',
      method: (req.method || 'POST') as HTTPMethod,
      headers,
      body: undefined, // Will be populated by Apollo Server
    },
    headers: new Map(Object.entries(headers)) as HeaderMap,
    method: (req.method || 'POST') as HTTPMethod,
    contentType: headers['content-type'] || 'application/json',
    metadata: {
      timestamp: Date.now(),
      userAgent: headers['user-agent'] || 'unknown',
    } as RequestMetadata,

    // Security context (to be enhanced)
    security: {
      isAuthenticated: false,
      roles: [],
      permissions: [],
    } as SecurityContext,

    // Additional request info for rate limiting
    request: {
      ip: req.socket.remoteAddress,
      headers: req.headers,
      connection: {
        remoteAddress: req.socket.remoteAddress,
      },
    },

    // Client information
    ipAddress: req.socket.remoteAddress,
  }
}

/**
 * Enhance context with authentication
 */
async function enhanceWithAuth(
  context: DefaultContext,
  logger: ILogger,
): Promise<DefaultContext> {
  const token = extractToken(context.headers.get('authorization') || undefined)

  if (!token) {
    return context
  }

  try {
    const payload = verifyToken(token)

    if (!payload.userId) {
      logger.warn('Invalid token payload - missing userId')
      return context
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      logger.warn('User not found for valid token', { userId: payload.userId })
      return context
    }

    // Create enhanced context with user info
    return {
      ...context,
      userId: { value: user.id } as UserId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        status: 'active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
      } as User,
      security: {
        isAuthenticated: true,
        roles: [user.role || 'user'],
        permissions: [], // Would be populated based on role
      } as SecurityContext,
    }
  } catch (error) {
    logger.warn('Token verification failed', { error })
    return context
  }
}

/**
 * Create GraphQL context factory
 */
export async function createContext({
  req,
  res,
}: {
  req: IncomingMessage
  res: ServerResponse
}): Promise<Context<Record<string, unknown>>> {
  const logger = container.resolve<ILogger>('ILogger')

  // Create base context
  const baseContext = await createBaseContext(req, res)

  // Enhance with authentication
  const authContext = await enhanceWithAuth(baseContext, logger)

  // Add DataLoaders
  const loaders = createDataLoaders(prisma)

  // Create final enhanced context
  const context: Context<Record<string, unknown>> = {
    ...authContext,
    loaders,
    performance: {
      startTime: Date.now(),
      requestId: crypto.randomUUID(),
    },
  }

  return context
}

/**
 * Create mock context for testing
 */
export function createMockContext(
  overrides?: Partial<Context<Record<string, unknown>>>,
): Context<Record<string, unknown>> {
  const defaultContext: Context<Record<string, unknown>> = {
    req: {
      url: '/graphql',
      method: 'POST' as HTTPMethod,
      headers: {},
      body: undefined,
    },
    headers: new Map() as HeaderMap,
    method: 'POST' as HTTPMethod,
    contentType: 'application/json',
    metadata: {
      timestamp: Date.now(),
      userAgent: 'test-agent',
    } as RequestMetadata,
    security: {
      isAuthenticated: false,
      roles: [],
      permissions: [],
    } as SecurityContext,
    loaders: createDataLoaders(prisma),
    performance: {
      startTime: Date.now(),
      requestId: 'test-request-id',
    },
  }

  return {
    ...defaultContext,
    ...overrides,
  }
}
