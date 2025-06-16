/**
 * Rate Limiting Tests
 * 
 * Tests for rate limiting functionality on authentication endpoints
 */

import { beforeEach, describe, expect, it, afterAll } from 'vitest'
import { print } from 'graphql'
import { LoginDirectMutation, SignupDirectMutation } from '../src/gql/mutations-direct'
import { rateLimiter } from '../src/infrastructure/services/rate-limiter.service'
import { createMockContext, createTestServer, executeOperation, gqlHelpers } from './test-utils'
import { prisma } from './setup'
import bcrypt from 'bcryptjs'

describe('Rate Limiting', () => {
    const server = createTestServer()
    
    beforeEach(async () => {
        // Reset rate limits for tests
        await rateLimiter.reset('login', 'email:ratelimit@example.com')
        await rateLimiter.reset('signup', 'email:newuser@example.com')
    })
    
    afterAll(async () => {
        // Cleanup
        await rateLimiter.cleanup()
    })
    
    describe('Login rate limiting', () => {
        beforeEach(async () => {
            // Create a test user (delete first if exists)
            await prisma.user.deleteMany({
                where: { email: 'ratelimit@example.com' }
            })
            await prisma.user.create({
                data: {
                    email: 'ratelimit@example.com',
                    password: await bcrypt.hash('password123', 10),
                    name: 'Rate Limit Test',
                },
            })
        })
        
        it('should allow login attempts within rate limit', async () => {
            const variables = {
                email: 'ratelimit@example.com',
                password: 'wrongpassword',
            }
            
            // Should allow 5 attempts (as per RateLimitPresets.login)
            for (let i = 0; i < 5; i++) {
                const response = await executeOperation(
                    server,
                    print(LoginDirectMutation),
                    variables,
                    createMockContext()
                )
                
                if (response.body.singleResult.errors) {
                    // Login failure is expected, but not rate limit error
                    expect(response.body.singleResult.errors[0].message).toContain('Invalid email or password')
                }
            }
        })
        
        it('should block login attempts after exceeding rate limit', async () => {
            const variables = {
                email: 'ratelimit@example.com',
                password: 'wrongpassword',
            }
            
            // Exhaust rate limit (5 attempts)
            for (let i = 0; i < 5; i++) {
                await executeOperation(
                    server,
                    print(LoginDirectMutation),
                    variables,
                    createMockContext()
                )
            }
            
            // 6th attempt should be rate limited
            await gqlHelpers.expectGraphQLError(
                server,
                print(LoginDirectMutation),
                variables,
                createMockContext(),
                'Too many requests'
            )
        })
        
        it('should use email as identifier for rate limiting', async () => {
            // Create another user
            await prisma.user.create({
                data: {
                    email: 'another@example.com',
                    password: await bcrypt.hash('password123', 10),
                },
            })
            
            // Exhaust rate limit for first email
            for (let i = 0; i < 5; i++) {
                await executeOperation(
                    server,
                    print(LoginDirectMutation),
                    { email: 'ratelimit@example.com', password: 'wrong' },
                    createMockContext()
                )
            }
            
            // Should still allow attempts for different email
            const response = await executeOperation(
                server,
                print(LoginDirectMutation),
                { email: 'another@example.com', password: 'wrong' },
                createMockContext()
            )
            
            // Should be login error, not rate limit
            expect(response.body.singleResult.errors).toBeDefined()
            expect(response.body.singleResult.errors![0].message).toContain('Invalid email or password')
            expect(response.body.singleResult.errors![0].message).not.toContain('Too many requests')
        })
    })
    
    describe('Signup rate limiting', () => {
        it('should allow signup attempts within rate limit', async () => {
            // Should allow 3 signups per hour (as per RateLimitPresets.signup)
            for (let i = 0; i < 3; i++) {
                const variables = {
                    email: `newuser${i}@example.com`,
                    password: 'password123',
                    name: `User ${i}`,
                }
                
                const data = await gqlHelpers.expectSuccessfulMutation(
                    server,
                    print(SignupDirectMutation),
                    variables,
                    createMockContext()
                )
                
                expect(data.signupDirect).toBeDefined()
                expect(typeof data.signupDirect).toBe('string')
            }
        })
        
        it('should block signup attempts after exceeding rate limit', async () => {
            // Use same email for rate limiting
            const baseEmail = 'newuser@example.com'
            
            // First 3 attempts should succeed (with different variations)
            for (let i = 0; i < 3; i++) {
                await executeOperation(
                    server,
                    print(SignupDirectMutation),
                    {
                        email: baseEmail,
                        password: 'password123',
                        name: `User ${i}`,
                    },
                    createMockContext()
                )
            }
            
            // 4th attempt should be rate limited
            await gqlHelpers.expectGraphQLError(
                server,
                print(SignupDirectMutation),
                {
                    email: baseEmail,
                    password: 'password123',
                    name: 'User 4',
                },
                createMockContext(),
                'Too many requests'
            )
        })
        
        it('should track rate limits by normalized email', async () => {
            // These should all count as the same email for rate limiting
            const emails = [
                'TestUser@example.com',
                'testuser@example.com',
                'TESTUSER@EXAMPLE.COM',
            ]
            
            for (let i = 0; i < 3; i++) {
                await executeOperation(
                    server,
                    print(SignupDirectMutation),
                    {
                        email: emails[i],
                        password: 'password123',
                        name: `User ${i}`,
                    },
                    createMockContext()
                )
            }
            
            // Next attempt with any variation should be rate limited
            await gqlHelpers.expectGraphQLError(
                server,
                print(SignupDirectMutation),
                {
                    email: 'testuser@example.com',
                    password: 'password123',
                    name: 'User 4',
                },
                createMockContext(),
                'Too many requests'
            )
        })
    })
    
    describe('Rate limit error response', () => {
        beforeEach(async () => {
            // Ensure user exists
            await prisma.user.deleteMany({
                where: { email: 'ratelimit@example.com' }
            })
            await prisma.user.create({
                data: {
                    email: 'ratelimit@example.com',
                    password: await bcrypt.hash('password123', 10),
                    name: 'Rate Limit Test',
                },
            })
        })
        
        it('should include retry information in rate limit error', async () => {
            // Exhaust rate limit
            for (let i = 0; i < 5; i++) {
                await executeOperation(
                    server,
                    print(LoginDirectMutation),
                    { email: 'ratelimit@example.com', password: 'wrong' },
                    createMockContext()
                )
            }
            
            // Check error details
            const response = await executeOperation(
                server,
                print(LoginDirectMutation),
                { email: 'ratelimit@example.com', password: 'wrong' },
                createMockContext()
            )
            
            expect(response.body.singleResult.errors).toBeDefined()
            const error = response.body.singleResult.errors![0]
            expect(error.message).toContain('Too many requests')
            expect(error.message).toMatch(/retry after \d+ seconds/)
        })
    })
})