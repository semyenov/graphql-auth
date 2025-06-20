/**
 * Notification Service Adapter
 *
 * Interface and implementations for push notifications
 */

/**
 * Notification types
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * Notification interface
 */
export interface Notification {
  title: string
  body: string
  type?: NotificationType
  data?: Record<string, unknown>
  icon?: string
  badge?: string
  sound?: string
  tag?: string
  requireInteraction?: boolean
}

/**
 * Notification recipient
 */
export interface NotificationRecipient {
  userId: string
  tokens?: string[]
  preferences?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }
}

/**
 * Notification service interface
 */
export interface INotificationService {
  send(
    recipient: NotificationRecipient,
    notification: Notification,
  ): Promise<void>
  sendBatch(
    recipients: NotificationRecipient[],
    notification: Notification,
  ): Promise<void>
  subscribe(userId: string, token: string): Promise<void>
  unsubscribe(userId: string, token: string): Promise<void>
}

/**
 * Console notification service (for development)
 */
export class ConsoleNotificationService implements INotificationService {
  private subscriptions = new Map<string, Set<string>>()

  async send(
    recipient: NotificationRecipient,
    notification: Notification,
  ): Promise<void> {
    console.log('🔔 Notification sent:')
    console.log('To:', recipient.userId)
    console.log('Title:', notification.title)
    console.log('Body:', notification.body)
    console.log('Type:', notification.type || NotificationType.INFO)
    console.log('---')
  }

  async sendBatch(
    recipients: NotificationRecipient[],
    notification: Notification,
  ): Promise<void> {
    for (const recipient of recipients) {
      await this.send(recipient, notification)
    }
  }

  async subscribe(userId: string, token: string): Promise<void> {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set())
    }
    this.subscriptions.get(userId)?.add(token)
    console.log(`User ${userId} subscribed with token ${token}`)
  }

  async unsubscribe(userId: string, token: string): Promise<void> {
    this.subscriptions.get(userId)?.delete(token)
    console.log(`User ${userId} unsubscribed token ${token}`)
  }
}

/**
 * Firebase Cloud Messaging service
 */
export class FCMNotificationService implements INotificationService {
  async send(
    recipient: NotificationRecipient,
    notification: Notification,
  ): Promise<void> {
    if (!recipient.tokens || recipient.tokens.length === 0) {
      return
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens: recipient.tokens,
    }

    // In real implementation, use Firebase Admin SDK
    console.log('FCM: Sending notification', message)
  }

  async sendBatch(
    recipients: NotificationRecipient[],
    notification: Notification,
  ): Promise<void> {
    const tokens = recipients.flatMap((r) => r.tokens || [])
    if (tokens.length === 0) return

    // FCM supports multicast
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens,
    }

    console.log('FCM: Sending batch notification', message)
  }

  async subscribe(userId: string, token: string): Promise<void> {
    // In real app, store in database
    console.log('FCM: Subscribing user', userId, token)
  }

  async unsubscribe(userId: string, token: string): Promise<void> {
    // In real app, remove from database
    console.log('FCM: Unsubscribing user', userId, token)
  }
}

/**
 * Notification builder
 */
export class NotificationBuilder {
  private notification: Partial<Notification> = {}

  title(title: string): this {
    this.notification.title = title
    return this
  }

  body(body: string): this {
    this.notification.body = body
    return this
  }

  type(type: NotificationType): this {
    this.notification.type = type
    return this
  }

  data(data: Record<string, unknown>): this {
    this.notification.data = data
    return this
  }

  icon(icon: string): this {
    this.notification.icon = icon
    return this
  }

  build(): Notification {
    if (!(this.notification.title && this.notification.body)) {
      throw new Error('Title and body are required')
    }
    return this.notification as Notification
  }
}

/**
 * Notification templates
 */
export const notificationTemplates = {
  newPost: (data: { authorName: string; postTitle: string }): Notification => ({
    title: 'New Post Published',
    body: `${data.authorName} published "${data.postTitle}"`,
    type: NotificationType.INFO,
    data: { action: 'view_post' },
  }),

  newComment: (data: {
    commenterName: string
    postTitle: string
  }): Notification => ({
    title: 'New Comment',
    body: `${data.commenterName} commented on "${data.postTitle}"`,
    type: NotificationType.INFO,
    data: { action: 'view_comment' },
  }),

  newFollower: (data: { followerName: string }): Notification => ({
    title: 'New Follower',
    body: `${data.followerName} started following you`,
    type: NotificationType.SUCCESS,
    data: { action: 'view_profile' },
  }),

  systemAlert: (data: { message: string }): Notification => ({
    title: 'System Alert',
    body: data.message,
    type: NotificationType.WARNING,
    requireInteraction: true,
  }),
}

/**
 * Notification queue for batch processing
 */
export class NotificationQueue {
  private queue: Array<{
    recipient: NotificationRecipient
    notification: Notification
  }> = []
  private service: INotificationService
  private batchSize: number
  private flushInterval: number
  private timer?: NodeJS.Timeout

  constructor(
    service: INotificationService,
    options: { batchSize?: number; flushInterval?: number } = {},
  ) {
    this.service = service
    this.batchSize = options.batchSize || 100
    this.flushInterval = options.flushInterval || 5000

    this.startAutoFlush()
  }

  async add(
    recipient: NotificationRecipient,
    notification: Notification,
  ): Promise<void> {
    this.queue.push({ recipient, notification })

    if (this.queue.length >= this.batchSize) {
      await this.flush()
    }
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)

    // Group by notification for efficiency
    const groups = new Map<string, NotificationRecipient[]>()

    for (const item of batch) {
      const key = JSON.stringify(item.notification)
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)?.push(item.recipient)
    }

    // Send batches
    for (const [notificationKey, recipients] of groups) {
      const notification = JSON.parse(notificationKey)
      await this.service.sendBatch(recipients, notification)
    }
  }

  private startAutoFlush(): void {
    this.timer = setInterval(() => {
      this.flush().catch(console.error)
    }, this.flushInterval)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

/**
 * Create notification service based on environment
 */
export function createNotificationService(): INotificationService {
  if (process.env.FCM_PROJECT_ID) {
    return new FCMNotificationService()
  }

  return new ConsoleNotificationService()
}
