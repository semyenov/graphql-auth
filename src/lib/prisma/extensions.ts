/**
 * Prisma Client Extensions
 *
 * Custom extensions for enhanced Prisma functionality
 */

import { Prisma, type PrismaClient } from '@prisma/client'

/**
 * Soft delete extension
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async softDelete<T>(
        this: T,
        args: Prisma.Args<T, 'update'>,
      ): Promise<Prisma.Result<T, Prisma.Args<T, 'update'>, 'update'>> {
        const context = Prisma.getExtensionContext(this)
        return (
          context as unknown as { update: (args: unknown) => Promise<unknown> }
        ).update({
          ...args,
          data: {
            ...args.data,
            deletedAt: new Date(),
          },
        }) as unknown as Prisma.Result<T, Prisma.Args<T, 'update'>, 'update'>
      },

      async findManyActive<T>(
        this: T,
        args?: Prisma.Args<T, 'findMany'>,
      ): Promise<Prisma.Result<T, Prisma.Args<T, 'findMany'>, 'findMany'>> {
        const context = Prisma.getExtensionContext(this)
        return (
          context as unknown as {
            findMany: (args: unknown) => Promise<unknown>
          }
        ).findMany({
          ...args,
          where: {
            ...args?.where,
            deletedAt: null,
          },
        }) as unknown as Prisma.Result<
          T,
          Prisma.Args<T, 'findMany'>,
          'findMany'
        >
      },
    },
  },
})

/**
 * Pagination extension
 */
export const paginationExtension = Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        args: Prisma.Args<T, 'findMany'> & {
          page?: number
          perPage?: number
        },
      ): Promise<{
        data: Prisma.Result<T, Prisma.Args<T, 'findMany'>, 'findMany'>
        meta: {
          total: number
          page: number
          perPage: number
          pageCount: number
        }
      }> {
        const context = Prisma.getExtensionContext(this)
        const page = args.page || 1
        const perPage = args.perPage || 20

        // Get total count
        const total = await (
          context as unknown as { count: (args: unknown) => Promise<number> }
        ).count({
          where: args.where,
        })

        // Get paginated data
        const data = await (
          context as unknown as {
            findMany: (args: unknown) => Promise<unknown>
          }
        ).findMany({
          ...args,
          skip: (page - 1) * perPage,
          take: perPage,
        })

        return {
          data: data as Prisma.Result<
            T,
            Prisma.Args<T, 'findMany'>,
            'findMany'
          >,
          meta: {
            total,
            page,
            perPage,
            pageCount: Math.ceil(total / perPage),
          },
        }
      },
    },
  },
})

/**
 * Audit log extension
 */
export const auditLogExtension = Prisma.defineExtension({
  name: 'auditLog',
  query: {
    $allModels: {
      async create({ model, args, query }) {
        const result = await query(args)

        // Log creation
        console.log(`[AUDIT] Created ${model}:`, result)

        return result
      },

      async update({ model, args, query }) {
        const result = await query(args)

        // Log update
        console.log(`[AUDIT] Updated ${model}:`, result)

        return result
      },

      async delete({ model, args, query }) {
        const result = await query(args)

        // Log deletion
        console.log(`[AUDIT] Deleted ${model}:`, result)

        return result
      },
    },
  },
})

/**
 * Create extended Prisma client with all extensions
 */
export function createExtendedPrismaClient(baseClient: PrismaClient) {
  return baseClient
    .$extends(softDeleteExtension)
    .$extends(paginationExtension)
    .$extends(auditLogExtension)
}
