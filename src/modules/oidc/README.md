# OIDC Provider Module

This module implements an OpenID Connect (OIDC) provider using `oidc-provider` with a Prisma adapter for database storage.

## Features

- Full OIDC provider implementation with Prisma database adapter
- GraphQL API for managing OIDC clients and sessions
- Support for authorization code flow with PKCE
- Refresh token support
- User session management
- Integration with existing JWT authentication system

## Architecture

```
modules/oidc/
├── services/
│   ├── oidc-provider.service.ts    # Main OIDC provider service
│   └── prisma-adapter.service.ts   # Prisma adapter for oidc-provider
├── types/
│   └── oidc.types.ts              # TypeScript type definitions
├── oidc.types.ts                  # GraphQL type definitions
├── oidc.resolver.ts               # GraphQL resolvers
└── oidc.middleware.ts             # HTTP middleware for OIDC routes
```

## GraphQL API

### Queries

- `oidcClients` - List all OIDC clients (admin only)
- `oidcClient(clientId: String!)` - Get a specific client (admin only)
- `myOidcSessions` - Get current user's OIDC sessions

### Mutations

- `createOidcClient(input: OidcClientInput!)` - Create new OIDC client (admin only)
- `updateOidcClient(clientId: String!, input: OidcClientUpdateInput!)` - Update client (admin only)
- `deleteOidcClient(clientId: String!)` - Delete client (admin only)
- `revokeOidcSession(sessionId: String!)` - Revoke a specific session
- `revokeAllOidcSessions` - Revoke all user sessions

## OIDC Endpoints

The OIDC provider exposes the following standard endpoints:

- `GET /.well-known/openid-configuration` - Discovery endpoint
- `GET /.well-known/jwks.json` - JSON Web Key Set
- `GET /oidc/auth` - Authorization endpoint
- `POST /oidc/token` - Token endpoint
- `GET /oidc/userinfo` - UserInfo endpoint
- `POST /oidc/introspect` - Token introspection
- `POST /oidc/revoke` - Token revocation

## Usage Example

### Creating an OIDC Client

```graphql
mutation CreateOidcClient {
  createOidcClient(input: {
    clientId: "my-app"
    clientSecret: "super-secret"
    clientName: "My Application"
    redirectUris: ["https://myapp.com/callback"]
    postLogoutRedirectUris: ["https://myapp.com"]
    scope: "openid profile email"
    grantTypes: ["authorization_code", "refresh_token"]
    responseTypes: ["code"]
    applicationType: "web"
  }) {
    id
    clientId
    clientName
    redirectUris
  }
}
```

### Authorization Flow

1. Redirect user to authorization endpoint:
```
GET /oidc/auth?
  client_id=my-app&
  redirect_uri=https://myapp.com/callback&
  response_type=code&
  scope=openid profile email&
  state=random-state
```

2. User authenticates and consents

3. Exchange authorization code for tokens:
```
POST /oidc/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
redirect_uri=https://myapp.com/callback&
client_id=my-app&
client_secret=super-secret
```

4. Use access token to get user info:
```
GET /oidc/userinfo
Authorization: Bearer ACCESS_TOKEN
```

## Database Schema

The implementation uses the following Prisma models:

- `OidcClient` - Stores OIDC client configurations
- `OidcSession` - Stores user sessions
- `OidcAuthorizationCode` - Stores authorization codes
- `OidcAccessToken` - Stores access tokens
- `OidcRefreshToken` - Stores refresh tokens
- `OidcIdToken` - Stores ID token metadata

## Security Considerations

- Client secrets are stored in plain text (consider encryption in production)
- PKCE is optional but recommended for public clients
- Sessions expire after 24 hours by default
- Tokens follow these TTLs:
  - Authorization codes: 10 minutes
  - Access tokens: 1 hour
  - ID tokens: 1 hour
  - Refresh tokens: 30 days

## Configuration

The OIDC provider can be configured through environment variables:

```env
OIDC_ISSUER=http://localhost:4000  # OIDC issuer URL
JWT_SECRET=your-secret-key          # Used for signing cookies
```

## Testing

Run the OIDC test script:

```bash
bun run scripts/test-oidc.ts
```

This will create a test client, verify the setup, and clean up.