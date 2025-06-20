/**
 * GraphQL Context Factory
 * 
 * Creates enhanced GraphQL contexts following the IMPROVED-FILE-STRUCTURE.md specification.
 * This module is responsible for creating properly typed GraphQL contexts with proper
 * error handling, type safety, and comprehensive request processing.
 */

import { ContextFunction } from '@apollo/server'
import { IncomingMessage, ServerResponse } from 'http'
import { ValidationError } from '../../core/errors/types'
import { enhanceContext } from './context.utils'
import { getUserIdFromAuthHeaderAsync } from './context.auth'
import type { Context, GraphQLIncomingMessage } from './context.types'
import {
    createRequestMetadata,
    createRequestObject,
    createSecurityContext,
    determineHttpMethod,
    extractContentType,
    extractHeaders,
    isValidRequest
} from './context.utils'

/**
 * Creates an enhanced GraphQL context with comprehensive error handling and type safety
 * 
 * This function processes incoming HTTP requests and transforms them into
 * properly typed GraphQL contexts with security, metadata, and request information.
 * 
 * @param params - Apollo Server context function parameters
 * @returns Promise resolving to the enhanced Context object
 * 
 * @throws Error if the request structure is invalid
 * 
 * @example
 * ```typescript
 * const server = new ApolloServer({
 *   typeDefs,
 *   resolvers,
 *   context: createContext,
 * });
 * ```
 */
export const createContext: ContextFunction<[{ req: IncomingMessage; res: ServerResponse }], Context> = async ({ req }) => {
    // Cast to our extended type for body access
    const graphqlReq = req as GraphQLIncomingMessage

    // Validate incoming request structure
    if (!isValidRequest(graphqlReq)) {
        throw new ValidationError(['Invalid request structure provided to context creation'])
    }

    try {
        // Extract and normalize request components
        const requestComponents = extractRequestComponents(graphqlReq)

        // Create authentication context
        const authContext = await createAuthenticationContext(requestComponents)

        // Assemble final context
        const context = assembleContext(requestComponents, authContext)

        // Enhance context with Prisma client and DataLoaders
        return enhanceContext(context)
    } catch (error) {
        // Enhanced error handling with context information
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during context creation'
        throw new Error(`Context creation failed: ${errorMessage}`)
    }
}

/**
 * Extracts and processes request components from the incoming request
 * 
 * @param req - The incoming GraphQL request
 * @returns Processed request components
 */
function extractRequestComponents(req: GraphQLIncomingMessage) {
    // Extract and normalize headers
    const headers = extractHeaders(req)

    // Determine HTTP method and content type
    const method = determineHttpMethod(req)
    const contentType = extractContentType(headers)

    // Extract GraphQL operation details
    const body = req.body
    const operationName = body?.operationName
    const variables = body?.variables

    // Create request metadata
    const metadata = createRequestMetadata(headers, operationName, variables)

    // Create request object
    const requestObject = createRequestObject(req, headers, method)

    return {
        headers,
        method,
        contentType,
        operationName,
        variables,
        metadata,
        requestObject,
    }
}

/**
 * Creates authentication context from request components
 * 
 * @param requestComponents - The processed request components
 * @returns Authentication context information
 */
async function createAuthenticationContext(requestComponents: ReturnType<typeof extractRequestComponents>) {
    // Attempt to get user ID from the request
    const authHeader = requestComponents.headers['authorization']
    const userId = await getUserIdFromAuthHeaderAsync(authHeader)
    const isAuthenticated = Boolean(userId)

    // Create security context
    const security = createSecurityContext(isAuthenticated, userId?.value || undefined)

    return {
        userId: userId || undefined,
        security,
    }
}

/**
 * Assembles the final context object from all components
 * 
 * @param requestComponents - The processed request components
 * @param authContext - The authentication context
 * @returns The complete Context object
 */
function assembleContext(
    requestComponents: ReturnType<typeof extractRequestComponents>,
    authContext: ReturnType<typeof createAuthenticationContext> extends Promise<infer T> ? T : never,
): Context {
    return {
        // Request information
        req: requestComponents.requestObject,
        headers: requestComponents.headers,
        method: requestComponents.method,
        contentType: requestComponents.contentType,
        metadata: requestComponents.metadata,

        // GraphQL operation details
        operationName: requestComponents.operationName,
        variables: requestComponents.variables,

        // Authentication and security
        security: authContext.security,
        userId: authContext.userId,
        user: undefined, // Will be populated by resolvers if needed
    }
}