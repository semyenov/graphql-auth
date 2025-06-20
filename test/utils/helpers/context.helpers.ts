import { ApolloServer } from '@apollo/server'
import jwt from 'jsonwebtoken'
import { env } from '../../../src/app/config/environment'
import { enhanceContext } from '../../../src/context/context-direct'
import type { Context } from '../../../src/context/types.d'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import { getSchema } from '../../../src/graphql/schema'

// Create test context
export function createMockContext(overrides?: Partial<Context>): Context {
    const defaultContext: Context = {
        req: {
            url: '/graphql',
            method: 'POST',
            headers: {},
            body: undefined,
        },
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        contentType: 'application/json',
        metadata: {
            ip: '127.0.0.1',
            userAgent: 'test-user-agent',
            startTime: Date.now(),
        },
        security: {
            isAuthenticated: false,
            permissions: ['read:public'],
            roles: ['user'],
        },
    }

    const baseContext: Context = {
        ...defaultContext,
        ...overrides,
    }

    return enhanceContext(baseContext)
}

// Create authenticated context
export function createAuthContext(userId: number | UserId): Context {
    const userIdObject =
        typeof userId === 'number' ? UserId.create(userId) : userId
    const token = generateTestToken(userIdObject)

    return createMockContext({
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        req: {
            url: '/graphql',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: undefined,
        },
        userId: userIdObject, // Add the top-level userId property
        security: {
            isAuthenticated: true,
            userId: userIdObject,
            userEmail: undefined, // Would typically be filled by auth middleware
            roles: ['user'], // Default role for authenticated users
            permissions: [],
        },
    })
}

// Create test server
export function createTestServer() {
    return new ApolloServer<Context>({
        schema: getSchema(),
        introspection: true,
    })
}

// Generate test JWT token
export function generateTestToken(userId: UserId): string {
    return jwt.sign({ userId: userId.value }, env.APP_SECRET)
}

export { Context }
