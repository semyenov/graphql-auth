/**
 * Application Entry Point
 * 
 * Bootstraps the application with clean architecture.
 */

import 'reflect-metadata'
import { ApolloServer } from '@apollo/server'
import { createH3App } from 'h3'
import { createServer } from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { applyWSSHandler } from '@graphql-ws/ws/lib/use/ws'
import { WebSocketServer } from 'ws'

// Import configuration and DI
import { configureContainer } from './infrastructure/config/container'
import { getConfigInstance } from './infrastructure/config/configuration'
import { createGraphQLContext } from './infrastructure/graphql/context/graphql-context'

// Import schema
import { schema } from './infrastructure/graphql/schema'

async function bootstrap() {
  try {
    console.log('🚀 Starting application...')

    // Configure dependency injection
    configureContainer()
    console.log('✅ Dependency injection configured')

    // Get configuration
    const config = getConfigInstance()
    console.log(`📝 Environment: ${config.server.environment}`)

    // Create HTTP server
    const app = createH3App()
    const httpServer = createServer(app)

    // Create WebSocket server
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    })

    // Create Apollo Server
    const apolloServer = new ApolloServer({
      schema,
      introspection: config.server.environment !== 'production',
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
      formatError: (error) => {
        // Log errors in development
        if (config.server.environment === 'development') {
          console.error('GraphQL Error:', error)
        }
        return error
      },
    })

    // Start Apollo Server
    await apolloServer.start()
    console.log('✅ Apollo Server started')

    // Apply GraphQL middleware
    app.use('/graphql', async (req) => {
      const context = await createGraphQLContext(req)
      
      return apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          method: req.method || 'POST',
          headers: req.headers,
          body: await readBody(req),
          search: getQuery(req),
        },
        context: async () => context,
      })
    })

    // Apply WebSocket handler for subscriptions
    applyWSSHandler({
      server: wsServer,
      schema,
      context: async (ctx) => {
        // Create context for WebSocket connections
        return createGraphQLContext(ctx.extra.request)
      },
    })

    // Health check endpoint
    app.use('/health', () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }))

    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(config.server.port, resolve)
    })

    console.log(`🚀 Server ready at http://localhost:${config.server.port}/graphql`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${config.server.port}/graphql`)

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server')
      await apolloServer.stop()
      httpServer.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('❌ Failed to start application:', error)
    process.exit(1)
  }
}

// Helper functions for H3
async function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

function getQuery(req: any): string {
  const url = new URL(req.url || '', `http://localhost`)
  return url.search
}

// Start the application
bootstrap()