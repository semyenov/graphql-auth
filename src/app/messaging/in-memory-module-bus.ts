/**
 * In-Memory Module Bus Implementation
 * Following modular monolith pattern - provides in-memory pub-sub messaging between modules
 *
 * This implementation provides fast, synchronous/asynchronous message delivery
 * within the same application process.
 */

import { injectable } from 'tsyringe'
import { Services } from '@/app/config/service-registry'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import type {
  IModuleBus,
  MessageBusStatistics,
  MessageFilter,
  MessageHandler,
  MessageSubscription,
  ModuleMessage,
  PublishOptions,
} from './module-bus.interface'
import {
  MessageHandlerError,
  MessagePublishError,
  SubscriptionError,
} from './module-bus.interface'

@injectable()
export class InMemoryModuleBus implements IModuleBus {
  private subscriptions = new Map<string, MessageSubscription[]>()
  private messageHistory: ModuleMessage[] = []
  private statistics: MessageBusStatistics = {
    totalMessagesPublished: 0,
    totalMessagesProcessed: 0,
    totalSubscriptions: 0,
    activeModules: [],
    messageTypeStats: {},
    averageProcessingTime: 0,
  }
  private processingTimes: number[] = []
  private readonly maxHistorySize = 1000 // Keep last 1000 messages

  async publish<T extends ModuleMessage>(
    message: T,
    options: PublishOptions = {},
  ): Promise<void> {
    const logger = Services.logger.child({
      context: 'ModuleBus',
      operation: 'publish',
      messageType: message.type,
      moduleId: message.moduleId,
    })

    try {
      logger.debug('Publishing message', { message, options })

      // Add metadata from options
      const enrichedMessage: T = {
        ...message,
        timestamp: new Date(),
        correlationId: options.correlationId || message.correlationId,
        metadata: { ...message.metadata, ...options.metadata },
      }

      // Add to history
      this.addToHistory(enrichedMessage)

      // Update statistics
      this.updatePublishStats(enrichedMessage.type)

      // Get subscribers for this message type
      const messageSubscriptions =
        this.subscriptions.get(enrichedMessage.type) || []

      if (messageSubscriptions.length === 0) {
        logger.debug('No subscribers found for message type', {
          messageType: enrichedMessage.type,
        })
        return
      }

      // Process subscriptions
      const isAsync = options.async !== false // Default to async

      if (isAsync) {
        // Process asynchronously
        this.processSubscriptionsAsync(
          enrichedMessage,
          messageSubscriptions,
          logger,
        )
      } else {
        // Process synchronously
        await this.processSubscriptionsSync(
          enrichedMessage,
          messageSubscriptions,
          logger,
        )
      }

      logger.debug('Message published successfully', {
        messageType: enrichedMessage.type,
        subscriberCount: messageSubscriptions.length,
        async: isAsync,
      })
    } catch (error) {
      logger.error(
        'Failed to publish message',
        error instanceof Error ? error : undefined,
        { message, options },
      )
      throw new MessagePublishError(message.type, message.moduleId)
    }
  }

  subscribe<T extends ModuleMessage>(
    messageType: string,
    handler: MessageHandler<T>,
    moduleId = 'unknown',
  ): MessageSubscription {
    const logger = Services.logger.child({
      context: 'ModuleBus',
      operation: 'subscribe',
      messageType,
      moduleId,
    })

    try {
      logger.debug('Creating subscription', { messageType, moduleId })

      const subscription: MessageSubscription = {
        messageType,
        moduleId,
        handler: handler as MessageHandler,
        unsubscribe: () => this.unsubscribe(subscription),
      }

      // Add to subscriptions map
      if (!this.subscriptions.has(messageType)) {
        this.subscriptions.set(messageType, [])
      }
      this.subscriptions.get(messageType)?.push(subscription)

      // Update statistics
      this.updateSubscriptionStats(moduleId)

      logger.debug('Subscription created successfully', {
        messageType,
        moduleId,
      })
      return subscription
    } catch (error) {
      logger.error(
        'Failed to create subscription',
        error instanceof Error ? error : undefined,
        {
          messageType,
          moduleId,
        },
      )
      throw new SubscriptionError(messageType, moduleId)
    }
  }

  subscribeToMultiple<T extends ModuleMessage>(
    messageTypes: string[],
    handler: MessageHandler<T>,
    moduleId = 'unknown',
  ): MessageSubscription[] {
    return messageTypes.map((messageType) =>
      this.subscribe(messageType, handler, moduleId),
    )
  }

  unsubscribe(subscription: MessageSubscription): void {
    const subscriptions = this.subscriptions.get(subscription.messageType)
    if (subscriptions) {
      const index = subscriptions.indexOf(subscription)
      if (index > -1) {
        subscriptions.splice(index, 1)

        // Clean up empty arrays
        if (subscriptions.length === 0) {
          this.subscriptions.delete(subscription.messageType)
        }

        // Update statistics
        this.statistics.totalSubscriptions = Math.max(
          0,
          this.statistics.totalSubscriptions - 1,
        )
        this.updateActiveModules()
      }
    }
  }

  unsubscribeModule(moduleId: string): void {
    let removedCount = 0

    for (const [messageType, subscriptions] of this.subscriptions.entries()) {
      const filtered = subscriptions.filter((sub) => sub.moduleId !== moduleId)
      removedCount += subscriptions.length - filtered.length

      if (filtered.length === 0) {
        this.subscriptions.delete(messageType)
      } else {
        this.subscriptions.set(messageType, filtered)
      }
    }

    // Update statistics
    this.statistics.totalSubscriptions = Math.max(
      0,
      this.statistics.totalSubscriptions - removedCount,
    )
    this.updateActiveModules()
  }

