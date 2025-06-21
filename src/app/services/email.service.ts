/**
 * Email Service
 *
 * Service for sending emails (verification, password reset, etc.)
 * This is a mock implementation - in production, integrate with a real email service
 * like SendGrid, AWS SES, or Resend
 */

import { inject, injectable } from 'tsyringe'
import type { ILogger } from '../services/logger.interface'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<boolean>
  sendVerificationEmail(email: string, token: string): Promise<boolean>
  sendPasswordResetEmail(email: string, token: string): Promise<boolean>
  sendWelcomeEmail(email: string, name?: string): Promise<boolean>
}

@injectable()
export class EmailService implements IEmailService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * Send an email (mock implementation)
   * In production, this would integrate with an email service provider
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // In development, just log the email
      if (process.env.NODE_ENV === 'development') {
        this.logger.info('📧 Email sent (development mode)', {
          to: options.to,
          subject: options.subject,
          preview: options.text?.substring(0, 100),
        })

        // Log the full email content in development for testing
        console.log('\n=== EMAIL DEBUG ===')
        console.log(`To: ${options.to}`)
        console.log(`Subject: ${options.subject}`)
        console.log('Content:')
        console.log(options.text || options.html)
        console.log('==================\n')

        return true
      }

      // TODO: Implement actual email sending for production
      // Example with SendGrid:
      // const msg = {
      //   to: options.to,
      //   from: process.env.EMAIL_FROM,
      //   subject: options.subject,
      //   text: options.text,
      //   html: options.html,
      // }
      // await sgMail.send(msg)

      return true
    } catch (error) {
      this.logger.warn('Failed to send email', { error, options })
      return false
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:4000'}/verify-email?token=${token}`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thanks for signing up! Please click the link below to verify your email address:</p>
        <p style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't sign up for this account, you can safely ignore this email.
        </p>
      </div>
    `

    const text = `
Verify your email address

Thanks for signing up! Please click the link below to verify your email address:

${verificationUrl}

This link will expire in 24 hours. If you didn't sign up for this account, you can safely ignore this email.
    `

    return this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      html,
      text,
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:4000'}/reset-password?token=${token}`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>You requested to reset your password. Click the link below to create a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="color: #666; font-size: 14px;">
          For security reasons, we recommend changing your password if you didn't make this request.
        </p>
      </div>
    `

    const text = `
Reset your password

You requested to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

For security reasons, we recommend changing your password if you didn't make this request.
    `

    return this.sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
      text,
    })
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    const appUrl = process.env.APP_URL || 'http://localhost:4000'

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome${name ? `, ${name}` : ''}!</h2>
        <p>Your email has been verified and your account is now active.</p>
        <p>You can now access all features of our application.</p>
        <p style="margin: 30px 0;">
          <a href="${appUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Go to Application
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you have any questions, feel free to contact our support team.
        </p>
      </div>
    `

    const text = `
Welcome${name ? `, ${name}` : ''}!

Your email has been verified and your account is now active.

You can now access all features of our application at: ${appUrl}

If you have any questions, feel free to contact our support team.
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome! Your email is verified',
      html,
      text,
    })
  }
}
