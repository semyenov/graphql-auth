import { ApolloServer } from '@apollo/server'
import { createApp, createRouter, defineEventHandler, toWebHandler, readBody } from 'h3'
import { type Context, createContext } from './context'
import { schema } from './schema'
import { apiRouter } from './h3-routes'

// Create H3 app
export const app = createApp()

// Create router
const router = createRouter()
app.use(router)

// Add REST API routes
app.use(apiRouter)

// Create Apollo Server
const server = new ApolloServer<Context>({ schema })

// Start Apollo Server
await server.start()

// Add GraphQL endpoint
router.post('/graphql', defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Create context from H3 event
        const context = createContext({
            req: {
                url: '/graphql',
                method: 'POST',
                headers: event.node.req.headers as Record<string, string>,
                body
            }
        })

        // Execute GraphQL
        const result = await server.executeOperation(
            {
                query: body.query,
                variables: body.variables,
                operationName: body.operationName,
            },
            { contextValue: context }
        )

        return result
    } catch (error) {
        return {
            errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
        }
    }
}))

// Add a health check endpoint
router.get('/', defineEventHandler(() => {
    return {
        message: '🚀 GraphQL Auth Server with H3',
        endpoints: {
            graphql: '/graphql',
            playground: 'Use GraphQL Playground or Apollo Studio'
        }
    }
}))

// Create Web Handler for Bun
const handler = toWebHandler(app)

// Create Bun server
const bunServer = Bun.serve({
    port: 3000,
    fetch: handler as (request: Request) => Response | Promise<Response>,
})

console.log(`🚀 H3 + GraphQL Server ready at: http://localhost:${bunServer.port}`)
console.log(`📊 GraphQL endpoint: http://localhost:${bunServer.port}/graphql`)
console.log(`🔗 REST API endpoints:`)
console.log(`   • GET /api/health - Health check`)
console.log(`   • GET /api/users - List all users`)
console.log(`   • GET /api/posts - List posts with pagination`)
console.log(`   • POST /api/posts/:id/view - Increment post views`)
console.log(`   • GET /api/me - Protected endpoint`)
console.log(`⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`)
