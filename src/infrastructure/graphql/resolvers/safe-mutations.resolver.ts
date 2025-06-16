/**
 * Safe Mutation Resolvers with Enhanced Error Handling
 * 
 * Uses Pothos Errors plugin union types for comprehensive error handling
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import type { ILogger } from '../../../core/services/logger.interface'
import type { IPasswordService } from '../../../core/services/password.service.interface'
import { AuthenticationError, ConflictError, NotFoundError, ValidationError } from '../../../errors'
import { builder } from '../../../schema/builder'
import { signToken } from '../../../utils/jwt'
import { commonValidations } from '../pothos-helpers'
import { 
  AuthResult, 
  AuthSuccess, 
  PostResult, 
  UserResult 
} from '../errors/enhanced-error-handling'
import { requireAuthentication } from '../../../context/auth'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'

// Get services from container
const getPasswordService = () => container.resolve<IPasswordService>('IPasswordService')
const getLogger = () => container.resolve<ILogger>('ILogger')

// Safe signup mutation with error union
builder.mutationField('safeSignup', (t) =>
  t.field({
    type: AuthResult,
    description: 'Safely create a new user account with comprehensive error handling',
    grantScopes: ['public'],
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
      password: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
      name: t.arg.string({
        required: false,
        validate: { schema: z.string().min(1).max(100) },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeSignup' })
      
      try {
        logger.info('Safe signup attempt', { email: args.email })
        
        // Check if user already exists
        const existingUser = await context.prisma.user.findUnique({
          where: { email: args.email },
        })

        if (existingUser) {
          logger.warn('Signup failed - email already exists', { email: args.email })
          return new ConflictError('An account with this email already exists')
        }

        // Hash password
        const passwordService = getPasswordService()
        const hashedPassword = await passwordService.hash(args.password)

        // Create user
        const user = await context.prisma.user.create({
          data: {
            email: args.email,
            password: hashedPassword,
            name: args.name || null,
          },
        })

        logger.info('User created successfully', { userId: user.id, email: user.email })

        // Generate token and return success
        const token = signToken({ userId: user.id, email: user.email })
        
        return {
          token,
          user,
        }
      } catch (error) {
        logger.error('Signup error', { error, email: args.email })
        
        // Return appropriate error type
        if (error instanceof ConflictError) {
          return error
        }
        
        return new ValidationError('Unable to create account. Please check your input.')
      }
    },
  })
)

// Safe login mutation with error union
builder.mutationField('safeLogin', (t) =>
  t.field({
    type: AuthResult,
    description: 'Safely authenticate user with comprehensive error handling',
    grantScopes: ['public'],
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
      password: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1) },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeLogin' })
      
      try {
        logger.info('Safe login attempt', { email: args.email })

        // Find user by email
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        })

        if (!user) {
          logger.warn('Login failed - user not found', { email: args.email })
          return new AuthenticationError('Invalid email or password')
        }

        // Verify password
        const passwordService = getPasswordService()
        const isValidPassword = await passwordService.verify(args.password, user.password)

        if (!isValidPassword) {
          logger.warn('Login failed - invalid password', { email: args.email, userId: user.id })
          return new AuthenticationError('Invalid email or password')
        }

        logger.info('Login successful', { email: args.email, userId: user.id })

        // Generate token and return success
        const token = signToken({ userId: user.id, email: user.email })
        
        return {
          token,
          user,
        }
      } catch (error) {
        logger.error('Login error', { error, email: args.email })
        return new AuthenticationError('Authentication failed. Please try again.')
      }
    },
  })
)

// Safe post creation with error union
builder.mutationField('safeCreatePost', (t) =>
  t.field({
    type: PostResult,
    description: 'Safely create a post with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      title: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1).max(255) },
      }),
      content: t.arg.string({
        required: false,
        validate: { schema: z.string().max(10000) },
      }),
      published: t.arg.boolean({
        required: false,
        defaultValue: false,
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeCreatePost' })
      
      try {
        const userId = requireAuthentication(context)
        
        logger.info('Safe post creation', { 
          authorId: userId.value, 
          title: args.title,
          published: args.published 
        })

        // Create post
        const post = await context.prisma.post.create({
          data: {
            title: args.title,
            content: args.content || null,
            published: args.published ?? false,
            authorId: userId.value,
          },
          include: {
            author: true, // Include author for complete response
          },
        })

        logger.info('Post created successfully', { 
          postId: post.id, 
          authorId: userId.value,
          published: post.published 
        })

        return post
      } catch (error) {
        logger.error('Post creation error', { error, args })
        
        if (error instanceof AuthenticationError) {
          return error
        }
        
        return new ValidationError('Unable to create post. Please check your input.')
      }
    },
  })
)

// Safe post update with error union
builder.mutationField('safeUpdatePost', (t) =>
  t.field({
    type: PostResult,
    description: 'Safely update a post with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({
        required: true,
        description: 'Global ID of the post to update',
      }),
      title: t.arg.string({
        required: false,
        validate: { schema: z.string().min(1).max(255) },
      }),
      content: t.arg.string({
        required: false,
        validate: { schema: z.string().max(10000) },
      }),
      published: t.arg.boolean({
        required: false,
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeUpdatePost' })
      
      try {
        const userId = requireAuthentication(context)
        const postId = parseGlobalId(args.id.toString(), 'Post')
        
        logger.info('Safe post update', { 
          postId, 
          userId: userId.value,
          updates: { title: args.title, content: args.content, published: args.published }
        })

        // Check if post exists and user owns it
        const existingPost = await context.prisma.post.findUnique({
          where: { id: postId },
          select: { id: true, authorId: true, title: true },
        })

        if (!existingPost) {
          logger.warn('Post not found', { postId })
          return new NotFoundError('Post', args.id.toString())
        }

        if (existingPost.authorId !== userId.value) {
          logger.warn('Unauthorized post update attempt', { 
            postId, 
            userId: userId.value, 
            ownerId: existingPost.authorId 
          })
          return new AuthenticationError('You can only update your own posts')
        }

        // Update post
        const updatedPost = await context.prisma.post.update({
          where: { id: postId },
          data: {
            ...(args.title !== undefined && { title: args.title }),
            ...(args.content !== undefined && { content: args.content }),
            ...(args.published !== undefined && { published: args.published }),
          },
          include: {
            author: true,
          },
        })

        logger.info('Post updated successfully', { 
          postId, 
          userId: userId.value,
          published: updatedPost.published 
        })

        return updatedPost
      } catch (error) {
        logger.error('Post update error', { error, args })
        
        if (error instanceof NotFoundError || error instanceof AuthenticationError) {
          return error
        }
        
        return new ValidationError('Unable to update post. Please check your input.')
      }
    },
  })
)

// Safe user profile update with error union
builder.mutationField('safeUpdateProfile', (t) =>
  t.field({
    type: UserResult,
    description: 'Safely update user profile with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      name: t.arg.string({
        required: false,
        validate: { schema: z.string().min(1).max(100) },
      }),
      email: t.arg.string({
        required: false,
        validate: { schema: commonValidations.email },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeUpdateProfile' })
      
      try {
        const userId = requireAuthentication(context)
        
        logger.info('Safe profile update', { 
          userId: userId.value,
          updates: { name: args.name, email: args.email }
        })

        // Check for email conflicts if email is being updated
        if (args.email) {
          const existingUser = await context.prisma.user.findUnique({
            where: { email: args.email },
          })

          if (existingUser && existingUser.id !== userId.value) {
            logger.warn('Profile update failed - email already exists', { 
              email: args.email,
              userId: userId.value 
            })
            return new ConflictError('An account with this email already exists')
          }
        }

        // Update user profile
        const updatedUser = await context.prisma.user.update({
          where: { id: userId.value },
          data: {
            ...(args.name !== undefined && { name: args.name }),
            ...(args.email !== undefined && { email: args.email }),
          },
        })

        logger.info('Profile updated successfully', { 
          userId: userId.value,
          email: updatedUser.email 
        })

        return updatedUser
      } catch (error) {
        logger.error('Profile update error', { error, args })
        
        if (error instanceof ConflictError || error instanceof AuthenticationError) {
          return error
        }
        
        return new ValidationError('Unable to update profile. Please check your input.')
      }
    },
  })
)