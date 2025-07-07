/**
 * Database module exports
 *
 * Provides centralized access to the Prisma client and related utilities
 */

export {
  disconnectPrisma,
  type PrismaClientType,
  prisma,
  setPrismaClient, // @deprecated
  setTestPrismaClient,
} from './prisma'
