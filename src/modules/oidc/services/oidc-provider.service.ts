import type { OidcClient, OidcSession } from '@prisma/client'
import Provider, {
  type Configuration,
  type KoaContextWithOIDC,
} from 'oidc-provider'
import { injectable } from 'tsyringe'
import { NotFoundError } from '@/app/errors/types'
import { prisma } from '@/modules/shared/database'
import type { User } from '@/types'
import type { OidcClientInput } from '../types/oidc.types'
import { createAdapter } from './prisma-adapter.service'

export interface IOidcProviderService {
  getProvider(): Provider
  listClients(): Promise<OidcClient[]>
  getClient(clientId: string): Promise<OidcClient>
  createClient(clientData: {
    clientId: string
    clientSecret?: string
    clientName: string
    redirectUris: string[]
  }): Promise<OidcClient>
  updateClient(
    clientId: string,
    updates: Partial<OidcClientInput>,
  ): Promise<OidcClient>
  deleteClient(clientId: string): Promise<void>
  getUserSessions(userId: number): Promise<OidcSession[]>
  revokeUserSession(userId: number, sessionId: string): Promise<void>
  revokeAllUserSessions(userId: number): Promise<void>
  findAccount(ctx: KoaContextWithOIDC, id: string): Promise<Account | undefined>
}

class Account {
  accountId: string
  user: User;
  [key: string]: unknown

  constructor(user: User) {
    this.accountId = user.id.toString()
    this.user = user
  }

  async claims() {
    return {
      sub: this.accountId,
      email: this.user.email,
      email_verified: this.user.emailVerified,
      name: this.user.name,
      preferred_username: this.user.email,
      updated_at: Math.floor(this.user.updatedAt.getTime() / 1000),
    }
  }

  static async findAccount(
    _ctx: KoaContextWithOIDC,
    id: string,
  ): Promise<Account | undefined> {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    })

    if (!user) return undefined
    return new Account(user)
  }
}

@injectable()
export class OidcProviderService implements IOidcProviderService {
  private provider: Provider

