/**
 * Integration testing utilities for comprehensive GraphQL API testing
 */

import type { ApolloServer, GraphQLResponse } from '@apollo/server'
import type { Post, User } from '@prisma/client'
import type { TadaDocumentNode } from 'gql.tada'
import type { DocumentNode } from 'graphql'
import { print } from 'graphql'
import {
  CreatePostMutation,
  DeletePostMutation,
  LoginMutation,
  SignupMutation,
  TogglePublishPostMutation,
} from '../../../src/gql/mutations'
import { DraftsQuery, FeedQuery, PostQuery } from '../../../src/gql/queries'
import type { Context } from '../../../src/graphql/context/context.types'
import {
  createBlogScenario,
  createPermissionScenario,
} from '../fixtures/graphql.fixtures'
import { createMockContext, createTestServer } from './database.helpers'
import {
  measureOperation,
  type PerformanceMetrics,
} from './performance.helpers'
import {
  commonNormalizers,
  GraphQLSnapshotTester,
  type SnapshotResult,
} from './snapshot.helpers'
import {
  createSubscriptionHelper,
  type SubscriptionTestHelper,
} from './subscription.helpers'

export interface IntegrationTestContext {
  server: ApolloServer<Context>
  snapshotTester: GraphQLSnapshotTester
  scenarios: {
    blog?: Awaited<ReturnType<typeof createBlogScenario>>
    permissions?: Awaited<ReturnType<typeof createPermissionScenario>>
  }
  cleanup: () => Promise<void>
}

export interface IntegrationTestOptions {
  setupScenarios?: ('blog' | 'permissions')[]
  snapshotDir?: string
  updateSnapshots?: boolean
}

/**
 * Create an integration test context with pre-configured scenarios
 */
export async function createIntegrationTestContext(
  options: IntegrationTestOptions = {},
): Promise<IntegrationTestContext> {
  const server = createTestServer()
  const snapshotTester = new GraphQLSnapshotTester({
    baseDir: options.snapshotDir,
    update: options.updateSnapshots,
  })

  const scenarios: IntegrationTestContext['scenarios'] = {}
  const cleanupFns: Array<() => Promise<void>> = []

  // Setup requested scenarios
  if (options.setupScenarios?.includes('blog')) {
    scenarios.blog = await createBlogScenario()
  }

  if (options.setupScenarios?.includes('permissions')) {
    scenarios.permissions = await createPermissionScenario()
  }

  return {
    server,
    snapshotTester,
    scenarios,
    cleanup: async () => {
      for (const cleanupFn of cleanupFns) {
        await cleanupFn()
      }
    },
  }
}

/**
 * End-to-end test flow builder
 */
export class E2ETestFlow {
  private steps: Array<() => Promise<any>> = []
  private results: Map<string, any> = new Map()
  private context: IntegrationTestContext
  private performanceMetrics: Map<string, PerformanceMetrics> = new Map()
  private snapshotResults: Map<string, SnapshotResult> = new Map()

  constructor(context: IntegrationTestContext) {
    this.context = context
  }

  /**
   * Add a GraphQL query step
   */
  query<T = any>(
    name: string,
    operation: string | DocumentNode,
    variables: Record<string, any> = {},
    authContext?: Context,
  ): E2ETestFlow {
    this.steps.push(async () => {
      const operationStr =
        typeof operation === 'string' ? operation : print(operation)
      const ctx = authContext || createMockContext()

      const { result, metrics } = await measureOperation<T>(
        this.context.server,
        operationStr,
        variables,
        ctx,
      )

      this.results.set(name, result)
      this.performanceMetrics.set(name, metrics)

      // Test snapshot
      const snapshotResult = await this.context.snapshotTester.testSnapshot(
        result as GraphQLResponse,
        {
          name: `${name}-query`,
          normalizers: [commonNormalizers.timestamps, commonNormalizers.ids],
        },
      )
      this.snapshotResults.set(name, snapshotResult)

      return result
    })

    return this
  }

