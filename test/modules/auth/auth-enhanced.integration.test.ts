/**
 * Enhanced Authentication Integration Tests
 *
 * Tests for email verification, password reset, and login attempt tracking
 */

import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { container } from 'tsyringe'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IEmailService } from '../../../src/app/services/email.service'
import {
  LoginSecureMutation,
  RequestPasswordResetMutation,
  ResendVerificationEmailMutation,
  ResetPasswordMutation,
  SignupWithVerificationMutation,
  VerifyEmailMutation,
} from '../../../src/gql/mutations'
import { VerificationTokenService } from '../../../src/modules/auth/services/verification-token.service'
import { prisma } from '../../../src/prisma'
import { cleanDatabase, createMockContext } from '../../utils'
import {
  executeOperation,
  extractGraphQLData,
  getGraphQLErrors,
  hasGraphQLErrors,
} from '../../utils/core/graphql'
import { createTestServer } from '../../utils/core/server'

describe('Enhanced Authentication', () => {
  const server = createTestServer()
  let mockEmailService: IEmailService

  beforeEach(async () => {
    await cleanDatabase()

    // Create mock email service
    mockEmailService = {
      sendEmail: vi.fn().mockResolvedValue(true),
      sendVerificationEmail: vi.fn().mockResolvedValue(true),
      sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
      sendWelcomeEmail: vi.fn().mockResolvedValue(true),
    }

    // Register mock email service before other services that depend on it
    container.registerInstance<IEmailService>('IEmailService', mockEmailService)
  })

  describe('signup with verification', () => {
    it('should create a new user and send verification email', async () => {
      const input = {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        name: 'New User',
      }

      const result = await executeOperation<
        ResultOf<typeof SignupWithVerificationMutation>,
        VariablesOf<typeof SignupWithVerificationMutation>
      >(
        server,
        print(SignupWithVerificationMutation),
        input,
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof SignupWithVerificationMutation>>(
          result,
        )
      expect(data?.signupWithVerification).toEqual({
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
        requiresEmailVerification: true,
      })

      // Verify user was created
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      })
      expect(user).toBeDefined()
      expect(user?.emailVerified).toBe(false)

      // Verify email was sent
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        input.email,
        expect.any(String),
      )
    })

    it('should fail with duplicate email', async () => {
      // Create an existing user first
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: 'hashedpassword',
        },
      })

      const input = {
        email: 'existing@example.com',
        password: 'SecurePassword123!',
      }

      const result = await executeOperation<
        ResultOf<typeof SignupWithVerificationMutation>,
        VariablesOf<typeof SignupWithVerificationMutation>
      >(
        server,
        print(SignupWithVerificationMutation),
        input,
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(true)
      const errors = getGraphQLErrors(result)
      expect(errors[0]?.message).toBe(
        'An account with this email already exists',
      )
    })
  })

  describe('email verification', () => {
    it('should verify email with valid token', async () => {
      // Create unverified user
      const user = await prisma.user.create({
        data: {
          email: 'unverified@example.com',
          password: 'hashedpassword',
          emailVerified: false,
        },
      })

      // Create verification token
      const verificationTokenService = container.resolve(
        VerificationTokenService,
      )
      const token = await verificationTokenService.createEmailVerificationToken(
        user.id,
      )

      const result = await executeOperation<
        ResultOf<typeof VerifyEmailMutation>,
        VariablesOf<typeof VerifyEmailMutation>
      >(server, print(VerifyEmailMutation), { token }, createMockContext())

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof VerifyEmailMutation>>(result)
      expect(data?.verifyEmail).toEqual({
        success: true,
        message: 'Email verified successfully. You can now log in.',
      })

      // Verify user email is verified
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      })
      expect(updatedUser?.emailVerified).toBe(true)
      expect(updatedUser?.emailVerifiedAt).toBeDefined()

      // Verify welcome email was sent
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        user.email,
        undefined,
      )
    })

    it('should fail with invalid token', async () => {
      const result = await executeOperation<
        ResultOf<typeof VerifyEmailMutation>,
        VariablesOf<typeof VerifyEmailMutation>
      >(
        server,
        print(VerifyEmailMutation),
        { token: 'invalid-token' },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(true)
      const errors = getGraphQLErrors(result)
      expect(errors[0]?.message).toContain('Invalid or expired token')
    })
  })

  describe('secure login', () => {
    it('should block login for unverified email', async () => {
      // First create a user using the signup mutation to ensure proper password hashing
      await executeOperation<
        ResultOf<typeof SignupWithVerificationMutation>,
        VariablesOf<typeof SignupWithVerificationMutation>
      >(
        server,
        print(SignupWithVerificationMutation),
        {
          email: 'unverified-login@example.com',
          password: 'password123',
          name: 'Unverified User',
        },
        createMockContext(),
      )

      // Now try to login without verifying email
      const result = await executeOperation<
        ResultOf<typeof LoginSecureMutation>,
        VariablesOf<typeof LoginSecureMutation>
      >(
        server,
        print(LoginSecureMutation),
        {
          email: 'unverified-login@example.com',
          password: 'password123',
        },
        createMockContext({ ipAddress: '127.0.0.1' }),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof LoginSecureMutation>>(result)
      expect(data?.loginSecure).toEqual({
        token: null,
        user: null,
        requiresEmailVerification: true,
        message: 'Please verify your email address before logging in.',
      })
    })

    it('should login successfully with verified email', async () => {
      // First signup to create user with proper password hashing
      const signupResult = await executeOperation<
        ResultOf<typeof SignupWithVerificationMutation>,
        VariablesOf<typeof SignupWithVerificationMutation>
      >(
        server,
        print(SignupWithVerificationMutation),
        {
          email: 'verified@example.com',
          password: 'password123',
          name: 'Verified User',
        },
        createMockContext(),
      )

      expect(hasGraphQLErrors(signupResult)).toBe(false)

      // Manually verify the user
      await prisma.user.update({
        where: { email: 'verified@example.com' },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      })

      const result = await executeOperation<
        ResultOf<typeof LoginSecureMutation>,
        VariablesOf<typeof LoginSecureMutation>
      >(
        server,
        print(LoginSecureMutation),
        {
          email: 'verified@example.com',
          password: 'password123',
        },
        createMockContext({ ipAddress: '127.0.0.1' }),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof LoginSecureMutation>>(result)
      expect(data?.loginSecure?.token).toBeDefined()
      expect(data?.loginSecure?.user).toBeDefined()
      expect(data?.loginSecure?.requiresEmailVerification).toBe(false)
      expect(data?.loginSecure?.message).toBeNull()
    })

    it('should track failed login attempts', async () => {
      // Create a user for testing
      const user = await prisma.user.create({
        data: {
          email: 'track-attempts@example.com',
          password:
            '$2b$10$EqO7kNOG2V3FgYW9u9oUfuBfHJr/YdDFW1bOzV0MJt0K8K4.yKuYe', // 'password'
          emailVerified: true,
        },
      })

      const email = user.email
      const ipAddress = '127.0.0.1'

      // Make multiple failed login attempts
      for (let i = 0; i < 3; i++) {
        await executeOperation<
          ResultOf<typeof LoginSecureMutation>,
          VariablesOf<typeof LoginSecureMutation>
        >(
          server,
          print(LoginSecureMutation),
          {
            email,
            password: 'wrong-password',
          },
          createMockContext({ ipAddress }),
        )
      }

      // Check login attempts were recorded
      const attempts = await prisma.loginAttempt.findMany({
        where: { email },
      })
      expect(attempts).toHaveLength(3)
      expect(attempts.every((a) => a.success === false)).toBe(true)
      expect(attempts.every((a) => a.ipAddress === ipAddress)).toBe(true)
    })
  })

  describe('password reset', () => {
    it('should send password reset email for existing user', async () => {
      // Create a user for testing
      const user = await prisma.user.create({
        data: {
          email: 'reset-test@example.com',
          password: 'hashedpassword',
          emailVerified: true,
        },
      })

      const email = user.email

      const result = await executeOperation<
        ResultOf<typeof RequestPasswordResetMutation>,
        VariablesOf<typeof RequestPasswordResetMutation>
      >(
        server,
        print(RequestPasswordResetMutation),
        { email },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof RequestPasswordResetMutation>>(
          result,
        )
      expect(data?.requestPasswordReset).toEqual({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      })

      // Verify email was sent
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        email,
        expect.any(String),
      )
    })

    it('should not reveal if email does not exist', async () => {
      const email = 'nonexistent@example.com'

      const result = await executeOperation<
        ResultOf<typeof RequestPasswordResetMutation>,
        VariablesOf<typeof RequestPasswordResetMutation>
      >(
        server,
        print(RequestPasswordResetMutation),
        { email },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof RequestPasswordResetMutation>>(
          result,
        )
      expect(data?.requestPasswordReset).toEqual({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      })

      // Verify no email was sent
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    it('should reset password with valid token', async () => {
      // Create a user for testing
      const user = await prisma.user.create({
        data: {
          email: 'reset-password@example.com',
          password:
            '$2b$10$EqO7kNOG2V3FgYW9u9oUfuBfHJr/YdDFW1bOzV0MJt0K8K4.yKuYe', // 'password'
          emailVerified: true,
        },
      })

      // Create password reset token
      const verificationTokenService = container.resolve(
        VerificationTokenService,
      )
      const token = await verificationTokenService.createPasswordResetToken(
        user.id,
      )
      const newPassword = 'NewSecurePassword123!'

      const result = await executeOperation<
        ResultOf<typeof ResetPasswordMutation>,
        VariablesOf<typeof ResetPasswordMutation>
      >(
        server,
        print(ResetPasswordMutation),
        { token, newPassword },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof ResetPasswordMutation>>(result)
      expect(data?.resetPassword).toEqual({
        success: true,
        message:
          'Password reset successfully. You can now log in with your new password.',
      })

      // Verify can login with new password
      const loginResult = await executeOperation<
        ResultOf<typeof LoginSecureMutation>,
        VariablesOf<typeof LoginSecureMutation>
      >(
        server,
        print(LoginSecureMutation),
        {
          email: user.email,
          password: newPassword,
        },
        createMockContext({ ipAddress: '127.0.0.1' }),
      )

      expect(hasGraphQLErrors(loginResult)).toBe(false)
      const loginData =
        extractGraphQLData<ResultOf<typeof LoginSecureMutation>>(loginResult)
      expect(loginData?.loginSecure?.token).toBeDefined()
    })
  })

  describe('resend verification email', () => {
    it('should resend verification email for unverified user', async () => {
      // Create unverified user
      const user = await prisma.user.create({
        data: {
          email: 'resend-test@example.com',
          password: 'hashedpassword',
          emailVerified: false,
        },
      })

      const result = await executeOperation<
        ResultOf<typeof ResendVerificationEmailMutation>,
        VariablesOf<typeof ResendVerificationEmailMutation>
      >(
        server,
        print(ResendVerificationEmailMutation),
        { email: user.email },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof ResendVerificationEmailMutation>>(
          result,
        )
      expect(data?.resendVerificationEmail).toEqual({
        success: true,
        message:
          'If an account exists with this email, a verification link has been sent.',
      })

      // Verify email was sent
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
      )
    })

    it('should not resend for already verified user', async () => {
      // Create a verified user
      const user = await prisma.user.create({
        data: {
          email: 'already-verified@example.com',
          password: 'hashedpassword',
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      })

      const email = user.email

      const result = await executeOperation<
        ResultOf<typeof ResendVerificationEmailMutation>,
        VariablesOf<typeof ResendVerificationEmailMutation>
      >(
        server,
        print(ResendVerificationEmailMutation),
        { email },
        createMockContext(),
      )

      expect(hasGraphQLErrors(result)).toBe(false)
      const data =
        extractGraphQLData<ResultOf<typeof ResendVerificationEmailMutation>>(
          result,
        )
      expect(data?.resendVerificationEmail).toEqual({
        success: true,
        message: 'This email has already been verified.',
      })

      // Verify no email was sent
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled()
    })
  })
})
