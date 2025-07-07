import type { IncomingMessage, ServerResponse } from 'node:http'
import { container } from 'tsyringe'
import type { IOidcProviderService } from './services/oidc-provider.service'

interface ExpressLikeApp {
  use(path: string, handler: unknown): void
  get(path: string, handler: unknown): void
  post(path: string, handler: unknown): void
}

interface ExpressRequest extends IncomingMessage {
  params: Record<string, string>
  body: Record<string, unknown>
}

interface ExpressResponse extends ServerResponse {
  json(data: unknown): void
  status(code: number): ExpressResponse
}

export function createOidcMiddleware() {
  const oidcService = container.resolve<IOidcProviderService>(
    'IOidcProviderService',
  )
  const provider = oidcService.getProvider()

  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next?: () => void,
  ) => {
    // Check if this is an OIDC route
    if (req.url?.startsWith('/oidc') || req.url?.startsWith('/.well-known')) {
      try {
        // Handle OIDC requests
        await provider.callback()(req, res)
      } catch (error) {
        if (next) {
          next()
        } else {
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      }
    } else if (next) {
      next()
    }
  }
}

// Helper function to mount OIDC routes on the app
export function mountOidcRoutes(app: ExpressLikeApp) {
  const oidcService = container.resolve<IOidcProviderService>(
    'IOidcProviderService',
  )
  const provider = oidcService.getProvider()

  // Mount all OIDC routes
  app.use('/oidc', provider.callback())
  app.use('/.well-known/openid-configuration', provider.callback())
  app.use('/.well-known/jwks.json', provider.callback())

  // Add interaction endpoints
  app.get(
    '/oidc/interaction/:uid',
    async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const details = await provider.interactionDetails(req, res)
        const { uid, prompt, params } = details

        // Here you would render your login/consent UI
        // For now, we'll return JSON
        res.json({
          uid,
          prompt,
          params,
          loginUrl: `/auth/login?interaction=${uid}`,
          consentUrl: `/auth/consent?interaction=${uid}`,
        })
      } catch (err) {
        res.status(500).json({ error: 'interaction_error' })
      }
    },
  )

  app.post(
    '/oidc/interaction/:uid/login',
    async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const { uid: _uid } = req.params

        // Authenticate user (you'll need to implement this based on your auth service)
        // For now, this is a placeholder
        const userId = '1' // Replace with actual authentication

        const result = {
          login: {
            accountId: userId,
          },
        }

        await provider.interactionFinished(req, res, result)
      } catch (err) {
        res.status(500).json({ error: 'login_error' })
      }
    },
  )

  app.post(
    '/oidc/interaction/:uid/consent',
    async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        await provider.interactionDetails(req, res)

        const consent: Record<string, unknown> = {}
        consent.rejectedScopes = []
        consent.rejectedClaims = []
        consent.replace = false

        const result = { consent }
        await provider.interactionFinished(req, res, result)
      } catch (err) {
        res.status(500).json({ error: 'consent_error' })
      }
    },
  )

  return app
}
