/**
 * GraphQL Resolver Factory Functions
 *
 * Factory functions to create common resolver patterns and reduce duplication
 * across the codebase.
 */

import type { z } from 'zod'
import {
  applyRateLimit,
  createRateLimitConfig,
} from '../../app/middleware/rate-limiting'
import { requireResourceOwnership } from '../../core/auth/ownership.utils'
import type { RateLimitPreset } from '../../core/auth/types'
import { AuthorizationError, NotFoundError } from '../../core/errors/types'
import { parseAndValidateGlobalId } from '../../core/utils/relay'
import { prisma } from '../../prisma'
import { requireAuthentication } from '../context/context.auth'
import type { Context } from '../context/context.types'
import { builder } from '../schema/builder'

/**
 * Type-safe Prisma model access
 */
type PrismaModelDelegate = {
  findUnique: (args: unknown) => Promise<unknown>
  findMany: (args: unknown) => Promise<unknown[]>
  count: (args: unknown) => Promise<number>
  update: (args: unknown) => Promise<unknown>
  delete: (args: unknown) => Promise<unknown>
  create: (args: unknown) => Promise<unknown>
}

/**
 * Configuration for CRUD resolvers
 */
export interface CrudResolverConfig<TModel extends keyof typeof prisma> {
  model: TModel
  typeName: string
  ownerField?: string
  createInput?: unknown
  updateInput?: unknown
  scopes?: {
    create?: string[]
    read?: string[]
    update?: string[]
    delete?: string[]
  }
  hooks?: {
    beforeCreate?: (
      data: Record<string, unknown>,
      context: Context,
    ) => Promise<Record<string, unknown>>
    afterCreate?: (
      created: Record<string, unknown>,
      context: Context,
    ) => Promise<void>
    beforeUpdate?: (
      id: number,
      data: Record<string, unknown>,
      context: Context,
    ) => Promise<Record<string, unknown>>
    afterUpdate?: (
      updated: Record<string, unknown>,
      context: Context,
    ) => Promise<void>
    beforeDelete?: (id: number, context: Context) => Promise<void>
    afterDelete?: (id: number, context: Context) => Promise<void>
  }
}

/**
 * Create a standard create mutation
 */
export function createMutationFactory<TModel extends keyof typeof prisma>(
  config: CrudResolverConfig<TModel>,
) {
  const { model, typeName, createInput, scopes = {}, hooks = {} } = config

  return builder.mutationField(`create${typeName}`, (t) =>
    t.prismaField({
      type: typeName,
      grantScopes: scopes.create || ['authenticated'],
      args: {
        input: t.arg({ type: createInput, required: true }),
      },
      resolve: async (query, _parent, args, context) => {
        const userId = requireAuthentication(context)

        let data = { ...args.input }

        // Apply beforeCreate hook if provided
        if (hooks.beforeCreate) {
          data = await hooks.beforeCreate(data, context)
        }

        // Add owner field if specified
        if (config.ownerField) {
          data[config.ownerField] = userId.value
        }

        const created = await (
          prisma[model] as unknown as PrismaModelDelegate
        ).create({
          ...query,
          data,
        })

        // Apply afterCreate hook if provided
        if (hooks.afterCreate) {
          await hooks.afterCreate(created, context)
        }

        return created
      },
    }),
  )
}

/**
 * Create a standard update mutation with ownership check
 */
export function updateMutationFactory<TModel extends keyof typeof prisma>(
  config: CrudResolverConfig<TModel>,
) {
  const { model, typeName, updateInput, scopes = {}, hooks = {} } = config

  return builder.mutationField(`update${typeName}`, (t) =>
    t.prismaField({
      type: typeName,
      grantScopes: scopes.update || ['authenticated'],
      args: {
        id: t.arg.id({ required: true }),
        input: t.arg({ type: updateInput, required: true }),
      },
      resolve: async (query, _parent, args, context) => {
        const userId = requireAuthentication(context)

        // Check ownership
        if (config.ownerField) {
          await requireResourceOwnership(userId.value, args.id, {
            resourceType: typeName,
            ownerField: config.ownerField,
          })
        }

        let data = { ...args.input }

        // Apply beforeUpdate hook if provided
        if (hooks.beforeUpdate) {
          const numericId = await parseAndValidateGlobalId(args.id, typeName)
          data = await hooks.beforeUpdate(numericId, data, context)
        }

        const numericId = await parseAndValidateGlobalId(args.id, typeName)
        const updated = await (
          prisma[model] as unknown as PrismaModelDelegate
        ).update({
          ...query,
          where: { id: numericId },
          data,
        })

        // Apply afterUpdate hook if provided
        if (hooks.afterUpdate) {
          await hooks.afterUpdate(updated, context)
        }

        return updated
      },
    }),
  )
}

