/**
 * GraphQL operation execution utilities
 */

import type { ApolloServer } from '@apollo/server'
import type { VariableValues } from '@apollo/server/dist/esm/externalTypes/graphql'
import type { TadaDocumentNode } from 'gql.tada'
import type { GraphQLFormattedError } from 'graphql'
import type { DefaultContext } from '../../../src/graphql/context/context.types'

/**
 * Execute a GraphQL operation against a test server
 */
export async function executeOperation<
  TResult = unknown,
  TVariables extends VariableValues = VariableValues,
>(
  server: ApolloServer<DefaultContext>,
  query: string | TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  contextValue?: DefaultContext,
) {
  const queryString = typeof query === 'string' ? query : String(query)

  return server.executeOperation<TResult, TVariables>(
    {
      query: queryString,
      variables: variables as TVariables,
    },
    { contextValue: contextValue || ({} as DefaultContext) },
  )
}

/**
 * Extract data from GraphQL response or throw if errors
 */
export function extractGraphQLData<T>(
  response: Awaited<ReturnType<typeof executeOperation<T>>>,
): T {
  if (response.body.kind !== 'single') {
    throw new Error('Expected single result but got incremental delivery')
  }
  const result = response.body.singleResult
  if (result.errors && result.errors.length > 0) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }
  if (!result.data) {
    throw new Error('No data returned from GraphQL operation')
  }
  return result.data
}

/**
 * Check if GraphQL response has errors
 */
export function hasGraphQLErrors(
  response: Awaited<ReturnType<typeof executeOperation>>,
): boolean {
  if (response.body.kind !== 'single') {
    return false
  }
  return !!(
    response.body.singleResult.errors &&
    response.body.singleResult.errors.length > 0
  )
}

/**
 * Get GraphQL errors from response
 */
export function getGraphQLErrors(
  response: Awaited<ReturnType<typeof executeOperation>>,
): GraphQLFormattedError[] {
  if (response.body.kind !== 'single') {
    return []
  }
  return response.body.singleResult.errors || []
}
