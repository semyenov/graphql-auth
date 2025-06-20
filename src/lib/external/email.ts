/**
 * Email Service Adapter
 *
 * Interface and implementations for email sending
 */

/**
 * Email message interface
 */
export interface EmailMessage {
  to: string | string[]
  from?: string
  subject: string
  html?: string
  text?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

/**
 * Email service interface
 */
export interface IEmailService {
  send(message: EmailMessage): Promise<void>
  sendBatch(messages: EmailMessage[]): Promise<void>
  validateEmail(email: string): boolean
}

/**
 * Console email service (for development)
 */
export class ConsoleEmailService implements IEmailService {
  async send(message: EmailMessage): Promise<void> {
    console.log('📧 Email sent:')
    console.log(
      'To:',
      Array.isArray(message.to) ? message.to.join(', ') : message.to,
    )
    console.log('Subject:', message.subject)
    console.log('Content:', message.text || message.html)
    console.log('---')
  }

  async sendBatch(messages: EmailMessage[]): Promise<void> {
    for (const message of messages) {
      await this.send(message)
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

/**
 * SMTP email service (using nodemailer)
 */
export class SmtpEmailService implements IEmailService {
  async send(message: EmailMessage): Promise<void> {
    // In real implementation, use nodemailer to send
    console.log('SMTP: Sending email to', message.to)
  }

  async sendBatch(messages: EmailMessage[]): Promise<void> {
    // Could optimize with connection pooling
    await Promise.all(messages.map((msg) => this.send(msg)))
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

/**
 * Email template builder
 */
export class EmailTemplateBuilder {
  private templates = new Map<string, (data: unknown) => EmailMessage>()

  register(name: string, template: (data: unknown) => EmailMessage): void {
    this.templates.set(name, template)
  }

  build(name: string, data: unknown): EmailMessage {
    const template = this.templates.get(name)
    if (!template) {
      throw new Error(`Email template "${name}" not found`)
    }
    return template(data)
  }
}

/**
 * Pre-built email templates
 */
export const emailTemplates = {
  welcome: (data: { name: string; email: string }): EmailMessage => ({
    to: data.email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h1>Welcome, ${data.name}!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `,
    text: `Welcome, ${data.name}! Thank you for joining our platform.`,
  }),

  passwordReset: (data: {
    name: string
    email: string
    resetUrl: string
  }): EmailMessage => ({
    to: data.email,
    subject: 'Reset Your Password',
    html: `
      <h1>Hi ${data.name},</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${data.resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Hi ${data.name}, Reset your password: ${data.resetUrl}`,
  }),

  emailVerification: (data: {
    name: string
    email: string
    verifyUrl: string
  }): EmailMessage => ({
    to: data.email,
    subject: 'Verify Your Email Address',
    html: `
      <h1>Hi ${data.name},</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${data.verifyUrl}">Verify Email</a></p>
      <p>This link will expire in 24 hours.</p>
    `,
    text: `Hi ${data.name}, Verify your email: ${data.verifyUrl}`,
  }),
}

/**
 * Create email service based on environment
 */
export function createEmailService(): IEmailService {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return new SmtpEmailService()
  }

  return new ConsoleEmailService()
}