/**
 * Create a standard delete mutation with ownership check
 */
export function deleteMutationFactory<TModel extends keyof typeof prisma>(
  config: CrudResolverConfig<TModel>,
) {
  const { model, typeName, scopes = {}, hooks = {} } = config

  return builder.mutationField(`delete${typeName}`, (t) =>
    t.field({
      type: 'Boolean',
      grantScopes: scopes.delete || ['authenticated'],
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_parent, args, context) => {
        const userId = requireAuthentication(context)

        // Check ownership
        if (config.ownerField) {
          await requireResourceOwnership(userId.value, args.id, {
            resourceType: typeName,
            ownerField: config.ownerField,
          })
        }

        const numericId = await parseAndValidateGlobalId(args.id, typeName)

        // Apply beforeDelete hook if provided
        if (hooks.beforeDelete) {
          await hooks.beforeDelete(numericId, context)
        }

        await (prisma[model] as unknown as PrismaModelDelegate).delete({
          where: { id: numericId },
        })

        // Apply afterDelete hook if provided
        if (hooks.afterDelete) {
          await hooks.afterDelete(numericId, context)
        }

        return true
      },
    }),
  )
}

/**
 * Create a paginated list query
 */
export function paginatedQueryFactory<TModel extends keyof typeof prisma>(
  fieldName: string,
  config: {
    model: TModel
    typeName: string
    defaultWhere?: Record<string, unknown>
    defaultOrderBy?: Record<string, unknown>
    scopes?: string[]
    whereInput?: unknown
    orderByInput?: unknown
    transformWhere?: (where: Record<string, unknown>) => Record<string, unknown>
    transformOrderBy?: (
      orderBy: Record<string, unknown>,
    ) => Record<string, unknown>
  },
) {
  const {
    model,
    typeName,
    defaultWhere = {},
    defaultOrderBy = { id: 'desc' },
    scopes = [],
    whereInput,
    orderByInput,
    transformWhere = (w: Record<string, unknown>) => w,
    transformOrderBy = (o: Record<string, unknown>) => o,
  } = config

  return builder.queryField(fieldName, (t) =>
    t.prismaConnection({
      type: typeName,
      cursor: 'id',
      grantScopes: scopes,
      args: {
        where: whereInput
          ? t.arg({ type: whereInput, required: false })
          : undefined,
        orderBy: orderByInput
          ? t.arg({ type: orderByInput, required: false })
          : undefined,
      },
      resolve: (query, _parent, args) => {
        const where = { ...defaultWhere, ...transformWhere(args.where || {}) }
        const orderBy = args.orderBy
          ? transformOrderBy(args.orderBy)
          : defaultOrderBy

        return (prisma[model] as unknown as PrismaModelDelegate).findMany({
          ...query,
          where,
          orderBy,
        })
      },
      totalCount: (_parent, args) => {
        const where = { ...defaultWhere, ...transformWhere(args.where || {}) }
        return (prisma[model] as unknown as PrismaModelDelegate).count({
          where,
        })
      },
    }),
  )
}

/**
 * Create a single item query by ID
 */
export function singleQueryFactory<TModel extends keyof typeof prisma>(
  fieldName: string,
  config: {
    model: TModel
    typeName: string
    scopes?: string[]
    additionalChecks?: (
      item: Record<string, unknown>,
      context: Context,
    ) => Promise<boolean>
  },
) {
  const { model, typeName, scopes = [], additionalChecks } = config

  return builder.queryField(fieldName, (t) =>
    t.prismaField({
      type: typeName,
      nullable: true,
      grantScopes: scopes,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _parent, args, context) => {
        const numericId = await parseAndValidateGlobalId(args.id, typeName)

        const item = await (
          prisma[model] as unknown as PrismaModelDelegate
        ).findUnique({
          ...query,
          where: { id: numericId },
        })

        if (!item) {
          throw new NotFoundError(typeName, args.id)
        }

        // Apply additional checks if provided
        if (additionalChecks) {
          const allowed = await additionalChecks(item, context)
          if (!allowed) {
            throw new AuthorizationError(
              `You cannot view this ${typeName.toLowerCase()}`,
            )
          }
        }

        return item
      },
    }),
  )
}

/**
 * Create a mutation with rate limiting
 */
export function rateLimitedMutationFactory<TArgs = unknown, TReturn = unknown>(
  fieldName: string,
  config: {
    type: unknown
    args?: Record<string, unknown>
    scopes?: string[]
    rateLimitPreset: RateLimitPreset
    rateLimitKey?: (args: TArgs, context: Context) => string
    resolve: (args: TArgs, context: Context) => Promise<TReturn>
  },
) {
  const {
    type,
    args = {},
    scopes = ['authenticated'],
    rateLimitPreset,
    rateLimitKey = (args: unknown) =>
      ((args as Record<string, unknown>).email as string) || 'global',
    resolve,
  } = config

  return builder.mutationField(fieldName, (t) =>
    t.field({
      type,
      grantScopes: scopes,
      args,
      resolve: async (_parent, args, context) => {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth(fieldName),
            options: rateLimitPreset,
          },
          { [fieldName]: rateLimitKey(args as TArgs, context) },
          context,
        )

        return resolve(args as TArgs, context)
      },
    }),
  )
}

