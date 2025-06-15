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
import { createContext } from './context/creation'
import type { Context } from './context/types'
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
        // Enhanced error formatting with fetchdts awareness
        consola.error('GraphQL Error:', formattedError)

        // Return a well-structured error response
        return {
            ...formattedError,
            extensions: {
                ...formattedError.extensions,
                code: formattedError.extensions?.code || 'INTERNAL_ERROR',
                timestamp: new Date().toISOString(),
                ...(process.env.NODE_ENV === 'development' && error instanceof GraphQLError && {
                    stacktrace: error.extensions?.stacktrace
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
                port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
                host: process.env.HOST || 'localhost'
            },
            context: createContext,
        })

        consola.success(`🚀 GraphQL Server ready at: ${url}`)
        consola.info(`📊 GraphQL Playground: ${url}graphql`)
        consola.info(`🔍 GraphQL Introspection: ${url}graphql?query={__schema{types{name}}}`)
        consola.info(`⭐️ Sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`)

        // Health check endpoint info
        consola.info(`💓 Health check available at: ${url}health`)

    } catch (error) {
        consola.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
    consola.info('Received SIGINT, shutting down gracefully...')
    await server.stop()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    consola.info('Received SIGTERM, shutting down gracefully...')
    await server.stop()
    process.exit(0)
})

// Start the server
startServer()