  /**
   * Add a GraphQL mutation step
   */
  mutation<T = any>(
    name: string,
    operation: string | DocumentNode,
    variables: Record<string, any> = {},
    authContext?: Context,
  ): E2ETestFlow {
    this.steps.push(async () => {
      const operationStr =
        typeof operation === 'string' ? operation : print(operation)
      const ctx = authContext || createMockContext()

      const { result, metrics } = await measureOperation<T>(
        this.context.server,
        operationStr,
        variables,
        ctx,
      )

      this.results.set(name, result)
      this.performanceMetrics.set(name, metrics)

      // Test snapshot
      const snapshotResult = await this.context.snapshotTester.testSnapshot(
        result as GraphQLResponse,
        {
          name: `${name}-mutation`,
          normalizers: [
            commonNormalizers.timestamps,
            commonNormalizers.ids,
            commonNormalizers.tokens,
          ],
        },
      )
      this.snapshotResults.set(name, snapshotResult)

      return result
    })

    return this
  }

  /**
   * Add a subscription step
   */
  subscription(
    name: string,
    operation: string | DocumentNode,
    variables: Record<string, any> = {},
    authContext?: Context,
  ): E2ETestFlow {
    let helper: SubscriptionTestHelper | null = null

    this.steps.push(async () => {
      const operationStr =
        typeof operation === 'string' ? operation : print(operation)
      const ctx = authContext || createMockContext()

      helper = await createSubscriptionHelper(
        this.context.server,
        operationStr,
        variables,
        ctx,
      )

      this.results.set(`${name}-subscription`, helper)
      return helper
    })

    // Add cleanup
    this.steps.push(async () => {
      if (helper && !helper.isClosed()) {
        await helper.close()
      }
    })

    return this
  }

  /**
   * Add an assertion step
   */
  assert(
    name: string,
    assertion: (results: Map<string, any>) => void | Promise<void>,
  ): E2ETestFlow {
    this.steps.push(async () => {
      try {
        await assertion(this.results)
      } catch (error: any) {
        throw new Error(`Assertion '${name}' failed: ${error.message}`)
      }
    })

    return this
  }

  /**
   * Add a custom step
   */
  step(
    name: string,
    fn: (results: Map<string, any>) => Promise<any>,
  ): E2ETestFlow {
    this.steps.push(async () => {
      const result = await fn(this.results)
      this.results.set(name, result)
      return result
    })

    return this
  }

  /**
   * Add a delay step
   */
  delay(ms: number): E2ETestFlow {
    this.steps.push(() => new Promise((resolve) => setTimeout(resolve, ms)))
    return this
  }

  /**
   * Execute the test flow
   */
  async execute(): Promise<{
    results: Map<string, any>
    performance: Map<string, PerformanceMetrics>
    snapshots: Map<string, SnapshotResult>
  }> {
    for (const step of this.steps) {
      await step()
    }

    return {
      results: this.results,
      performance: this.performanceMetrics,
      snapshots: this.snapshotResults,
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): string {
    const metrics = Array.from(this.performanceMetrics.entries())

    if (metrics.length === 0) {
      return 'No performance metrics collected'
    }

    const summary = metrics
      .map(([name, metric]) => {
        return `${name}: ${metric.executionTime.toFixed(2)}ms (${(metric.memoryUsed / 1024 / 1024).toFixed(2)}MB)`
      })
      .join('\n')

    const totalTime = metrics.reduce(
      (sum, [, metric]) => sum + metric.executionTime,
      0,
    )
    const avgTime = totalTime / metrics.length

    return `Performance Summary:\n${summary}\n\nTotal: ${totalTime.toFixed(2)}ms\nAverage: ${avgTime.toFixed(2)}ms`
  }
}

/**
 * Common test scenarios
 */
export const commonScenarios = {
  /**
   * Test user authentication flow
   */
  async authenticationFlow(
    context: IntegrationTestContext,
    credentials: { email: string; password: string; name?: string },
  ): Promise<{ user: User; token: string }> {
    const flow = new E2ETestFlow(context)

    const { results } = await flow
      .mutation('signup', SignupMutation, credentials)
      .assert('signup-success', (results) => {
        const response = results.get('signup')
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.data?.signup
        ) {
          throw new Error('Signup failed')
        }
      })
      .mutation('login', LoginMutation, {
        email: credentials.email,
        password: credentials.password,
      })
      .assert('login-success', (results) => {
        const response = results.get('login')
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.data?.login
        ) {
          throw new Error('Login failed')
        }
      })
      .execute()

