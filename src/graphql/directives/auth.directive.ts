/**
 * Authentication Directive
 *
 * GraphQL directive for handling authentication requirements
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, type GraphQLSchema } from 'graphql'
import { AuthenticationError } from '../../core/errors/types'
import { requireAuthentication } from '../context/context.auth'
import type { Context } from '../context/context.types'

/**
 * Auth directive transformer function
 */
export function authDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0]

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        const requiredRole = authDirective.requires

        fieldConfig.resolve = async (source, args, context: Context, info) => {
          try {
            // Require authentication
            requireAuthentication(context.userId)

            // If role is specified, check for role-based access
            if (requiredRole && context.user?.role !== requiredRole) {
              throw new AuthenticationError(`Requires ${requiredRole} role`)
            }

            return resolve(source, args, context, info)
          } catch (error) {
            if (error instanceof AuthenticationError) {
              throw error
            }
            throw new AuthenticationError('Authentication required')
          }
        }
      }

      return fieldConfig
    },
  })
}

// Directive definition for schema
export const authDirectiveTypeDefs = `
  directive @auth(
    requires: Role = USER
  ) on FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }
`
