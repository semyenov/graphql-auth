/**
 * GraphQL Context Factory
 *
 * Creates and enhances the GraphQL execution context with authentication,
 * authorization, and performance tracking capabilities.
 */

import type { HeaderMap } from '@apollo/server'
import type { HTTPMethod } from 'fetchdts'
import type { IncomingMessage, ServerResponse } from 'http'
import { Services } from '@/app/config/service-registry'
import { prisma } from '@/modules/shared/database'
import { createDataLoaders } from '@/modules/shared/loaders/loaders'
import type { UserId } from '@/types/value-objects'
import type { RequestMetadata, SecurityContext, User } from '@/types.d'
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
  const ipAddress = req.socket.remoteAddress
  const userAgent = req.headers['user-agent'] || 'unknown'
  const contentType = req.headers['content-type'] || 'application/json'
  const requestId = crypto.randomUUID()

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
    contentType,

    metadata: {
      userAgent,
      requestId,
      timestamp: Date.now(),
      startTime: Date.now(),
    } as RequestMetadata,

    // Security context (to be enhanced)
    security: {
      isAuthenticated: false,
      roles: [],
      permissions: [],
    } as SecurityContext,

    // Additional request info for rate limiting
    request: {
      ip: ipAddress,
      headers: req.headers,
      connection: {
        remoteAddress: ipAddress,
      },
    },

    // Client information
    ipAddress,
  }
}

/**
 * Enhance context with authentication
 */
async function enhanceWithAuth(
  context: DefaultContext,
): Promise<DefaultContext> {
  const logger = Services.logger.child({ context: 'auth' })
  const token = extractToken(context.headers.get('authorization') || undefined)

  if (!token) {
    return context
  }

  try {
    const payload = Services.token.verifyToken(token)

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
export const createContext = async ({
  req,
  res,
}: {
  req: IncomingMessage
  res: ServerResponse
}): Promise<DefaultContext> => {
  // Create base context
  const baseContext = await createBaseContext(req, res)

  // Enhance with authentication
  const authContext = await enhanceWithAuth(baseContext)

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
      startTime: Date.now(),
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
