/**
 * OIDC Module Client Interface
 * Following modular monolith pattern - defines the public API for inter-module communication
 *
 * This interface represents what other modules can do with the OIDC module.
 * It's the only entry point other modules should use to interact with OIDC functionality.
 */

// Input/Output types for the client interface
export interface OidcClientConfig {
  clientId: string
  clientSecret?: string
  redirectUris: string[]
  grants: string[]
  scopes: string[]
  name: string
  userId: number
}

export interface OidcClient {
  id: string
  clientId: string
  clientSecret: string | null
  redirectUris: string[]
  grants: string[]
  scopes: string[]
  name: string
  userId: number
  createdAt: Date
  updatedAt: Date
}

export interface OidcSession {
  id: string
  clientId: string
  userId: number
  scopes: string[]
  createdAt: Date
  expiresAt: Date
}

export interface OidcTokenRequest {
  grantType: string
  code?: string
  refreshToken?: string
  clientId: string
  clientSecret?: string
  redirectUri?: string
  scope?: string
}

export interface OidcTokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken?: string
  scope?: string
  idToken?: string
}

export interface OidcAuthorizationRequest {
  clientId: string
  redirectUri: string
  responseType: string
  scope: string
  state?: string
  nonce?: string
  codeChallenge?: string
  codeChallengeMethod?: string
}

export interface OidcUserInfo {
  sub: string
  email?: string
  emailVerified?: boolean
  name?: string
  picture?: string
  updatedAt?: number
}

/**
 * OIDC Module Client Interface
 *
 * This interface defines all operations that other modules can perform
 * on the OIDC module. It acts as a contract and abstraction layer.
 */
export interface IOidcClient {
  // Client management
  createClient(config: OidcClientConfig): Promise<OidcClient>
  updateClient(
    clientId: string,
    updates: Partial<OidcClientConfig>,
  ): Promise<OidcClient>
  deleteClient(clientId: string): Promise<boolean>
  getClient(clientId: string): Promise<OidcClient | null>
  getClientsByUser(userId: number): Promise<OidcClient[]>

  // Authorization operations
  validateAuthorizationRequest(
    request: OidcAuthorizationRequest,
  ): Promise<boolean>
  generateAuthorizationCode(
    request: OidcAuthorizationRequest,
    userId: number,
  ): Promise<string>

  // Token operations
  exchangeToken(request: OidcTokenRequest): Promise<OidcTokenResponse>
  introspectToken(
    token: string,
    clientId: string,
    clientSecret?: string,
  ): Promise<{ active: boolean; scope?: string; sub?: string }>
  revokeToken(
    token: string,
    clientId: string,
    clientSecret?: string,
  ): Promise<boolean>

  // Session management
  getUserSessions(userId: number): Promise<OidcSession[]>
  revokeSession(sessionId: string, userId: number): Promise<boolean>
  revokeAllUserSessions(userId: number): Promise<boolean>

  // User info
  getUserInfo(accessToken: string): Promise<OidcUserInfo | null>

  // Discovery
  getConfiguration(): Promise<{
    issuer: string
    authorizationEndpoint: string
    tokenEndpoint: string
    userinfoEndpoint: string
    jwksUri: string
    scopesSupported: string[]
    responseTypesSupported: string[]
    grantTypesSupported: string[]
  }>
}

/**
 * OIDC Module Events
 *
 * Events that the OIDC module can publish for other modules to subscribe to.
 * This enables loose coupling between modules.
 */
export interface OidcModuleEvents {
  'oidc.client.created': {
    clientId: string
    userId: number
    name: string
    timestamp: Date
  }
  'oidc.client.updated': {
    clientId: string
    userId: number
    timestamp: Date
  }
  'oidc.client.deleted': {
    clientId: string
    userId: number
    timestamp: Date
  }
  'oidc.authorization.granted': {
    clientId: string
    userId: number
    scopes: string[]
    timestamp: Date
  }
  'oidc.token.issued': {
    clientId: string
    userId: number
    grantType: string
    scopes: string[]
    timestamp: Date
  }
  'oidc.token.revoked': {
    clientId: string
    userId: number
    timestamp: Date
  }
  'oidc.session.revoked': {
    sessionId: string
    clientId: string
    userId: number
    timestamp: Date
  }
}

/**
 * Error types that the OIDC module can return
 */
export class OidcClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'OidcClientError'
  }
}

export class InvalidClientError extends OidcClientError {
  constructor(message = 'Invalid client') {
    super(message, 'INVALID_CLIENT', 401)
  }
}

export class InvalidGrantError extends OidcClientError {
  constructor(message = 'Invalid grant') {
    super(message, 'INVALID_GRANT', 400)
  }
}

export class InvalidScopeError extends OidcClientError {
  constructor(message = 'Invalid scope') {
    super(message, 'INVALID_SCOPE', 400)
  }
}

export class UnauthorizedClientError extends OidcClientError {
  constructor(message = 'Unauthorized client') {
    super(message, 'UNAUTHORIZED_CLIENT', 403)
  }
}