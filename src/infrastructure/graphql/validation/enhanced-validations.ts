/**
 * Enhanced Validation Patterns with Custom Refinements
 * 
 * Demonstrates advanced Pothos validation patterns including:
 * - Async validation with database checks
 * - Custom refinements and error messages
 * - Complex field dependencies
 * - Contextual validation
 */

import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { prisma } from '../../../prisma'
import { builder } from '../../../schema/builder'

/**
 * Enhanced email validation with async uniqueness check
 */
export const uniqueEmailValidation = z.string()
  .email('Please provide a valid email address')
  .toLowerCase()
  .refine(
    async (email) => {
      // Access Prisma through context for async validation
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      })
      return !existingUser
    },
    {
      message: 'An account with this email already exists',
    }
  )

/**
 * Password validation with strength requirements
 */
export const strongPasswordValidation = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    'Password must contain at least one special character'
  )

/**
 * Title validation with uniqueness check for user's posts
 */
export const uniquePostTitleValidation = (userId: string) =>
  z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .refine(
      async (title: string) => {
        const existingPost = await prisma.post.findFirst({
          where: {
            title,
            authorId: parseInt(userId, 10)
          },
          select: { id: true }
        })
        return !existingPost
      },
      {
        message: 'You already have a post with this title',
      }
    )

/**
 * Content validation with profanity filter
 */
const profanityWords = ['badword1', 'badword2'] // Replace with actual list
export const cleanContentValidation = z.string()
  .max(10000, 'Content must be less than 10000 characters')
  .refine(
    (content) => {
      const lowerContent = content.toLowerCase()
      return !profanityWords.some(word => lowerContent.includes(word))
    },
    'Content contains inappropriate language'
  )

/**
 * Date range validation
 */
export const dateRangeValidation = z.object({
  start: z.date(),
  end: z.date()
}).refine(
  (data) => data.start <= data.end,
  {
    message: 'Start date must be before or equal to end date',
    path: ['end'], // Error will be associated with end field
  }
).refine(
  (data) => {
    const daysDiff = (data.end.getTime() - data.start.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 365
  },
  {
    message: 'Date range cannot exceed 365 days',
    path: ['end'],
  }
)

/**
 * Complex user profile update validation
 */
export const profileUpdateValidation = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: z.string()
    .url('Please provide a valid URL')
    .optional()
    .refine(
      (url) => {
        if (!url) return true
        try {
          const parsed = new URL(url)
          return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
          return false
        }
      },
      'Website must use HTTP or HTTPS protocol'
    ),
  socialLinks: z.object({
    twitter: z.string()
      .regex(/^@?[A-Za-z0-9_]{1,15}$/, 'Invalid Twitter username')
      .optional(),
    github: z.string()
      .regex(/^[A-Za-z0-9-]{1,39}$/, 'Invalid GitHub username')
      .optional(),
    linkedin: z.string()
      .regex(/^[A-Za-z0-9-]{3,100}$/, 'Invalid LinkedIn username')
      .optional(),
  }).optional(),
}).refine(
  (data) => {
    // At least one field must be provided
    return data.name !== undefined ||
      data.bio !== undefined ||
      data.website !== undefined ||
      data.socialLinks !== undefined
  },
  {
    message: 'At least one field must be provided for update',
  }
)

/**
 * Input type with enhanced validation
 */
builder.inputType('EnhancedCreatePostInput', {
  fields: (t) => ({
    title: t.string({
      required: true,
      validate: {
        schema: z.string()
          .min(3, 'Title must be at least 3 characters')
          .max(100, 'Title must be less than 100 characters')
          .transform(str => str.trim()) // Trim whitespace
      },
    }),
    content: t.string({
      required: false,
      validate: {
        schema: cleanContentValidation,
      },
    }),
    tags: t.stringList({
      required: false,
      validate: {
        schema: z.array(
          z.string()
            .min(2, 'Tag must be at least 2 characters')
            .max(20, 'Tag must be less than 20 characters')
            .regex(/^[a-zA-Z0-9-]+$/, 'Tags can only contain letters, numbers, and hyphens')
        )
          .max(10, 'Maximum 10 tags allowed')
          .refine(
            (tags) => new Set(tags).size === tags.length,
            'Tags must be unique'
          )
      },
    }),
    publishAt: t.field({
      type: 'DateTime',
      required: false,
      validate: {
        schema: z.date().min(new Date(), 'Publish date must be in the future')
      },
    }),
  }),
})

/**
 * Advanced search input with validation
 */
builder.inputType('AdvancedSearchInput', {
  fields: (t) => ({
    query: t.string({
      required: true,
      validate: {
        schema: z.string()
          .min(2, 'Search query must be at least 2 characters')
          .max(100, 'Search query must be less than 100 characters')
          .transform(str => str.trim())
          .refine(
            (query) => {
              // Prevent SQL injection patterns
              const dangerousPatterns = [';', '--', '/*', '*/', 'xp_', 'sp_']
              const lowerQuery = query.toLowerCase()
              return !dangerousPatterns.some(pattern => lowerQuery.includes(pattern))
            },
            'Search query contains invalid characters'
          )
      },
    }),
    // filters: t.field({
    //   type: 'SearchFilters',
    //   required: false,
    // }),
    // pagination: t.field({
    //   type: 'PaginationInput',
    //   required: false,
    //   validate: {
    //     schema: z.object({
    //       page: z.number().int().min(1).max(1000),
    //       limit: z.number().int().min(1).max(100),
    //     }).optional()
    //   },
    // }),
  }),
})

/**
 * Helper to create contextual validation
 */
export function createContextualValidation<T>(
  validationFn: (value: T, context: EnhancedContext) => Promise<boolean> | boolean,
  errorMessage: string
) {
  return (context: EnhancedContext) => {
    return z.custom<T>(
      async (value) => {
        const isValid = await validationFn(value, context)
        return isValid
      },
      { message: errorMessage }
    )
  }
}

// /**
//  * Example mutation using enhanced validation
//  */
// builder.mutationField('createPostWithValidation', (t) =>
//   t.field({
//     type: 'Post',
//     args: {
//       input: t.arg({ 
//         type: 'EnhancedCreatePostInput', 
//         required: true,
//         validate: {
//           schema: z.object({
//             title: z.string(),
//             content: z.string().optional(),
//             tags: z.array(z.string()).optional(),
//             publishAt: z.date().optional(),
//           }).refine(
//             async (data, ctx) => {
//               // Complex validation that depends on multiple fields
//               if (data.publishAt && !data.content) {
//                 return false
//               }
//               return true
//             },
//             {
//               message: 'Scheduled posts must have content',
//               path: ['content'],
//             }
//           )
//         }
//       }),
//     },
//     resolve: async (_parent, args, context) => {
//       // Implementation here
//       return prisma.post.create({
//         data: {
//           title: args.input.title,
//           content: args.input.content,
//           // ... other fields
//         }
//       })
//     }
//   })
// )