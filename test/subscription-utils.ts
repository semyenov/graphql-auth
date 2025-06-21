/**
 * GraphQL subscription testing utilities
 */

import type { GraphQLResponse } from '@apollo/server'
import { ApolloServer } from '@apollo/server'
import { parse } from 'graphql'
import { Context } from '../src/graphql/context/context.types'

export interface SubscriptionTestHelper {
  subscribe: () => Promise<AsyncIterator<GraphQLResponse>>
  getNext: () => Promise<GraphQLResponse>
  getAll: (count: number) => Promise<GraphQLResponse[]>
  close: () => Promise<void>
  isClosed: () => boolean
}

/**
 * Create a subscription test helper
 */
export async function createSubscriptionHelper(
  server: ApolloServer<Context>,
  subscription: string,
  variables: Record<string, any>,
  context: Context,
): Promise<SubscriptionTestHelper> {
  const document = parse(subscription)

  const result = await server.executeOperation(
    {
      query: document,
      variables,
    },
    { contextValue: context },
  )

  if (result.body.kind !== 'incremental' || !result.body.initialResult.data) {
    throw new Error('Expected subscription to return incremental result')
  }

  const asyncIterator = result.body.subsequentResults as unknown as AsyncIterator<GraphQLResponse>
  let closed = false

  return {
    subscribe: async () => asyncIterator,

    getNext: async () => {
      if (closed) {
        throw new Error('Subscription is closed')
      }
      const { value, done } = await asyncIterator.next()
      if (done) {
        closed = true
        throw new Error('Subscription completed')
      }
      return value
    },

    getAll: async (count: number) => {
      const results: GraphQLResponse[] = []
      for (let i = 0; i < count; i++) {
        const { value, done } = await asyncIterator.next()
        if (done) {
          closed = true
          break
        }
        results.push(value)
      }
      return results
    },

    close: async () => {
      if (!closed && asyncIterator.return) {
        await asyncIterator.return()
        closed = true
      }
    },

    isClosed: () => closed,
  }
}

/**
 * Test subscription with timeout
 */
export async function testSubscriptionWithTimeout(
  server: ApolloServer<Context>,
  subscription: string,
  variables: Record<string, any>,
  context: Context,
  options: {
    expectedEvents: number
    timeout?: number
    validator?: (event: any) => void
  },
): Promise<GraphQLResponse[]> {
  const helper = await createSubscriptionHelper(server, subscription, variables, context)
  const timeout = options.timeout ?? 5000
  const results: GraphQLResponse[] = []

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Subscription timeout')), timeout),
    )

    const eventsPromise = (async () => {
      for (let i = 0; i < options.expectedEvents; i++) {
        const event = await helper.getNext()
        results.push(event)

        if (options.validator && event.body.kind === 'single' && event.body.singleResult.data) {
          options.validator(event.body.singleResult.data)
        }
      }
      return results
    })()

    return await Promise.race([eventsPromise, timeoutPromise])
  } finally {
    await helper.close()
  }
}

/**
 * Mock subscription event emitter for testing
 */
export class MockSubscriptionEmitter<T = any> {
  private subscribers: Set<(value: T) => void> = new Set()

  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  emit(value: T): void {
    this.subscribers.forEach(callback => callback(value))
  }

  getSubscriberCount(): number {
    return this.subscribers.size
  }

  clear(): void {
    this.subscribers.clear()
  }
}

/**
 * Create a mock pubsub for testing subscriptions
 */
export function createMockPubSub(): {
  publish: (event: string, payload: any) => void
  subscribe: (event: string) => AsyncIterator<any>
  getSubscriberCount: (event?: string) => number
} {
  const emitters = new Map<string, MockSubscriptionEmitter>()

  return {
    publish: (event: string, payload: any) => {
      const emitter = emitters.get(event)
      if (emitter) {
        emitter.emit(payload)
      }
    },

    subscribe: (event: string) => {
      if (!emitters.has(event)) {
        emitters.set(event, new MockSubscriptionEmitter())
      }
      const emitter = emitters.get(event)!

      const queue: any[] = []
      const resolvers: ((value: IteratorResult<any>) => void)[] = []

      const unsubscribe = emitter.subscribe((value) => {
        const resolver = resolvers.shift()
        if (resolver) {
          resolver({ value, done: false })
        } else {
          queue.push(value)
        }
      })

      return {
        async next() {
          const value = queue.shift()
          if (value !== undefined) {
            return { value, done: false }
          }

          return new Promise<IteratorResult<any>>((resolve) => {
            resolvers.push(resolve)
          })
        },

        async return() {
          unsubscribe()
          return { value: undefined, done: true }
        },

        async throw(error: any) {
          unsubscribe()
          throw error
        },

        [Symbol.asyncIterator]() {
          return this
        },
      }
    },

    getSubscriberCount: (event?: string) => {
      if (event) {
        return emitters.get(event)?.getSubscriberCount() ?? 0
      }
      return Array.from(emitters.values()).reduce(
        (sum, emitter) => sum + emitter.getSubscriberCount(),
        0,
      )
    },
  }
}

/**
 * Wait for subscription to be ready
 */
export async function waitForSubscription(
  checkFn: () => boolean,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const timeout = options.timeout ?? 5000
  const interval = options.interval ?? 100
  const startTime = Date.now()

  while (!checkFn()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for subscription')
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
}

/**
 * Create a subscription tester with common assertions
 */
export function createSubscriptionTester(server: ApolloServer<Context>) {
  return {
    async expectSubscriptionEvent<T = any>(
      subscription: string,
      variables: Record<string, any>,
      context: Context,
      triggerFn: () => Promise<void>,
      validator?: (data: T) => void,
    ): Promise<T> {
      const helper = await createSubscriptionHelper(server, subscription, variables, context)

      try {
        // Trigger the event
        await triggerFn()

        // Get the next event
        const event = await helper.getNext()

        if (event.body.kind !== 'single' || !event.body.singleResult.data) {
          throw new Error('Expected subscription event to have data')
        }

        if (validator) {
          validator(event.body.singleResult.data as T)
        }

        return event.body.singleResult.data as T
      } finally {
        await helper.close()
      }
    },

    async expectNoSubscriptionEvent(
      subscription: string,
      variables: Record<string, any>,
      context: Context,
      triggerFn: () => Promise<void>,
      waitTime: number = 1000,
    ): Promise<void> {
      const helper = await createSubscriptionHelper(server, subscription, variables, context)

      try {
        // Trigger the event
        await triggerFn()

        // Wait and ensure no event is received
        const timeoutPromise = new Promise<void>(resolve => setTimeout(resolve, waitTime))
        const eventPromise = helper.getNext().then(() => {
          throw new Error('Unexpected subscription event received')
        })

        await Promise.race([timeoutPromise, eventPromise])
      } finally {
        await helper.close()
      }
    },

    async expectSubscriptionError(
      subscription: string,
      variables: Record<string, any>,
      context: Context,
      expectedError: string,
    ): Promise<void> {
      try {
        await createSubscriptionHelper(server, subscription, variables, context)
        throw new Error('Expected subscription to fail')
      } catch (error: any) {
        if (!error.message.includes(expectedError)) {
          throw error
        }
      }
    },
  }
}