  getSubscriptions(filter?: MessageFilter): MessageSubscription[] {
    const allSubscriptions: MessageSubscription[] = []

    for (const subscriptions of this.subscriptions.values()) {
      allSubscriptions.push(...subscriptions)
    }

    if (!filter) {
      return allSubscriptions
    }

    return allSubscriptions.filter((sub) => {
      if (filter.messageType && sub.messageType !== filter.messageType)
        return false
      if (filter.moduleId && sub.moduleId !== filter.moduleId) return false
      return true
    })
  }

  getMessageHistory(filter?: MessageFilter, limit = 100): ModuleMessage[] {
    let messages = [...this.messageHistory]

    if (filter) {
      messages = messages.filter((msg) => {
        if (filter.messageType && msg.type !== filter.messageType) return false
        if (filter.moduleId && msg.moduleId !== filter.moduleId) return false
        if (filter.correlationId && msg.correlationId !== filter.correlationId)
          return false
        if (filter.fromTimestamp && msg.timestamp < filter.fromTimestamp)
          return false
        if (filter.toTimestamp && msg.timestamp > filter.toTimestamp)
          return false
        return true
      })
    }

    return messages.slice(-limit).reverse() // Most recent first
  }

  clearMessageHistory(): void {
    this.messageHistory = []
  }

  hasSubscribers(messageType: string): boolean {
    const subscriptions = this.subscriptions.get(messageType)
    return subscriptions !== undefined && subscriptions.length > 0
  }

  getStatistics(): MessageBusStatistics {
    return {
      ...this.statistics,
      lastActivityTimestamp:
        this.messageHistory.length > 0
          ? this.messageHistory[this.messageHistory.length - 1]?.timestamp
          : undefined,
    }
  }

  // Private helper methods

  private async processSubscriptionsSync<T extends ModuleMessage>(
    message: T,
    subscriptions: MessageSubscription[],
    logger: ILogger,
  ): Promise<void> {
    for (const subscription of subscriptions) {
      await this.processSubscription(message, subscription, logger)
    }
  }

  private processSubscriptionsAsync<T extends ModuleMessage>(
    message: T,
    subscriptions: MessageSubscription[],
    logger: ILogger,
  ): void {
    // Process each subscription in parallel
    Promise.all(
      subscriptions.map((subscription) =>
        this.processSubscription(message, subscription, logger),
      ),
    ).catch((error) => {
      logger.error(
        'Error in async message processing',
        error instanceof Error ? error : undefined,
        {
          messageType: message.type,
        },
      )
    })
  }

  private async processSubscription<T extends ModuleMessage>(
    message: T,
    subscription: MessageSubscription,
    logger: ILogger,
  ): Promise<void> {
    const startTime = Date.now()

    try {
      await subscription.handler.handle(message)

      const processingTime = Date.now() - startTime
      this.recordProcessingTime(processingTime)
      this.updateProcessedStats(message.type)

      logger.debug('Message processed successfully', {
        messageType: message.type,
        moduleId: subscription.moduleId,
        processingTime,
      })
    } catch (error) {
      const processingTime = Date.now() - startTime
      this.recordProcessingTime(processingTime)
      this.updateFailedStats(message.type)

      logger.error(
        'Message handler failed',
        error instanceof Error ? error : undefined,
        {
          messageType: message.type,
          moduleId: subscription.moduleId,
          processingTime,
        },
      )

      throw new MessageHandlerError(
        message.type,
        error as Error,
        subscription.moduleId,
      )
    }
  }

  private addToHistory(message: ModuleMessage): void {
    this.messageHistory.push(message)

    // Keep history size under control
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistorySize)
    }
  }

  private updatePublishStats(messageType: string): void {
    this.statistics.totalMessagesPublished++

    if (!this.statistics.messageTypeStats[messageType]) {
      this.statistics.messageTypeStats[messageType] = {
        published: 0,
        processed: 0,
        failed: 0,
      }
    }

    this.statistics.messageTypeStats[messageType].published++
  }

  private updateProcessedStats(messageType: string): void {
    this.statistics.totalMessagesProcessed++

    if (this.statistics.messageTypeStats[messageType]) {
      this.statistics.messageTypeStats[messageType].processed++
    }
  }

  private updateFailedStats(messageType: string): void {
    if (this.statistics.messageTypeStats[messageType]) {
      this.statistics.messageTypeStats[messageType].failed++
    }
  }

  private updateSubscriptionStats(_moduleId: string): void {
    this.statistics.totalSubscriptions++
    this.updateActiveModules()
  }

  private updateActiveModules(): void {
    const activeModules = new Set<string>()

    for (const subscriptions of this.subscriptions.values()) {
      for (const subscription of subscriptions) {
        activeModules.add(subscription.moduleId)
      }
    }

    this.statistics.activeModules = Array.from(activeModules)
  }

  private recordProcessingTime(time: number): void {
    this.processingTimes.push(time)

    // Keep only last 1000 processing times for average calculation
    if (this.processingTimes.length > 1000) {
      this.processingTimes = this.processingTimes.slice(-1000)
    }

    // Update average
    this.statistics.averageProcessingTime =
      this.processingTimes.reduce((sum, time) => sum + time, 0) /
      this.processingTimes.length
  }
}
