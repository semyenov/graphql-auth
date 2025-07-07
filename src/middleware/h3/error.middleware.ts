import { createError, defineEventHandler, type H3Error, isError } from 'h3'
import { ZodError } from 'zod'
import { logger } from '../../modules/app/services/simple-logger'

/**
 * Global error handler for H3
 */
export const errorHandler = defineEventHandler(async (event) => {
  event.node.res.on('error', (error) => {
    // Log the error
    logger.error('Response error:', {
      error: error.message,
      stack: error.stack,
      url: event.node.req.url,
      method: event.node.req.method,
    })
  })
})

/**
 * Format error response
 */
export function formatError(error: unknown): H3Error {
  // H3 errors pass through
  if (isError(error)) {
    return error as H3Error
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      data: {
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    })
  }

  // Prisma errors
  if (
    error instanceof Error &&
    error.name === 'PrismaClientKnownRequestError'
  ) {
    const prismaError = error as Error & {
      code: string
      meta?: { target?: string[] }
    }
    if (prismaError.code === 'P2002') {
      return createError({
        statusCode: 409,
        statusMessage: 'Duplicate entry',
        data: {
          field: prismaError.meta?.target,
        },
      })
    }
    if (prismaError.code === 'P2025') {
      return createError({
        statusCode: 404,
        statusMessage: 'Record not found',
      })
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error',
    })
  }

  // Unknown errors
  return createError({
    statusCode: 500,
    statusMessage: 'Unknown error occurred',
  })
}
