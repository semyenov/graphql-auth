/**
 * Module Bus Interface
 * Following modular monolith pattern - enables pub-sub communication between modules
 *
 * This is the central messaging infrastructure that allows modules to communicate
 * without tight coupling. Based on the modular monolith pattern from the search results.
 */

// Base message interface that all module messages must implement
export interface ModuleMessage {
  type: string
  moduleId: string
  timestamp: Date
  correlationId?: string
  metadata?: Record<string, unknown>
}

// Message handler interface
export interface MessageHandler<T extends ModuleMessage = ModuleMessage> {
  handle(message: T): Promise<void> | void
}

// Subscription interface
export interface MessageSubscription {
  messageType: string
  moduleId: string
  handler: MessageHandler
  unsubscribe(): void
}

// Message publishing options
export interface PublishOptions {
  correlationId?: string
  metadata?: Record<string, unknown>
  async?: boolean // Whether to process asynchronously (default: true)
}

// Message filtering options
export interface MessageFilter {
  messageType?: string
  moduleId?: string
  correlationId?: string
  fromTimestamp?: Date
  toTimestamp?: Date
}

/**
 * Core Module Bus Interface
 *
 * Provides the contract for inter-module communication. This interface
 * can be implemented with in-memory messaging or external message brokers.
 */
export interface IModuleBus {
  /**
   * Publish a message to all interested subscribers
   */
  publish<T extends ModuleMessage>(
    message: T,
    options?: PublishOptions,
  ): Promise<void>

  /**
   * Subscribe to messages of a specific type
   */
  subscribe<T extends ModuleMessage>(
    messageType: string,
    handler: MessageHandler<T>,
    moduleId?: string,
  ): MessageSubscription

  /**
   * Subscribe to multiple message types with a single handler
   */
  subscribeToMultiple<T extends ModuleMessage>(
    messageTypes: string[],
    handler: MessageHandler<T>,
    moduleId?: string,
  ): MessageSubscription[]

  /**
   * Unsubscribe from a specific message type
   */
  unsubscribe(subscription: MessageSubscription): void

  /**
   * Unsubscribe all handlers for a module
   */
  unsubscribeModule(moduleId: string): void

  /**
   * Get active subscriptions (for debugging/monitoring)
   */
  getSubscriptions(filter?: MessageFilter): MessageSubscription[]

  /**
   * Get message history (for debugging/monitoring)
   */
  getMessageHistory(filter?: MessageFilter, limit?: number): ModuleMessage[]

  /**
   * Clear message history
   */
  clearMessageHistory(): void

  /**
   * Check if a module has subscribers for a message type
   */
  hasSubscribers(messageType: string): boolean

  /**
   * Get statistics about messaging activity
   */
  getStatistics(): MessageBusStatistics
}

/**
 * Message bus statistics interface
 */
export interface MessageBusStatistics {
  totalMessagesPublished: number
  totalMessagesProcessed: number
  totalSubscriptions: number
  activeModules: string[]
  messageTypeStats: Record<
    string,
    {
      published: number
      processed: number
      failed: number
    }
  >
  averageProcessingTime: number
  lastActivityTimestamp?: Date
}

/**
 * Base error for module bus operations
 */
export class ModuleBusError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly moduleId?: string,
  ) {
    super(message)
    this.name = 'ModuleBusError'
  }
}

export class MessagePublishError extends ModuleBusError {
  constructor(messageType: string, moduleId?: string) {
    super(
      `Failed to publish message of type ${messageType}`,
      'MESSAGE_PUBLISH_FAILED',
      moduleId,
    )
  }
}

export class MessageHandlerError extends ModuleBusError {
  constructor(messageType: string, error: Error, moduleId?: string) {
    super(
      `Message handler failed for type ${messageType}: ${error.message}`,
      'MESSAGE_HANDLER_FAILED',
      moduleId,
    )
  }
}

export class SubscriptionError extends ModuleBusError {
  constructor(messageType: string, moduleId?: string) {
    super(
      `Failed to create subscription for type ${messageType}`,
      'SUBSCRIPTION_FAILED',
      moduleId,
    )
  }
}
