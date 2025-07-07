import 'reflect-metadata'

import type { HTTPGraphQLRequest } from '@apollo/server'
import { ApolloServer, type BaseContext, HeaderMap } from '@apollo/server'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import {
  createApp,
  createRouter,
  defineEventHandler,
  getHeaders,
  type HTTPMethod,
  handleCors,
  readBody,
  send,
  setHeader,
  setResponseStatus,
  toNodeListener,
} from 'h3'
import { listen } from 'listhen'
import { mountOidcRoutesH3 } from '@/modules/oidc/oidc.h3'
import { prisma } from '@/modules/shared/database'
import { createContext } from '../graphql/context/context.factory'
import {
  createComplexityLimitPlugin,
  createDepthLimitPlugin,
} from '../graphql/plugins/depth-limit.plugin'
import { buildSchema } from '../graphql/schema'
import { createCompressionMiddleware } from '../middleware/h3/compression.middleware'
import { createGraphQLRateLimiterMiddleware } from '../middleware/h3/rate-limiter.middleware'
import {
  createGraphQLLoggerMiddleware,
  createRequestLoggerMiddleware,
} from '../middleware/h3/request-logger.middleware'
import { createSecurityHeadersMiddleware } from '../middleware/h3/security-headers.middleware'
import { getConfig } from './config/config'
import { configureContainer } from './config/container'

async function bootstrap() {
  try {
    console.log('🚀 Starting H3 server...')

    // Configure dependency injection
    configureContainer()
    console.log('✅ Dependency injection configured')

    // Get configuration
    const config = getConfig()
    console.log(`📝 Environment: ${config.server.environment || 'development'}`)

    // Create h3 app and router
    const app = createApp()
    const router = createRouter()

    // Apply request logging first (for all requests)
    app.use('/**', createRequestLoggerMiddleware())
    app.use('/**', createGraphQLLoggerMiddleware())

    // Apply compression middleware
    app.use(
      '/**',
      createCompressionMiddleware({
        threshold: 1024, // Only compress responses larger than 1KB
        brotli: true,
        gzip: true,
      }),
    )

    // Apply security headers globally
    app.use('/**', createSecurityHeadersMiddleware())

    // Apply rate limiting to GraphQL endpoints
    app.use('/**', createGraphQLRateLimiterMiddleware())

    // Apply CORS globally
    app.use(
      '/**',
      defineEventHandler((event) => {
        handleCors(event, {
          origin: (process.env.CORS_ORIGIN || '*') as '*',
          credentials: true,
          methods: ['GET', 'POST', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        })
      }),
    )

    // Create Apollo Server
    const isDev = config.server.environment !== 'production'
    const apolloServer = new ApolloServer<BaseContext>({
      schema: buildSchema(),
      introspection: isDev,
      plugins: [
        // Security plugins (always enabled)
        createDepthLimitPlugin({ maxDepth: 10, skipIntrospection: true }),
        createComplexityLimitPlugin(1000),

        // Development plugins
        ...(isDev
          ? [
              ApolloServerPluginLandingPageLocalDefault({
                embed: true,
                includeCookies: true,
              }),
            ]
          : []),
      ],
    })

    await apolloServer.start()

    // Create a handler that converts Web Requests to Apollo Server format
    const handleGraphQLRequest = defineEventHandler(async (event) => {
      const { search } = new URL(event.path, 'http://localhost')
      const method = event.method.toUpperCase() as HTTPMethod
      const headers = getHeaders(event)
      const body = method === 'POST' ? await readBody(event) : null

      const httpGraphQLRequest: HTTPGraphQLRequest = {
        method,
        headers: new HeaderMap(
          Object.entries(headers).map(([key, value]) => [
            key.toLowerCase(),
            value || '',
          ]),
        ),
        body,
        search,
      }

      // Execute the GraphQL request
      const httpGraphQLResponse = await apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest,
        context: async () => {
          // Create context with complete req/res objects
          return createContext({
            req: event.node.req,
            res: event.node.res,
          })
        },
      })

      // Set response headers from Apollo
      httpGraphQLResponse.headers.forEach((value, key) => {
        setHeader(event, key, value)
      })

      // Set status code
      setResponseStatus(event, httpGraphQLResponse.status || 200)

      // Convert Apollo response body
      if (httpGraphQLResponse.body.kind === 'complete') {
        return send(event, httpGraphQLResponse.body.string)
      } else {
        const chunks: string[] = []
        for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
          chunks.push(chunk)
        }
        return send(event, chunks.join(''))
      }
    })

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
            graphql: 'running',
            oidc: 'running',
          },
        }

        try {
          await prisma.$queryRaw`SELECT 1`
          health.services.database = 'connected'
        } catch (error) {
          health.status = 'degraded'
          health.services.database = 'disconnected'
        }

        return health
      }),
    )

    // Mount GraphQL for both GET and POST
    router.get('/graphql', handleGraphQLRequest)
    router.post('/graphql', handleGraphQLRequest)

    // Mount OIDC routes
    mountOidcRoutesH3(router)

    // Default route
    router.get(
      '/',
      defineEventHandler(() => ({
        name: 'GraphQL Auth Server',
        version: '1.0.0',
        endpoints: {
          graphql: '/graphql',
          health: '/health',
          oidc: {
            discovery: '/.well-known/openid-configuration',
            jwks: '/.well-known/jwks.json',
            provider: '/oidc/*',
          },
        },
      })),
    )

    // Use the router
    app.use(router)

    const port = config.server.port || 4000
    const host = config.server.host || 'localhost'

    // Start server with listhen for better error handling
    const listener = await listen(toNodeListener(app), {
      port,
      hostname: host,
      showURL: false,
    })

    console.log(`🚀 Server ready at: ${listener.url}`)
    console.log(`📊 GraphQL endpoint: ${listener.url}graphql`)
    if (isDev) {
      console.log(`🎮 GraphiQL playground: ${listener.url}graphql`)
    }
    console.log(`💚 Health check: ${listener.url}health`)
    console.log(`🔐 OIDC Provider: ${listener.url}oidc`)
    console.log(
      `📋 OIDC Discovery: ${listener.url}.well-known/openid-configuration`,
    )

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n📪 Signal received: closing servers')
      await apolloServer.stop()
      await listener.close()
      console.log('✅ Servers closed')
      process.exit(0)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('EADDRINUSE') ||
        error.message.includes('address already in use')
      ) {
        const port = getConfig().server.port || 4000
        console.error(`\n❌ Port ${port} is already in use!`)
        console.error('\nTry one of these solutions:')
        console.error(`  1. Kill the process using port ${port}:`)
        console.error(`     lsof -ti:${port} | xargs kill -9`)
        console.error('\n  2. Use a different port:')
        console.error(`     PORT=3000 bun run dev:h3`)
        console.error('\n  3. Check if another server is running:')
        console.error(`     ps aux | grep "bun.*server"`)
      } else {
        console.error('❌ Failed to start application:', error.message)
      }
    } else {
      console.error('❌ Failed to start application:', error)
    }
    process.exit(1)
  }
}

// Start the application
bootstrap()
