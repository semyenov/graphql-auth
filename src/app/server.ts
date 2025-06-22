import { ApolloServer, HeaderMap } from '@apollo/server'
import {
  createApp,
  createError,
  createRouter,
  defineEventHandler,
  getQuery,
  handleCors,
  readBody,
  toNodeListener,
} from 'h3'
import { createServer } from 'http'
import 'reflect-metadata'

// Import configuration and DI
import type { BaseContext } from '@apollo/server'
import { mountOidcRoutesH3 } from '../../modules/oidc/oidc.h3'
import { createContext } from '../graphql/context/context.factory'
import { buildSchema } from '../graphql/schema'
import { getConfig } from './config/config'
import { configureContainer } from './config/container'

async function bootstrap() {
  try {
    console.log('🚀 Starting application...')

    // Configure dependency injection
    configureContainer()
    console.log('✅ Dependency injection configured')

    // Get configuration
    const config = getConfig()
    console.log(`📝 Environment: ${config.server.environment || 'development'}`)

    // Create h3 app and router
    const app = createApp()
    const router = createRouter()

    // Create Apollo Server
    const apolloServer = new ApolloServer<BaseContext>({
      schema: buildSchema(),
      introspection: config.server.environment !== 'production',
    })

    await apolloServer.start()

    // Health check endpoint
    router.get(
      '/health',
      defineEventHandler(async () => {
        const health = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: config.server.environment || 'development',
          services: {
            database: 'checking...',
          },
        }

        try {
          const { prisma } = await import('../prisma')
          await prisma.$queryRaw`SELECT 1`
          health.services.database = 'connected'
        } catch (error) {
          health.status = 'degraded'
          health.services.database = 'disconnected'
        }

        return health
      }),
    )

    // GraphQL endpoint
    router.post(
      '/graphql',
      defineEventHandler(async (event) => {
        // Handle CORS
        if (handleCors(event, { origin: '*', credentials: true })) {
          return createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
          })
        }

        // Get the body
        const body = await readBody(event)

        // Execute GraphQL request
        const response = await apolloServer.executeHTTPGraphQLRequest({
          httpGraphQLRequest: {
            method: event.method || 'POST',
            headers: new HeaderMap(event.headers.entries()),
            body,
            search: getQuery(event),
          },
          context: () =>
            createContext({ req: event.node.req, res: event.node.res }),
        })

        // Set headers
        for (const [key, value] of response.headers) {
          event.node.res.setHeader(key, value)
        }

        // Set status and return body
        event.node.res.statusCode = response.status || 200

        if (response.body.kind === 'complete') {
          return response.body.string
        } else {
          // Handle multipart responses
          for await (const chunk of response.body.asyncIterator) {
            event.node.res.write(chunk)
          }
          event.node.res.end()
        }
      }),
    )

    // Support GraphQL GET requests for introspection
    router.get(
      '/graphql',
      defineEventHandler(async (event) => {
        // Handle CORS
        if (handleCors(event, { origin: '*', credentials: true })) {
          return createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
          })
        }

        const response = await apolloServer.executeHTTPGraphQLRequest({
          httpGraphQLRequest: {
            method: 'GET',
            headers: new HeaderMap(event.headers.entries()),
            body: null,
            search: getQuery(event),
          },
          context: () =>
            createContext({ req: event.node.req, res: event.node.res }),
        })

        // Set headers
        for (const [key, value] of response.headers) {
          event.node.res.setHeader(key, value)
        }

        // Set status and return body
        event.node.res.statusCode = response.status || 200

        if (response.body.kind === 'complete') {
          return response.body.string
        }
      }),
    )

    // Mount OIDC routes using H3 native handlers
    mountOidcRoutesH3(router)

    // Use the router
    app.use(router)

    // Create HTTP server
    const httpServer = createServer(toNodeListener(app))

    const port = config.server.port || 4000
    const host = config.server.host || 'localhost'

    httpServer.listen(port, () => {
      console.log(`🚀 GraphQL Server ready at: http://${host}:${port}/graphql`)
      console.log(`🔐 OIDC Provider ready at http://${host}:${port}/oidc`)
      console.log(
        `📋 OIDC Discovery at http://${host}:${port}/.well-known/openid-configuration`,
      )
    })

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Signal received: closing servers')
      await apolloServer.stop()
      httpServer.close(() => {
        console.log('Servers closed')
        process.exit(0)
      })
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  } catch (error) {
    console.error('❌ Failed to start application:', error)
    process.exit(1)
  }
}

// Start the application
bootstrap()
