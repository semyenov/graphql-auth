/**
 * Rate Limiting Directive
 *
 * GraphQL directive for applying rate limiting to specific fields
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils'
import { type GraphQLSchema, defaultFieldResolver } from 'graphql'
import { RateLimitError } from '../../core/errors/types'
import type { Context } from '../context/context.types'

/**
 * Rate limit directive transformer function
 */
export function rateLimitDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const rateLimitDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0]

      if (rateLimitDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        const maxRequests = rateLimitDirective.max || 10
        const windowMs = rateLimitDirective.window || 60000 // 1 minute default

        fieldConfig.resolve = async (source, args, context: Context, info) => {
          try {
            // Get rate limiter from context (placeholder - would need to implement)
            // For now, just log the rate limiting attempt
            console.log(
              `Rate limiting check for ${info.fieldName}, max: ${maxRequests}, window: ${windowMs}ms`,
            )

            return resolve(source, args, context, info)
          } catch (error) {
            if (error instanceof RateLimitError) {
              throw error
            }
            // Re-throw other errors
            throw error
          }
        }
      }

      return fieldConfig
    },
  })
}

// Directive definition for schema
export const rateLimitDirectiveTypeDefs = `
  directive @rateLimit(
    max: Int = 10
    window: Int = 60000
  ) on FIELD_DEFINITION
`
