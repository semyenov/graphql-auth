/**
 * GraphQL operation execution utilities
 */

import type { ApolloServer } from '@apollo/server'
import type { TadaDocumentNode } from 'gql.tada'
import type { GraphQLFormattedError, VariableValues } from 'graphql'
import type { BaseError } from '../../../src/core/errors/types'
import type { Context } from '../../../src/graphql/context/context.types'

/**
 * Execute a GraphQL operation against a test server
 */
export async function executeOperation<
  TResult = unknown,
  TVariables extends VariableValues = VariableValues,
>(
  server: ApolloServer<Context>,
  query: string | TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  contextValue?: Context,
) {
  const queryString = typeof query === 'string' ? query : String(query)

  return server.executeOperation<TResult, TVariables>(
    {
      query: queryString,
      variables: variables as TVariables,
    },
    { contextValue: contextValue || ({} as Context) },
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

/**
 * Helper object with typed GraphQL operation utilities
 */
export const gqlHelpers = {
  /**
   * Execute a typed GraphQL operation
   */
  async execute<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context?: Context,
  ) {
    return executeOperation(server, operation, variables, context)
  },

  /**
   * Execute and extract data, throwing on errors
   */
  async executeAndExtract<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context?: Context,
  ): Promise<TResult> {
    const response = await executeOperation(
      server,
      operation,
      variables,
      context,
    )
    return extractGraphQLData(response)
  },

  /**
   * Execute and expect errors
   */
  async executeAndExpectErrors<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context?: Context,
  ): Promise<GraphQLFormattedError[]> {
    const response = await executeOperation(
      server,
      operation,
      variables,
      context,
    )
    const errors = getGraphQLErrors(response)
    if (errors.length === 0) {
      throw new Error('Expected errors but none were returned')
    }
    return errors
  },

  /**
   * Execute and expect a specific error
   */
  async executeAndExpectError<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    expectedError: string | RegExp | Partial<BaseError>,
    context?: Context,
  ): Promise<GraphQLFormattedError> {
    const errors = await this.executeAndExpectErrors(
      server,
      operation,
      variables,
      context,
    )
    const error = errors[0]

    if (typeof expectedError === 'string') {
      if (!error.message.includes(expectedError)) {
        throw new Error(
          `Expected error containing "${expectedError}" but got "${error.message}"`,
        )
      }
    } else if (expectedError instanceof RegExp) {
      if (!expectedError.test(error.message)) {
        throw new Error(
          `Expected error matching ${expectedError} but got "${error.message}"`,
        )
      }
    } else {
      // Check partial error object
      if (
        expectedError.message &&
        !error.message.includes(expectedError.message)
      ) {
        throw new Error(
          `Expected error message containing "${expectedError.message}" but got "${error.message}"`,
        )
      }
      if (expectedError.code && error.extensions?.code !== expectedError.code) {
        throw new Error(
          `Expected error code "${expectedError.code}" but got "${error.extensions?.code}"`,
        )
      }
    }

    return error
  },

  /**
   * Execute a mutation and expect it to succeed
   */
  async expectSuccessfulMutation<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: string | TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context?: Context,
  ): Promise<TResult> {
    const response = await executeOperation(
      server,
      operation,
      variables,
      context,
    )
    if (response.body.kind !== 'single') {
      throw new Error('Expected single result but got incremental delivery')
    }
    const result = response.body.singleResult
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        `Expected successful mutation but got errors: ${JSON.stringify(result.errors)}`,
      )
    }
    if (!result.data) {
      throw new Error('Expected data but got none')
    }
    return result.data
  },

  /**
   * Execute a query and expect it to succeed
   */
  async expectSuccessfulQuery<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: string | TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context?: Context,
  ): Promise<TResult> {
    const response = await executeOperation(
      server,
      operation,
      variables,
      context,
    )
    if (response.body.kind !== 'single') {
      throw new Error('Expected single result but got incremental delivery')
    }
    const result = response.body.singleResult
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        `Expected successful query but got errors: ${JSON.stringify(result.errors)}`,
      )
    }
    if (!result.data) {
      throw new Error('Expected data but got none')
    }
    return result.data
  },

  /**
   * Execute an operation and expect a specific GraphQL error
   */
  async expectGraphQLError<TResult, TVariables>(
    server: ApolloServer<Context>,
    operation: string | TadaDocumentNode<TResult, TVariables>,
    variables: TVariables,
    context: Context | undefined,
    expectedMessage: string,
  ): Promise<void> {
    const response = await executeOperation(
      server,
      operation,
      variables,
      context,
    )
    if (response.body.kind !== 'single') {
      throw new Error('Expected single result but got incremental delivery')
    }
    const result = response.body.singleResult
    if (!result.errors || result.errors.length === 0) {
      throw new Error(
        `Expected GraphQL error containing "${expectedMessage}" but got no errors`,
      )
    }
    const error = result.errors[0]
    if (!error.message.includes(expectedMessage)) {
      throw new Error(
        `Expected error containing "${expectedMessage}" but got "${error.message}"`,
      )
    }
  },
}
