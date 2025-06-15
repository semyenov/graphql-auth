import { ContextFunction } from '@apollo/server'
import type { HTTPMethod } from 'fetchdts'
import { getUserId } from '../utils'
import type { Context, GraphQLIncomingMessage, RequestMetadata, SecurityContext } from './types.d'

// Create enhanced context with proper error handling and type safety
export const createContext: ContextFunction<[{ req: GraphQLIncomingMessage }], Context> = async ({ req }) => {
    // Access the properly typed request body
    const body = req.body;

    const operationName = body?.operationName;
    const variables = body?.variables;

    const headers = Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : String(value)]));

    // Extract method and URL with defaults
    const method = (req.method as HTTPMethod) || 'POST'
    const url = req.url || '/graphql'
    const contentType = headers['content-type'] || 'application/json'

    // Create request metadata
    const metadata: RequestMetadata = {
        ip: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
        userAgent: headers['user-agent'] || 'unknown',
        operationName: undefined, // Will be set later from GraphQL request
        query: undefined, // Will be set later from GraphQL request
        variables: undefined, // Will be set later from GraphQL request
        startTime: Date.now(),
    }

    // Create basic context structure
    const basicContext = {
        req: {
            url,
            method,
            headers,
            body: req.body,
        },
        headers,
        method,
        contentType,
        metadata,
    }

    // Get user ID and create security context
    const userId = getUserId(basicContext as Context)
    const isAuthenticated = Boolean(userId)

    const security: SecurityContext = {
        isAuthenticated,
        userId: userId || undefined,
        userEmail: undefined, // Will be populated if needed
        roles: [], // Will be populated based on user data
        permissions: [], // Will be populated based on user roles
    }

    // Create final enhanced context
    const context: Context = {
        ...basicContext,

        security,
        userId: userId || undefined,
        user: undefined, // Will be populated by resolvers if needed
        operationName,
        variables,
    }

    return context
} 