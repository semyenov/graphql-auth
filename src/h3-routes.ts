import { createRouter, defineEventHandler, getQuery, getHeader } from 'h3'
import { createContext, type TypedRequest } from './context'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create REST API router
export const apiRouter = createRouter()

// GET /api/health - Health check endpoint
apiRouter.get('/api/health', defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      graphql: 'running'
    }
  }
}))

// GET /api/users - Get all users (REST endpoint)
apiRouter.get('/api/users', defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true
          }
        }
      }
    })

    return {
      data: users,
      count: users.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
}))

// GET /api/posts - Get posts with pagination
apiRouter.get('/api/posts', defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const take = Number(query.limit) || 10
    const skip = Number(query.offset) || 0
    const searchString = query.search as string

    const where = searchString
      ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } }
        ]
      }
      : {}

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        take,
        skip,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.post.count({ where })
    ])

    return {
      data: posts,
      pagination: {
        total,
        take,
        skip,
        hasMore: skip + take < total
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
}))

// POST /api/posts/:id/view - Increment post view count
apiRouter.post('/api/posts/:id/view', defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid post ID'
      })
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return {
      data: post,
      message: 'View count incremented'
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to increment view count'
    })
  }
}))

// GET /api/me - Get current user (requires auth header)
apiRouter.get('/api/me', defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }

    // For demo purposes, we'll just return a mock response
    // In a real app, you'd verify the JWT token here
    return {
      message: 'Protected endpoint accessed',
      authHeader,
      timestamp: new Date().toISOString()
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error && error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}))

// Export helper function to create error responses
function createError(options: { statusCode: number; statusMessage: string }) {
  const error = new Error(options.statusMessage)
    ; (error as any).statusCode = options.statusCode
  return error
} 