/**
 * Enhanced type inference helpers using gql.tada for test utilities
 *
 * This module provides type-safe GraphQL test helpers with full
 * type inference for queries, mutations, and subscriptions
 */

import type { ApolloServer } from '@apollo/server'
import type { VariableValues as GraphQLVariableValues } from '@apollo/server/dist/esm/externalTypes/graphql'
import type { ResultOf, TadaDocumentNode } from 'gql.tada'
import { print } from 'graphql'
import type { DefaultContext } from '@/graphql/context/context.types'
import {
  executeOperation,
  extractGraphQLData,
  getGraphQLErrors,
} from '../core/graphql'
import { createSubscriptionHelper } from './subscription.helpers'

/**
 * Type-safe GraphQL test helper with full type inference
 */
export class GraphQLTestHelper {
  constructor(private server: ApolloServer<DefaultContext>) {}

  /**
   * Execute a query with full type inference
   */
  async query<
    TVariables extends GraphQLVariableValues,
    TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  >(
    document: TDocument,
    variables: TVariables,
    context?: DefaultContext,
  ): Promise<ResultOf<TDocument>> {
    const response = await executeOperation(
      this.server,
      print(document),
      variables,
      context,
    )
    return extractGraphQLData(response) as ResultOf<TDocument>
  }

  /**
   * Execute a mutation with full type inference
   */
  async mutate<
    TVariables extends GraphQLVariableValues,
    TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  >(
    document: TDocument,
    variables: TVariables,
    context?: DefaultContext,
  ): Promise<ResultOf<TDocument>> {
    const response = await executeOperation(
      this.server,
      print(document),
      variables,
      context,
    )
    return extractGraphQLData(response) as ResultOf<TDocument>
  }

  /**
   * Execute and expect an error with type inference
   */
  async expectError<
    TVariables extends GraphQLVariableValues,
    TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  >(
    document: TDocument,
    variables: TVariables,
    expectedError: string | RegExp,
    context?: DefaultContext,
  ): Promise<void> {
    const response = await executeOperation(
      this.server,
      print(document),
      variables,
      context,
    )
    const errors = getGraphQLErrors(response)

    if (errors.length === 0) {
      throw new Error('Expected errors but none were returned')
    }

    const error = errors[0]
    const errorMessage = error?.message || ''

    if (typeof expectedError === 'string') {
      if (!errorMessage.includes(expectedError)) {
        throw new Error(
          `Expected error containing "${expectedError}" but got "${errorMessage}"`,
        )
      }
    } else if (!expectedError.test(errorMessage)) {
      throw new Error(
        `Expected error matching ${expectedError} but got "${errorMessage}"`,
      )
    }
  }

  /**
   * Create a subscription helper with type inference
   */
  async subscribe<
    TVariables extends GraphQLVariableValues,
    TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  >(document: TDocument, variables: TVariables, context: DefaultContext) {
    const helper = await createSubscriptionHelper(
      this.server,
      print(document),
      variables as Record<string, unknown>,
      context,
    )

    return {
      ...helper,
      async getNextTyped(): Promise<ResultOf<TDocument>> {
        const response = await helper.getNext()
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.data
        ) {
          throw new Error('Expected subscription event to have data')
        }
        return response.body.singleResult.data as ResultOf<TDocument>
      },
    }
  }

  /**
   * Execute a subscription and wait for a specific event
   */
  async waitForSubscriptionEvent<
    TVariables extends GraphQLVariableValues,
    TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  >(
    document: TDocument,
    variables: TVariables,
    context: DefaultContext,
    triggerFn: () => Promise<void>,
  ): Promise<ResultOf<TDocument>> {
    const helper = await this.subscribe(document, variables, context)

    try {
      // Trigger the event
      await triggerFn()

      // Get the typed result
      return await helper.getNextTyped()
    } finally {
      await helper.close()
    }
  }
}

/**
 * Create a type-safe GraphQL test helper
 */
export function createGraphQLTestHelper(
  server: ApolloServer<DefaultContext>,
): GraphQLTestHelper {
  return new GraphQLTestHelper(server)
}

/**
 * Type guard to check if a value matches the expected type
 */
export function assertType<T>(_value: unknown): asserts _value is T {
  // This is a compile-time assertion
  // The actual runtime check would depend on your specific needs
}

/**
 * Type-safe result extractor with deep property access
 */
export function extractResult<
  TVariables extends GraphQLVariableValues,
  TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
  TPath extends string,
>(
  result: ResultOf<TDocument>,
  path: TPath,
): DeepPropertyAccess<ResultOf<TDocument>, TPath> {
  const keys = path.split('.')
  let current: unknown = result

  for (const key of keys) {
    if (current == null) {
      throw new Error(`Cannot access "${key}" on null/undefined`)
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current as DeepPropertyAccess<ResultOf<TDocument>, TPath>
}

// Helper type for deep property access
type DeepPropertyAccess<
  T,
  Path extends string,
> = Path extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? DeepPropertyAccess<T[K], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never

/**
 * Type-safe mock data generator
 */
export function createMockData<T extends Record<string, unknown>>(
  schema: T,
): T {
  // This is a placeholder - you would implement actual mock generation
  return schema
}

/**
 * Type-safe GraphQL variable builder
 */
export class VariableBuilder<TVariables extends Record<string, unknown>> {
  private variables: Partial<TVariables> = {}

  set<K extends keyof TVariables>(key: K, value: TVariables[K]): this {
    this.variables[key] = value
    return this
  }

  build(): TVariables {
    // Validate that all required fields are set
    // This would need runtime validation based on your schema
    return this.variables as TVariables
  }
}

/**
 * Create a type-safe variable builder
 */
export function buildVariables<
  TVariables extends GraphQLVariableValues,
  TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
>(): VariableBuilder<TVariables> {
  return new VariableBuilder<TVariables>()
}

/**
 * Type-safe result matcher for testing
 */
export function matchResult<
  TVariables extends GraphQLVariableValues,
  TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
>(
  result: ResultOf<TDocument>,
  expected: Partial<ResultOf<TDocument>>,
): boolean {
  return Object.entries(expected).every(([key, value]) => {
    const resultValue = (result as never)[key]

    if (typeof value === 'object' && value !== null) {
      return matchResult(resultValue, value as never)
    }

    return resultValue === value
  })
}

/**
 * Type-safe snapshot testing helper
 */
export function createGraphQLSnapshot<
  TVariables extends GraphQLVariableValues,
  TDocument extends TadaDocumentNode<ResultOf<TDocument>, TVariables>,
>(document: TDocument, variables: TVariables, result: ResultOf<TDocument>) {
  return {
    query: print(document),
    variables,
    result,
    timestamp: new Date().toISOString(),
  }
}
