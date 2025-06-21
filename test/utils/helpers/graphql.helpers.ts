/**
 * Integration testing utilities for comprehensive GraphQL API testing
 */

import type { ApolloServer, GraphQLResponse } from '@apollo/server'
import type { TadaDocumentNode } from 'gql.tada'
import type { DocumentNode } from 'graphql'
import { print } from 'graphql'
import type { Context } from '../../../src/graphql/context/context.types'
import type {
  createBlogScenario,
  createPermissionScenario,
} from '../fixtures/graphql.fixtures'
import { createMockContext } from './database.helpers'
import type { GraphQLSnapshotTester } from './snapshot.helpers'

export interface IntegrationTestContext {
  server: ApolloServer<Context>
  snapshotTester: GraphQLSnapshotTester
  scenarios: {
    blog?: Awaited<ReturnType<typeof createBlogScenario>>
    permissions?: Awaited<ReturnType<typeof createPermissionScenario>>
  }
  cleanup: () => Promise<void>
}
export type VariableValues = { [name: string]: unknown }

// GraphQL query helper with improved error handling
export async function executeOperation<
  TData,
  TVariables extends Record<string, unknown>,
>(
  server: ApolloServer<Context>,
  query: string,
  variables?: TVariables,
  context?: Context,
): Promise<GraphQLResponse<TData>> {
  const response = await server.executeOperation<TData, TVariables>(
    {
      query,
      variables,
    },
    {
      contextValue: context || createMockContext(),
    },
  )

  return response
}

// Helper to extract data from GraphQL response with error checking
export function extractGraphQLData<T>(response: GraphQLResponse<T>): T {
  if (response.body.kind !== 'single') {
    throw new Error('Expected single GraphQL response')
  }

  const { singleResult } = response.body

  if (singleResult.errors && singleResult.errors.length > 0) {
    throw new Error(
      `GraphQL Error: ${singleResult.errors.map((e) => e.message).join(', ')}`,
    )
  }

  if (!singleResult.data) {
    throw new Error('No data returned from GraphQL operation')
  }

  return singleResult.data
}

// Helper to check if GraphQL response has errors
export function hasGraphQLErrors<T>(response: GraphQLResponse<T>): boolean {
  return (
    response.body.kind === 'single' &&
    !!response.body.singleResult.errors &&
    response.body.singleResult.errors.length > 0
  )
}

// Helper to get GraphQL errors from response
export function getGraphQLErrors<T>(response: GraphQLResponse<T>): string[] {
  if (response.body.kind !== 'single') {
    return []
  }

  return response.body.singleResult.errors?.map((e) => e.message) || []
}

type OperationType<T> = T extends TadaDocumentNode<
  infer TData,
  infer TVariables
>
  ? { data: TData; variables: TVariables }
  : { data: unknown; variables: Record<string, unknown> }

type GqlOperation = string | DocumentNode
type GqlVariables<T extends GqlOperation> =
  OperationType<T>['variables'] extends Record<string, unknown>
    ? OperationType<T>['variables']
    : Record<string, unknown>

// Type-safe GraphQL operation helpers
export const gqlHelpers = {
  // Execute a query and expect success
  async expectSuccessfulQuery<TOperation extends GqlOperation>(
    server: ApolloServer<Context>,
    operation: TOperation,
    variables?: GqlVariables<TOperation>,
    context?: Context,
  ): Promise<OperationType<TOperation>['data']> {
    const query = typeof operation === 'string' ? operation : print(operation)
    const response = await executeOperation<
      OperationType<TOperation>['data'],
      GqlVariables<TOperation>
    >(server, query, variables, context)
    return extractGraphQLData(response)
  },

  // Execute a mutation and expect success
  async expectSuccessfulMutation<TOperation extends GqlOperation>(
    server: ApolloServer<Context>,
    operation: TOperation,
    variables?: GqlVariables<TOperation>,
    context?: Context,
  ): Promise<OperationType<TOperation>['data']> {
    const mutation =
      typeof operation === 'string' ? operation : print(operation)
    const response = await executeOperation<
      OperationType<TOperation>['data'],
      GqlVariables<TOperation>
    >(server, mutation, variables, context)
    return extractGraphQLData(response)
  },

  // Execute an operation and expect it to fail with specific error
  async expectGraphQLError<TOperation extends GqlOperation>(
    server: ApolloServer<Context>,
    operation: TOperation,
    variables?: GqlVariables<TOperation>,
    context?: Context,
    expectedErrorSubstring?: string,
  ): Promise<string[]> {
    const opString =
      typeof operation === 'string' ? operation : print(operation)
    const response = await executeOperation<
      OperationType<TOperation>['data'],
      GqlVariables<TOperation>
    >(server, opString, variables, context)

    if (!hasGraphQLErrors(response)) {
      throw new Error('Expected GraphQL operation to fail, but it succeeded')
    }

    const errors = getGraphQLErrors(response)

    if (expectedErrorSubstring) {
      const hasExpectedError = errors.some((error) =>
        error.includes(expectedErrorSubstring),
      )
      if (!hasExpectedError) {
        throw new Error(
          `Expected error containing "${expectedErrorSubstring}", but got: "${errors.join(
            ', ',
          )}"`,
        )
      }
    }

    return errors
  },
}