    const signupResponse = results.get('signup')
    const loginResponse = results.get('login')

    return {
      user: signupResponse.body.singleResult.data.signup.user,
      token: loginResponse.body.singleResult.data.login,
    }
  },

  /**
   * Test post CRUD operations
   */
  async postCrudFlow(
    context: IntegrationTestContext,
    authContext: Context,
  ): Promise<{ posts: Post[] }> {
    const flow = new E2ETestFlow(context)

    const { results } = await flow
      .mutation(
        'create-draft',
        CreatePostMutation,
        {
          data: {
            title: 'Test Post',
            content: 'Test content',
          },
        },
        authContext,
      )
      .assert('draft-created', (results) => {
        const response = results.get('create-draft')
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.data?.createDraft
        ) {
          throw new Error('Failed to create draft')
        }
      })
      .query('my-drafts', DraftsQuery, { first: 10 }, authContext)
      .assert('drafts-fetched', (results) => {
        const response = results.get('my-drafts')
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.data?.drafts
        ) {
          throw new Error('Failed to fetch drafts')
        }
      })
      .step('get-post-id', async (results) => {
        const draftResponse = results.get('create-draft')
        return draftResponse.body.singleResult.data.createDraft.id
      })
      .mutation(
        'publish-post',
        TogglePublishPostMutation,
        {
          id: '', // Will be filled from previous step
        },
        authContext,
      )
      .query('feed', FeedQuery, { first: 10 })
      .assert('post-in-feed', (results) => {
        const response = results.get('feed')
        if (response.body.kind !== 'single') {
          throw new Error('Failed to fetch feed')
        }
        const feed = response.body.singleResult.data?.feed
        if (!feed || feed.edges.length === 0) {
          throw new Error('Post not found in feed')
        }
      })
      .execute()

    return {
      posts: [results.get('create-draft').body.singleResult.data.createDraft],
    }
  },

  /**
   * Test permission boundaries
   */
  async permissionBoundariesFlow(
    context: IntegrationTestContext,
    users: { owner: Context; other: Context },
    postId: string,
  ): Promise<void> {
    const flow = new E2ETestFlow(context)

    await flow
      // Owner can access their post
      .query('owner-access', PostQuery, { id: postId }, users.owner)
      .assert('owner-can-access', (results) => {
        const response = results.get('owner-access')
        if (
          response.body.kind !== 'single' ||
          response.body.singleResult.errors
        ) {
          throw new Error('Owner should be able to access their post')
        }
      })
      // Other user cannot delete owner's post
      .mutation(
        'other-delete-attempt',
        DeletePostMutation,
        { id: postId },
        users.other,
      )
      .assert('other-cannot-delete', (results) => {
        const response = results.get('other-delete-attempt')
        if (
          response.body.kind !== 'single' ||
          !response.body.singleResult.errors ||
          !response.body.singleResult.errors[0].message.includes(
            'only modify posts',
          )
        ) {
          throw new Error('Other user should not be able to delete post')
        }
      })
      // Owner can delete their post
      .mutation('owner-delete', DeletePostMutation, { id: postId }, users.owner)
      .assert('owner-can-delete', (results) => {
        const response = results.get('owner-delete')
        if (
          response.body.kind !== 'single' ||
          response.body.singleResult.errors
        ) {
          throw new Error('Owner should be able to delete their post')
        }
      })
      .execute()
  },
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