  constructor() {
    const configuration: Configuration = {
      adapter: (name: string) =>
        createAdapter(
          name as
            | 'Session'
            | 'AuthorizationCode'
            | 'AccessToken'
            | 'RefreshToken'
            | 'IdToken'
            | 'Client',
        ),

      // clients: [],

      cookies: {
        keys: [process.env.JWT_SECRET || 'your-secret-key'],
      },

      // Development-only JWKS - replace with proper keys in production
      jwks:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              keys: [
                {
                  kty: 'RSA',
                  kid: 'development-key-1',
                  use: 'sig',
                  alg: 'RS256',
                  n: 'xnK82U4TZpFV3jpeK-8V0bLkwX0-EDiIEuyQbNA6A1KlokRAe_vTfxr6DB5g54K9IbkGUmF9pPWyuNXlQMfI4846IaJCJl0s7hlF90xb3wXzUN3ASZM8bPitxA_twoB8dxJqkPpNUHCg7k4LUMwi8jLYJLqpBp-6lcjMFQdmcPld3WS8TbstZCmEV8p7RzpN0t7--Sa3A6IcbgwJOPr_7Pa0m_9UWK1eF-_dj6Tdp3WP_oHiap6tqJDwNQmqGPmXQCu9z_X3Vr4FYIHa98UBeL4wWCPCEKZBPXLgqQ2CS0iWlRmMsJTF6xe7KpKRnXFmjRbbmzmFAy6PoffJdw',
                  e: 'AQAB',
                  d: 'wKe7sGFZzC_dCJM0LecPe6R_dNcJxdXFZDJG4W8LNa5fxTcwIwOlSqbJPzxKlNLcvWxbN8cFOZMjgBhvXmjqSOVoF5p3qOy3XfaoKqokNa9K3xO3sAmNgm30v_D71stFN7oBJSbiNjVafC0OisxcQmaTBp3tqMfQxe0mNJsmIKHiLfkBvCL2rCeCEsdJzWV3fIrwJD6gWE5pwFZAjQXzteWba_1W5jp4JqVxcS3pDmDG7hQ7q0e8QbYnqWPU7BGHbiJOn9zo8Xz1xBIgLAAKRfEqvU9Z4P8cqvv-sGtu-6iwzm3YYRipn6DbYqDDenqWxzxVRkZXBZSKul7AOQ',
                  p: '9vEbCx92TiekSpdJ2r1x-LEaBQMIy3v84JMQawvCOiC_z0Sk5C3x9R3QKIlj1xM0a7Z9TrpKG4HtkdNKmLkOYfQkMpzgNIn1TE5sGhDKUILbPp4zdKV_8ggUZeNZ6kvALKfso06Wze97ETn0WjJiZmObGG1u37hu5bqLlNlr78s',
                  q: 'zWY6F94dHqt9cJvqycnWYSDgnskK6BLqlPd2e3Xj8lPE2YemweJb6g3sDqYVNP-z-IjbHEgQcrK5Ng0lZZF93Qlvvg76oOFiInIACaERIrX3s8uiJUBQ_JK_4U6F0qr9gsO3mb7eTLJMHGVVNYvvGBGlPkACNe7TfqxDMFQJ1xM',
                  dp: 'rkqbebqNiyL8BREgiQ0gEgz5gEBcZGWJ67u0j0BoiKB3srwV0HnqE7N4-L_aJcCUH3zYQa9TPvqGOQ-vW7qYtMSBLV2K4cIDcdOuRCeBXMEQK-9jTm02rrF67fqp0gTf48R0ke2c9P_XD45Hc4_lR3rYSJTQlQKLlmFgjs_BARM',
                  dq: 'YP4Sf1FCMiNOj2e_b4SenoGP1aAw6fkYOOokc_WpCQdqHJpDKglNQJFaDF9dLFwosGXJxNX4LH4WhYjWx8zECEqSEXgCsGqJYnWZKhPaHjoGVNh1C53vVz_xfHalTTuCXQFaFaUTzqLaTPR-7FkKJMNFwuaOYoLSp7HEAME1VWM',
                  qi: '1HHEIOLKrFCNpy7lRTPF1shhBj_o8r2E5OtNhDPVmmJqvCLv3gTR_6OXiGwzvVBNvuC3NvfrDNKgvDmmcQRHBidAFqd4qrBQQAbtqPnbIaGvDLLT9k1xOJL8rkueDS1qXJ5IoVBft1KjGiK_vc_u-aS50U_G-m47EvvVpdPIUSE',
                },
              ],
            },

      interactions: {
        url(_ctx, interaction) {
          return `/oidc/interaction/${interaction.uid}`
        },
      },

      claims: {
        openid: ['sub'],
        profile: ['name', 'preferred_username', 'updated_at'],
        email: ['email', 'email_verified'],
      },

      features: {
        devInteractions: { enabled: false },
        encryption: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        rpInitiatedLogout: { enabled: true },
        backchannelLogout: { enabled: false },
        claimsParameter: { enabled: true },
        clientCredentials: { enabled: false },
        userinfo: { enabled: true },
        jwtUserinfo: { enabled: false },
      },

      ttl: {
        AccessToken: 60 * 60, // 1 hour
        AuthorizationCode: 10 * 60, // 10 minutes
        IdToken: 60 * 60, // 1 hour
        RefreshToken: 30 * 24 * 60 * 60, // 30 days
        Session: 24 * 60 * 60, // 1 day
        Interaction: 60 * 60, // 1 hour
        Grant: 30 * 24 * 60 * 60, // 30 days
        BackchannelAuthenticationRequest: 10 * 60, // 10 minutes
        DeviceCode: 10 * 60, // 10 minutes
        ClientCredentials: 60 * 60, // 1 hour
      },

      pkce: {
        required: () => false,
      },

      conformIdTokenClaims: false,

      renderError: async (ctx, _out, error) => {
        ctx.type = 'application/json'
        if ('error' in error && 'error_description' in error) {
          ctx.body = JSON.stringify({
            error: error.error,
            error_description: error.error_description,
          })
        } else {
          ctx.body = JSON.stringify({
            error: 'server_error',
            error_description:
              (error as Error).message || 'An unexpected error occurred.',
          })
        }
      },

      findAccount: Account.findAccount,
    }

    this.provider = new Provider(
      process.env.OIDC_ISSUER || `http://localhost`,
      configuration,
    )

