import {
  createError,
  defineEventHandler,
  fromNodeMiddleware,
  getRouterParam,
  type Router,
  readBody,
} from 'h3'
import { Services } from '@/app/config/service-registry'

/**
 * Mount OIDC routes on an H3 router
 */
export function mountOidcRoutesH3(router: Router) {
  const provider = Services.oidcProvider.getProvider()

  // Convert oidc-provider callback to H3 middleware
  const oidcCallback = fromNodeMiddleware(provider.callback())

  // Mount OIDC provider routes
  router.use('/oidc/**', oidcCallback)
  router.use('/.well-known/openid-configuration', oidcCallback)
  router.use('/.well-known/jwks.json', oidcCallback)

  // Add interaction endpoints
  router.get(
    '/oidc/interaction/:uid',
    defineEventHandler(async (event) => {
      try {
        const uid = getRouterParam(event, 'uid')
        if (!uid) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Missing interaction UID',
          })
        }

        const details = await provider.interactionDetails(
          event.node.req,
          event.node.res,
        )
        const { prompt, params } = details

        // Here you would render your login/consent UI
        // For now, we'll return JSON
        return {
          uid,
          prompt,
          params,
          loginUrl: `/auth/login?interaction=${uid}`,
          consentUrl: `/auth/consent?interaction=${uid}`,
        }
      } catch (err) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Interaction error',
          data: err,
        })
      }
    }),
  )

  router.post(
    '/oidc/interaction/:uid/login',
    defineEventHandler(async (event) => {
      try {
        const uid = getRouterParam(event, 'uid')
        if (!uid) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Missing interaction UID',
          })
        }

        const body = await readBody(event)
        const { email, password } = body

        // Authenticate user using existing services
        const { prisma } = await import('@/modules/shared/database')

        try {
          // Find user
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user) {
            throw createError({
              statusCode: 401,
              statusMessage: 'Invalid credentials',
            })
          }

          // Verify password
          const isValid = await Services.password.verify(
            password,
            user.password,
          )

          if (!isValid) {
            throw createError({
              statusCode: 401,
              statusMessage: 'Invalid credentials',
            })
          }

          const result = {
            login: {
              accountId: user.id.toString(),
            },
          }

          await provider.interactionFinished(
            event.node.req,
            event.node.res,
            result,
          )
        } catch (authError) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
          })
        }
      } catch (err) {
        if (err instanceof Error && 'statusCode' in err) {
          throw err
        }
        throw createError({
          statusCode: 500,
          statusMessage: 'Login error',
          data: err,
        })
      }
    }),
  )

  router.post(
    '/oidc/interaction/:uid/consent',
    defineEventHandler(async (event) => {
      try {
        const uid = getRouterParam(event, 'uid')
        if (!uid) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Missing interaction UID',
          })
        }

        await provider.interactionDetails(event.node.req, event.node.res)

        const consent: Record<string, unknown> = {}
        consent.rejectedScopes = []
        consent.rejectedClaims = []
        consent.replace = false

        const result = { consent }
        await provider.interactionFinished(
          event.node.req,
          event.node.res,
          result,
        )
      } catch (err) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Consent error',
          data: err,
        })
      }
    }),
  )

  return router
}
