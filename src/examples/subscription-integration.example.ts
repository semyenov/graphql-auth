/**
 * Subscription System Integration Example
 *
 * Demonstrates how the real-time subscription system integrates with domain events
 * and the existing GraphQL infrastructure.
 */

import 'reflect-metadata'
import { container } from 'tsyringe'
import { InMemorySubscriptionManager } from '../shared/infrastructure/subscriptions/in-memory-subscription.manager'
import { MockSubscriptionTransport } from '../shared/infrastructure/subscriptions/mock-transport'
import { PresenceManager } from '../shared/infrastructure/subscriptions/presence.manager'
import type { IPresenceManager } from '../shared/infrastructure/subscriptions/subscription.interfaces'
import type { ISubscriptionTransport } from '../shared/infrastructure/subscriptions/transport.interfaces'

/**
 * Example: Setting up the subscription system
 */
export function setupSubscriptionSystem() {
  console.log('🚀 Setting up real-time subscription system...')

  // Create and register transport layer
  const transport = new MockSubscriptionTransport()
  container.registerInstance<ISubscriptionTransport>(
    'ISubscriptionTransport',
    transport,
  )

  // Create and register subscription manager
  const subscriptionManager = new InMemorySubscriptionManager(transport)
  container.registerInstance('ISubscriptionManager', subscriptionManager)

  // Create and register presence manager
  const presenceManager = new PresenceManager()
  container.registerInstance<IPresenceManager>(
    'IPresenceManager',
    presenceManager,
  )

  console.log('✅ Subscription system initialized')

  return {
    transport,
    subscriptionManager,
    presenceManager,
  }
}

/**
 * Example: Simulating real-time user interactions
 */
export async function simulateUserActivity() {
  const { transport, subscriptionManager, presenceManager } =
    setupSubscriptionSystem()

  console.log('\n📡 Simulating user activity...')

  // Simulate user connecting
  const connectionId = 'user-conn-123'
  const sessionId = 'session-abc'
  const userId = '42'

  // 1. User connects via WebSocket (simulated)
  transport.simulateConnect(connectionId, { userAgent: 'Mozilla/5.0...' })

  // 2. User registers their session
  await subscriptionManager.registerSession(sessionId, connectionId, userId, {
    device: 'web',
    timezone: 'UTC',
  })

  // 3. Track user presence
  await presenceManager.addConnection(userId, connectionId)

  // 4. User subscribes to their profile updates
  await subscriptionManager.subscribe(sessionId, 'profile-updates', {
    entityType: 'User',
    entityId: userId,
    eventType: 'user.profile.updated',
  })

  // 5. User subscribes to posts they're interested in
  await subscriptionManager.subscribe(sessionId, 'post-updates', {
    entityType: 'Post',
    eventType: 'post.created',
    tags: ['following'],
  })

  // 6. Simulate domain events being published
  console.log('\n📊 Publishing domain events...')

  // Profile update event
  await subscriptionManager.publish({
    id: 'event-1',
    type: 'user.profile.updated',
    data: { name: 'John Doe Updated', bio: 'New bio' },
    timestamp: new Date(),
    userId: userId,
    entityType: 'User',
    entityId: userId,
  })

  // Post creation event (with matching tag)
  await subscriptionManager.publish({
    id: 'event-2',
    type: 'post.created',
    data: { title: 'New Post', content: 'Hello world!' },
    timestamp: new Date(),
    entityType: 'Post',
    entityId: '101',
    metadata: { tags: ['following'], authorId: '99' },
  })

  // Non-matching event (different user)
  await subscriptionManager.publish({
    id: 'event-3',
    type: 'user.profile.updated',
    data: { name: 'Jane Doe' },
    timestamp: new Date(),
    userId: '999', // Different user
    entityType: 'User',
    entityId: '999',
  })

  // 7. Check messages received by user
  const messages = transport.getMessages(connectionId)
  console.log(`\n📥 User received ${messages.length} real-time messages:`)
  messages.forEach((msg, idx) => {
    console.log(`  ${idx + 1}. ${msg.data.type} - ${msg.data.payload.type}`)
  })

  // 8. Get presence and subscription statistics
  const presenceStats = presenceManager.getStatistics()
  const subscriptionStats = await subscriptionManager.getStatistics()

  console.log('\n📊 System Statistics:')
  console.log('Presence:', presenceStats)
  console.log('Subscriptions:', subscriptionStats)

  // 9. Simulate user disconnect
  transport.simulateDisconnect(connectionId)
  await presenceManager.removeConnection(userId, connectionId)

  console.log('\n👋 User disconnected')

  return {
    messagesReceived: messages.length,
    presenceStats,
    subscriptionStats,
  }
}

/**
 * Example: Integration with GraphQL subscriptions
 */
export function documentGraphQLSubscriptionIntegration() {
  console.log('\n🎯 GraphQL Subscription Integration:')
  console.log(
    '1. GraphQL subscription fields defined in users-subscriptions.resolver.ts',
  )
  console.log('2. Real-time transport layer handles WebSocket/SSE connections')
  console.log(
    '3. Subscription manager filters events based on user subscriptions',
  )
  console.log('4. Domain events automatically trigger real-time updates')
  console.log('5. Presence manager tracks user online status')

  console.log('\n📋 Client-side usage:')
  console.log(`
subscription UserEvents {
  userEvents(filter: { eventType: USER_PROFILE_UPDATED }) {
    id
    type
    data
    timestamp
  }
}

subscription PresenceUpdates {
  presenceUpdates(userIds: ["1", "2", "3"]) {
    userId
    status
    lastSeen
    connectionCount
  }
}
  `)

  console.log('\n🔧 Server integration:')
  console.log('- Domain events automatically broadcast to matching subscribers')
  console.log('- GraphQL context provides access to subscription manager')
  console.log('- Authentication and authorization applied to subscriptions')
  console.log('- Rate limiting and filtering prevent spam')
}

/**
 * Run the complete example
 */
export async function runSubscriptionExample() {
  console.log('🌟 Real-Time Subscription System Example\n')

  try {
    const results = await simulateUserActivity()
    documentGraphQLSubscriptionIntegration()

    console.log('\n✅ Example completed successfully!')
    console.log(
      `📊 Summary: User received ${results.messagesReceived} real-time messages`,
    )

    return results
  } catch (error) {
    console.error('❌ Example failed:', error)
    throw error
  }
}

// Export for potential scripting
if (require.main === module) {
  runSubscriptionExample().catch(console.error)
}
