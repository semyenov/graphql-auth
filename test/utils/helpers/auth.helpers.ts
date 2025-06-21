/**
 * Authentication test helpers
 */

import type { ApolloServer } from '@apollo/server'
import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { expect } from 'vitest'
import { LoginMutation } from '../../../src/gql/mutations'
import type { Context } from '../../../src/graphql/context/context.types'
import { createMockContext } from '../core/context'
import { gqlHelpers } from '../core/graphql'

/**
 * Helper to login a test user and get JWT token
 */
export async function loginTestUser(
  server: ApolloServer<Context>,
  email: string,
  password: string,
): Promise<string> {
  const data = await gqlHelpers.expectSuccessfulMutation<
    ResultOf<typeof LoginMutation>,
    VariablesOf<typeof LoginMutation>
  >(
    server,
    print(LoginMutation),
    { email, password },
    createMockContext(),
  )

  if (!data.login) {
    throw new Error('Login failed')
  }

  return data.login
}

/**
 * Validate JWT token format
 */
export function expectValidJWT(token: string): void {
  expect(token).toBeTruthy()
  expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
}

/**
 * Create authorization header from token
 */
export function createAuthHeader(token: string): { authorization: string } {
  return { authorization: `Bearer ${token}` }
}

/**
 * Extract user ID from JWT token (for tes  ting only)
 */
export function extractUserIdFromToken(token: string): number {
  const [, payload] = token.split('.') as [string, string]
  const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
  return decoded.userId
}