    this.provider.proxy = true
  }

  getProvider(): Provider {
    return this.provider
  }

  async findAccount(
    ctx: KoaContextWithOIDC,
    id: string,
  ): Promise<Account | undefined> {
    return Account.findAccount(ctx, id)
  }

  async createClient(clientData: {
    clientId: string
    clientSecret?: string
    clientName: string
    redirectUris: string[]
    postLogoutRedirectUris?: string[]
    scope?: string
    grantTypes?: string[]
    responseTypes?: string[]
    applicationType?: 'web' | 'native'
  }) {
    const client = await prisma.oidcClient.create({
      data: {
        clientId: clientData.clientId,
        clientSecret: clientData.clientSecret,
        clientName: clientData.clientName,
        redirectUris: JSON.stringify(clientData.redirectUris),
        postLogoutRedirectUris: clientData.postLogoutRedirectUris
          ? JSON.stringify(clientData.postLogoutRedirectUris)
          : null,
        scope: clientData.scope || 'openid profile email',
        grantTypes: JSON.stringify(
          clientData.grantTypes || ['authorization_code', 'refresh_token'],
        ),
        responseTypes: JSON.stringify(clientData.responseTypes || ['code']),
        applicationType: clientData.applicationType || 'web',
      },
    })

    return client
  }

  async getClient(clientId: string) {
    const client = await prisma.oidcClient.findUnique({
      where: { clientId },
    })

    if (!client) {
      throw new NotFoundError('Client', clientId)
    }

    return client
  }

  async listClients() {
    const clients = await prisma.oidcClient.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return clients
  }

  async updateClient(
    clientId: string,
    updates: Partial<{
      clientName: string
      redirectUris: string[]
      postLogoutRedirectUris: string[]
      scope: string
      grantTypes: string[]
      responseTypes: string[]
    }>,
  ) {
    const updateData: Record<string, unknown> = {}

    if (updates.clientName) updateData.clientName = updates.clientName
    if (updates.redirectUris)
      updateData.redirectUris = JSON.stringify(updates.redirectUris)
    if (updates.postLogoutRedirectUris) {
      updateData.postLogoutRedirectUris = JSON.stringify(
        updates.postLogoutRedirectUris,
      )
    }
    if (updates.scope) updateData.scope = updates.scope
    if (updates.grantTypes)
      updateData.grantTypes = JSON.stringify(updates.grantTypes)
    if (updates.responseTypes)
      updateData.responseTypes = JSON.stringify(updates.responseTypes)

    const client = await prisma.oidcClient.update({
      where: { clientId },
      data: updateData,
    })

    return client
  }

  async deleteClient(clientId: string) {
    await prisma.oidcClient.delete({
      where: { clientId },
    })
  }

  async getUserSessions(userId: number) {
    const sessions = await prisma.oidcSession.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    })

    return sessions.map((session) => ({
      id: session.id,
      sessionId: session.sessionId,
      clientId: session.client.clientId,
      createdAt: session.createdAt,
      userId: session.userId,
      nonce: session.nonce,
      state: session.state,
      codeChallenge: session.codeChallenge,
      codeChallengeMethod: session.codeChallengeMethod,
      scope: session.scope,
      authTime: session.authTime,
      expiresAt: session.expiresAt,
    }))
  }

  async revokeUserSession(userId: number, sessionId: string) {
    const session = await prisma.oidcSession.findFirst({
      where: { sessionId, userId },
    })

    if (!session) {
      // Session doesn't exist, nothing to revoke
      return
    }

    // Try to destroy the provider session if it exists
    try {
      const providerSession = await this.provider.Session.find(
        session.sessionId,
      )
      if (providerSession) {
        await providerSession.destroy()
      }
    } catch (error) {
      // Session might not exist in provider, continue with database deletion
    }

    await prisma.oidcSession.delete({
      where: { id: session.id },
    })
  }

  async revokeAllUserSessions(userId: number) {
    const sessions = await prisma.oidcSession.findMany({
      where: { userId },
    })

    // Try to destroy provider sessions
    for (const session of sessions) {
      try {
        const providerSession = await this.provider.Session.find(
          session.sessionId,
        )
        if (providerSession) {
          await providerSession.destroy()
        }
      } catch (error) {
        // Session might not exist in provider, continue
      }
    }

    // Delete all database sessions
    await prisma.oidcSession.deleteMany({
      where: { userId },
    })
  }
}
