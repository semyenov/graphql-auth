import { prisma } from '@/modules/shared/shared.module'
import type { Adapter, AdapterPayload } from 'oidc-provider'
import { injectable } from 'tsyringe'

@injectable()
export class PrismaAdapter<
  T extends
    | 'Session'
    | 'AuthorizationCode'
    | 'AccessToken'
    | 'RefreshToken'
    | 'IdToken'
    | 'Client',
> implements Adapter
{
  private name: T

  constructor(name: T) {
    this.name = name
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn: number,
  ): Promise<void> {
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null

    switch (this.name) {
      case 'Session':
        await prisma.oidcSession.upsert({
          where: { sessionId: id },
          create: {
            sessionId: id,
            userId: Number(payload.accountId),
            clientId: payload.clientId as string,
            scope: (payload.authorizedScope as string) || '',
            nonce: payload.nonce ?? undefined,
            state: payload.state as string | undefined,
            codeChallenge: payload.codeChallenge ?? undefined,
            codeChallengeMethod: payload.codeChallengeMethod ?? undefined,
            expiresAt: expiresAt ?? new Date(),
          },
          update: {
            scope: (payload.authorizedScope as string) || '',
            expiresAt: expiresAt ?? new Date(),
          },
        })
        break

      case 'AuthorizationCode':
        await prisma.oidcAuthorizationCode.create({
          data: {
            code: id,
            userId: Number(payload.accountId),
            clientId: payload.clientId as string,
            redirectUri: payload.redirectUri as string,
            scope: payload.scope as string,
            sessionId: payload.sessionUid as string,
            nonce: payload.nonce ?? undefined,
            codeChallenge: payload.codeChallenge ?? undefined,
            codeChallengeMethod: payload.codeChallengeMethod ?? undefined,
            expiresAt: expiresAt ?? new Date(),
          },
        })
        break

      case 'AccessToken':
        await prisma.oidcAccessToken.create({
          data: {
            token: id,
            userId: Number(payload.accountId),
            clientId: payload.clientId as string,
            scope: payload.scope as string,
            sessionId: payload.sessionUid as string,
            expiresAt: expiresAt ?? new Date(),
          },
        })
        break

      case 'RefreshToken':
        await prisma.oidcRefreshToken.create({
          data: {
            token: id,
            userId: Number(payload.accountId),
            clientId: payload.clientId as string,
            scope: payload.scope as string,
            sessionId: payload.sessionUid as string,
            expiresAt: expiresAt ?? new Date(),
          },
        })
        break

      case 'IdToken':
        await prisma.oidcIdToken.create({
          data: {
            jti: id,
            userId: Number(payload.accountId),
            clientId: payload.clientId as string,
            sessionId: payload.sessionUid as string,
            nonce: payload.nonce ?? undefined,
            authTime: new Date((payload.authTime as number) * 1000),
            expiresAt: expiresAt ?? new Date(),
          },
        })
        break

      case 'Client': {
        const clientData = {
          clientId: payload.client_id as string,
          clientSecret: payload.client_secret ?? undefined,
          clientName:
            (payload.client_name as string) || (payload.client_id as string),
          redirectUris: JSON.stringify(payload.redirect_uris || []),
          postLogoutRedirectUris: JSON.stringify(
            payload.post_logout_redirect_uris || [],
          ),
          scope: (payload.scope as string) || 'openid profile email',
          grantTypes: JSON.stringify(
            payload.grant_types || ['authorization_code'],
          ),
          responseTypes: JSON.stringify(payload.response_types || ['code']),
          tokenEndpointAuthMethod:
            (payload.token_endpoint_auth_method as string) ||
            'client_secret_basic',
          applicationType: (payload.application_type as string) || 'web',
          clientUri: payload.client_uri ?? undefined,
          logoUri: payload.logo_uri ?? undefined,
          tosUri: payload.tos_uri ?? undefined,
          policyUri: payload.policy_uri ?? undefined,
          jwksUri: payload.jwks_uri ?? undefined,
          jwks: payload.jwks ? JSON.stringify(payload.jwks) : undefined,
          subjectType: (payload.subject_type as string) || 'public',
          idTokenSignedResponseAlg:
            (payload.id_token_signed_response_alg as string) || 'RS256',
        }

        await prisma.oidcClient.upsert({
          where: { clientId: payload.client_id as string },
          create: clientData,
          update: clientData,
        })
        break
      }
    }
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    switch (this.name) {
      case 'Session': {
        const session = await prisma.oidcSession.findUnique({
          where: { sessionId: id },
          include: { user: true },
        })
        if (!session) return undefined

        return {
          accountId: session.userId.toString(),
          clientId: session.clientId,
          authorizedScope: session.scope,
          nonce: session.nonce,
          state: session.state ?? undefined,
          codeChallenge: session.codeChallenge,
          codeChallengeMethod: session.codeChallengeMethod,
        } as AdapterPayload
      }

      case 'AuthorizationCode': {
        const code = await prisma.oidcAuthorizationCode.findUnique({
          where: { code: id },
        })
        if (!code || code.usedAt) return undefined

        return {
          accountId: code.userId.toString(),
          clientId: code.clientId,
          redirectUri: code.redirectUri,
          scope: code.scope,
          sessionUid: code.sessionId,
          nonce: code.nonce,
          codeChallenge: code.codeChallenge,
          codeChallengeMethod: code.codeChallengeMethod,
        } as AdapterPayload
      }

      case 'AccessToken': {
        const token = await prisma.oidcAccessToken.findUnique({
          where: { token: id },
        })
        if (!token) return undefined

        return {
          accountId: token.userId.toString(),
          clientId: token.clientId,
          scope: token.scope,
          sessionUid: token.sessionId,
        } as AdapterPayload
      }

      case 'RefreshToken': {
        const token = await prisma.oidcRefreshToken.findUnique({
          where: { token: id },
        })
        if (!token) return undefined

        return {
          accountId: token.userId.toString(),
          clientId: token.clientId,
          scope: token.scope,
          sessionUid: token.sessionId,
        } as AdapterPayload
      }

      case 'IdToken': {
        const token = await prisma.oidcIdToken.findUnique({
          where: { jti: id },
        })
        if (!token) return undefined

        return {
          accountId: token.userId.toString(),
          clientId: token.clientId,
          sessionUid: token.sessionId,
          nonce: token.nonce,
          authTime: Math.floor(token.authTime.getTime() / 1000),
        } as AdapterPayload
      }

      case 'Client': {
        const client = await prisma.oidcClient.findUnique({
          where: { clientId: id },
        })
        if (!client) return undefined

        return {
          client_id: client.clientId,
          client_secret: client.clientSecret,
          client_name: client.clientName,
          redirect_uris: JSON.parse(client.redirectUris),
          post_logout_redirect_uris: client.postLogoutRedirectUris
            ? JSON.parse(client.postLogoutRedirectUris)
            : [],
          scope: client.scope,
          grant_types: JSON.parse(client.grantTypes),
          response_types: JSON.parse(client.responseTypes),
          token_endpoint_auth_method: client.tokenEndpointAuthMethod,
          application_type: client.applicationType,
          client_uri: client.clientUri,
          logo_uri: client.logoUri,
          tos_uri: client.tosUri,
          policy_uri: client.policyUri,
          jwks_uri: client.jwksUri,
          jwks: client.jwks ? JSON.parse(client.jwks) : undefined,
          subject_type: client.subjectType,
          id_token_signed_response_alg: client.idTokenSignedResponseAlg,
        } as AdapterPayload
      }

      default:
        return undefined
    }
  }

  async findByUserCode(_userCode: string): Promise<AdapterPayload | undefined> {
    return undefined
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    switch (this.name) {
      case 'Session':
        return this.find(uid)
      default:
        return undefined
    }
  }

  async consume(id: string): Promise<void> {
    switch (this.name) {
      case 'AuthorizationCode':
        await prisma.oidcAuthorizationCode.update({
          where: { code: id },
          data: { usedAt: new Date() },
        })
        break
      case 'RefreshToken':
        await prisma.oidcRefreshToken.delete({
          where: { token: id },
        })
        break
    }
  }

  async destroy(id: string): Promise<void> {
    switch (this.name) {
      case 'Session':
        await prisma.oidcSession.delete({
          where: { sessionId: id },
        })
        break
      case 'AuthorizationCode':
        await prisma.oidcAuthorizationCode.delete({
          where: { code: id },
        })
        break
      case 'AccessToken':
        await prisma.oidcAccessToken.delete({
          where: { token: id },
        })
        break
      case 'RefreshToken':
        await prisma.oidcRefreshToken.delete({
          where: { token: id },
        })
        break
      case 'IdToken':
        await prisma.oidcIdToken.delete({
          where: { jti: id },
        })
        break
    }
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    await prisma.$transaction([
      prisma.oidcAccessToken.deleteMany({
        where: { sessionId: grantId },
      }),
      prisma.oidcRefreshToken.deleteMany({
        where: { sessionId: grantId },
      }),
    ])
  }
}

export function createAdapter<
  T extends
    | 'Session'
    | 'AuthorizationCode'
    | 'AccessToken'
    | 'RefreshToken'
    | 'IdToken'
    | 'Client',
>(name: T): PrismaAdapter<T> {
  return new PrismaAdapter(name)
}
