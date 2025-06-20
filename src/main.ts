/**
 * Application Entry Point
 * 
 * Bootstraps the application with clean architecture.
 */

import { ApolloServer, HeaderMap } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import 'reflect-metadata'

// Import configuration and DI
import { createContext } from './context/creation'
import { getConfigInstance } from './infrastructure/config/configuration'
import { configureContainer } from './infrastructure/config/container'

// Import schema
import { getSchema } from './graphql/schema'

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
    const httpServer = createServer()

    // Create Apollo Server
    const apolloServer = new ApolloServer({
      schema: getSchema(),
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
    httpServer.on('request', async (req, res) => {
      const context = await createContext({ req, res: res as unknown as ServerResponse })

      return apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          method: req.method || 'POST',
          headers: new Map(Object.entries(req.headers)) as unknown as HeaderMap,
          body: await readBody(req),
          search: getQuery(req),
        },
        context: async () => context,
      })
    })

    // Health check endpoint
    httpServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      if (req.url === '/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      if (req.url === '/graphql') {
        return apolloServer.executeHTTPGraphQLRequest({
          httpGraphQLRequest: {
            method: req.method || 'POST',
            headers: new Map(Object.entries(req.headers)) as unknown as HeaderMap,
            body: await readBody(req),
            search: getQuery(req),
          },
          context: async () => createContext({ req: req as unknown as IncomingMessage, res: res as unknown as ServerResponse }),
        })
      }

      return new Response(null, {
        status: 404,
      })
    })

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