/**
 * Direct GraphQL Auth Tokens Mutations
 * 
 * Simple GraphQL operation strings for authentication with tokens
 */

import { graphql } from 'gql.tada'

// Authentication with tokens mutations
export const LoginWithTokensDirectMutation = graphql(`
  mutation LoginWithTokensDirect($email: String!, $password: String!) {
    loginWithTokensDirect(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`)

export const RefreshTokenDirectMutation = graphql(`
  mutation RefreshTokenDirect($refreshToken: String!) {
    refreshTokenDirect(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`)

export const LogoutDirectMutation = graphql(`
  mutation LogoutDirect {
    logoutDirect
  }
`)