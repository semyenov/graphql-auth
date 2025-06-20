/**
 * Authentication GraphQL Types
 *
 * Defines types for authentication responses
 */

import { builder } from '../../../graphql/schema/builder'

export class AuthTokens {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}

export class AuthResponse {
  constructor(public readonly token: string) {}
}

// Auth tokens response type
export const AuthTokensType = builder.objectType(AuthTokens, {
  name: 'AuthTokens',
  description: 'Authentication tokens response',
  fields: (t) => ({
    accessToken: t.exposeString('accessToken', {
      description: 'JWT access token for API requests',
    }),
    refreshToken: t.exposeString('refreshToken', {
      description: 'Refresh token for obtaining new access tokens',
    }),
  }),
})

// For backward compatibility
export const AuthResponseType = builder.objectType(AuthResponse, {
  name: 'AuthResponse',
  description: 'Legacy authentication response',
  fields: (t) => ({
    token: t.exposeString('token', {
      description: 'JWT access token (deprecated, use AuthTokens instead)',
    }),
  }),
})