/**
 * Create a batch operation mutation
 */
export function batchOperationFactory<TModel extends keyof typeof prisma>(
  operationName: string,
  config: {
    model: TModel
    typeName: string
    operation: 'update' | 'delete'
    scopes?: string[]
    ownerField?: string
    validateItem?: (id: number, context: Context) => Promise<boolean>
  },
) {
  const {
    model,
    typeName,
    operation,
    scopes = ['authenticated'],
    ownerField,
    validateItem,
  } = config

  return builder.mutationField(`batch${operationName}`, (t) =>
    t.field({
      type: builder.objectType(`Batch${operationName}Result`, {
        fields: (t) => ({
          success: t.int({ resolve: (parent) => parent.success }),
          failed: t.int({ resolve: (parent) => parent.failed }),
          errors: t.field({
            type: ['String'],
            resolve: (parent) => parent.errors,
          }),
        }),
      }),
      grantScopes: scopes,
      args: {
        ids: t.arg.idList({ required: true }),
        ...(operation === 'update'
          ? { data: t.arg({ type: 'JSON', required: true }) }
          : {}),
      },
      resolve: async (_parent, args, context) => {
        const userId = requireAuthentication(context)

        const results = {
          success: 0,
          failed: 0,
          errors: [] as string[],
        }

        for (const id of args.ids) {
          try {
            const numericId = await parseAndValidateGlobalId(id, typeName)

            // Validate ownership or custom validation
            if (ownerField) {
              await requireResourceOwnership(userId.value, numericId, {
                resourceType: typeName,
                ownerField,
              })
            } else if (validateItem) {
              const allowed = await validateItem(numericId, context)
              if (!allowed) {
                throw new AuthorizationError(
                  `Cannot ${operation} ${typeName} ${id}`,
                )
              }
            }

            if (operation === 'update' && args.data) {
              await (prisma[model] as unknown as PrismaModelDelegate).update({
                where: { id: numericId },
                data: args.data,
              })
            } else if (operation === 'delete') {
              await (prisma[model] as unknown as PrismaModelDelegate).delete({
                where: { id: numericId },
              })
            }

            results.success++
          } catch (error) {
            results.failed++
            results.errors.push(
              `${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
          }
        }

        return results
      },
    }),
  )
}

/**
 * Create a computed field resolver
 */
export function computedFieldFactory<TParent = unknown, TReturn = unknown>(
  objectType: string,
  fieldName: string,
  config: {
    type: unknown
    description?: string
    nullable?: boolean
    resolve: (parent: TParent, context: Context) => Promise<TReturn> | TReturn
  },
) {
  const { type, description, nullable = false, resolve } = config

  return builder.prismaObjectField(objectType, fieldName, (t) =>
    t.field({
      type,
      description,
      nullable,
      resolve: async (parent, _args, context) => {
        return resolve(parent as TParent, context)
      },
    }),
  )
}

/**
 * Create an input type with common validation patterns
 */
export function validatedInputFactory(
  name: string,
  fields: Record<
    string,
    {
      type: 'String' | 'Int' | 'Float' | 'Boolean' | 'ID'
      required?: boolean
      description?: string
      validation?: z.ZodSchema
      defaultValue?: unknown
    }
  >,
) {
  return builder.inputType(name, {
    fields: (t) => {
      const inputFields: Record<string, unknown> = {}

      for (const [fieldName, config] of Object.entries(fields)) {
        const fieldConfig: Record<string, unknown> = {
          required: config.required,
          description: config.description,
        }

        if (config.validation) {
          fieldConfig.validate = { schema: config.validation }
        }

        if (config.defaultValue !== undefined) {
          fieldConfig.defaultValue = config.defaultValue
        }

        // Map type to appropriate Pothos field type
        switch (config.type) {
          case 'String':
            inputFields[fieldName] = t.string(fieldConfig)
            break
          case 'Int':
            inputFields[fieldName] = t.int(fieldConfig)
            break
          case 'Float':
            inputFields[fieldName] = t.float(fieldConfig)
            break
          case 'Boolean':
            inputFields[fieldName] = t.boolean(fieldConfig)
            break
          case 'ID':
            inputFields[fieldName] = t.id(fieldConfig)
            break
        }
      }

      return inputFields
    },
  })
}
