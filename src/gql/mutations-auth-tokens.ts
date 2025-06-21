/**
 * Direct GraphQL Auth Tokens Mutations
 *
 * Simple GraphQL operation strings for authentication with tokens
 */

import { graphql } from 'gql.tada'

// Authentication with tokens mutations
export const LoginWithTokensMutation = graphql(`
  mutation LoginWithTokens($email: String!, $password: String!) {
    loginWithTokens(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`)

export const RefreshTokenMutation = graphql(`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`)

export const LogoutMutation = graphql(`
  mutation Logout {
    logout
  }
`)
