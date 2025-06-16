import type {
    GraphQLRequestContext,
    GraphQLRequestListener
} from '@apollo/server'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import { startStandaloneServer } from '@apollo/server/standalone'
import consola from 'consola'
import type { HTTPMethod, MimeType } from 'fetchdts'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'
import { SERVER } from './constants'
import { createContext } from './context/creation'
import type { Context } from './context/types.d'
import { env, isDevelopment } from './environment'
import { isBaseError } from './errors'
import { disconnectPrisma } from './prisma'
import { schema } from './schema'

// Enhanced Apollo Server with better typing
const server = new ApolloServer<Context>({
    schema,
    plugins: [
        ApolloServerPluginInlineTrace(),
        // Custom plugin for request/response logging with fetchdts types
        {
            async requestDidStart(): Promise<GraphQLRequestListener<Context>> {
                return {
                    async willSendResponse(requestContext: GraphQLRequestContext<Context>): Promise<void> {
                        const { request, contextValue } = requestContext
                        const method = contextValue.method as HTTPMethod
                        const contentType = contextValue.contentType as MimeType

                        consola.info(`${method} ${contextValue.req.url}`, {
                            contentType,
                            operationName: request.operationName,
                            variables: request.variables ? Object.keys(request.variables) : [],
                        })
                    },
                    async didEncounterErrors(requestContext: GraphQLRequestContext<Context>): Promise<void> {
                        const { errors, contextValue } = requestContext
                        if (errors) {
                            consola.error(`GraphQL errors on ${contextValue.method} ${contextValue.req.url}:`, {
                                errors: errors.map((error: GraphQLError) => ({
                                    message: error.message,
                                    path: error.path,
                                    locations: error.locations
                                }))
                            })
                        }
                    }
                }
            }
        }
    ],
    introspection: true,
    allowBatchedHttpRequests: true,
    logger: consola.withTag('apollo'),
    formatError: (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
        // Check if it's one of our custom errors
        if (isBaseError(error)) {
            return {
                message: error.message,
                extensions: {
                    code: error.code,
                    statusCode: error.statusCode,
                    timestamp: new Date().toISOString(),
                    ...(isDevelopment && {
                        stacktrace: error.stack
                    })
                },
                path: formattedError.path,
                locations: formattedError.locations,
            }
        }

        // Log unexpected errors
        if (!isDevelopment) {
            consola.error('Unexpected GraphQL Error:', error)
        }

        // Return a well-structured error response
        return {
            ...formattedError,
            extensions: {
                ...formattedError.extensions,
                code: formattedError.extensions?.code || 'INTERNAL_ERROR',
                timestamp: new Date().toISOString(),
                ...(isDevelopment && error instanceof GraphQLError && {
                    stacktrace: error.extensions?.stacktrace || error.stack
                })
            }
        }
    }
})

// Enhanced server startup with better error handling and type safety
async function startServer() {
    try {
        const { url } = await startStandaloneServer(server, {
            listen: {
                port: env.PORT || SERVER.DEFAULT_PORT,
                host: env.HOST || SERVER.DEFAULT_HOST
            },
            context: createContext,
        })

        consola.success(`🚀 GraphQL Server ready at: ${url}`)

        if (isDevelopment) {
            consola.info(`📊 GraphQL Playground: ${url}`)
            consola.info(`🔍 GraphQL Introspection: ${url}?query={__schema{types{name}}}`)
            consola.info(`⭐️ Sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`)
        }

    } catch (error) {
        consola.error('Failed to start server:', error)
        await cleanup()
        process.exit(1)
    }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    try {
        await server.stop()
        await disconnectPrisma()
        consola.success('Server shutdown complete')
    } catch (error) {
        consola.error('Error during cleanup:', error)
    }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
    consola.info('Received SIGINT, shutting down gracefully...')
    await cleanup()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    consola.info('Received SIGTERM, shutting down gracefully...')
    await cleanup()
    process.exit(0)
})

process.on('uncaughtException', (error) => {
    consola.error('Uncaught Exception:', error)
    cleanup().finally(() => process.exit(1))
})

process.on('unhandledRejection', (reason, promise) => {
    consola.error('Unhandled Rejection at:', promise, 'reason:', reason)
    cleanup().finally(() => process.exit(1))
})

// Start the server
startServer()

