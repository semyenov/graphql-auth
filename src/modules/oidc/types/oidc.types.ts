export interface OidcClientInput {
  clientId: string
  clientSecret?: string
  clientName: string
  redirectUris: string[]
  postLogoutRedirectUris?: string[]
  scope?: string
  grantTypes?: string[]
  responseTypes?: string[]
  applicationType?: 'web' | 'native'
}

export interface OidcClientUpdateInput {
  clientName?: string
  redirectUris?: string[]
  postLogoutRedirectUris?: string[]
  scope?: string
  grantTypes?: string[]
  responseTypes?: string[]
}

export interface OidcSession {
  id: string
  sessionId: string
  client: {
    clientId: string
    clientName: string
  }
  scope: string
  authTime: Date
  expiresAt: Date
}

export interface OidcAuthRequest {
  clientId: string
  redirectUri: string
  responseType: string
  scope: string
  state?: string
  nonce?: string
  codeChallenge?: string
  codeChallengeMethod?: string
}

export interface OidcTokenRequest {
  grantType: 'authorization_code' | 'refresh_token'
  code?: string
  refreshToken?: string
  redirectUri?: string
  clientId: string
  clientSecret?: string
  codeVerifier?: string
}

export interface OidcTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope: string
}

export interface OidcIntrospectionRequest {
  token: string
  tokenTypeHint?: 'access_token' | 'refresh_token'
  clientId?: string
  clientSecret?: string
}

export interface OidcIntrospectionResponse {
  active: boolean
  scope?: string
  client_id?: string
  username?: string
  token_type?: string
  exp?: number
  iat?: number
  nbf?: number
  sub?: string
  aud?: string | string[]
  iss?: string
  jti?: string
}

export interface OidcUserInfo {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  preferred_username?: string
  updated_at?: number
}
