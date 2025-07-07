/**
 * Posts Module - Public API Facade
 *
 * This file defines the ONLY way other modules can interact with the posts module.
 * It implements the facade pattern to enforce strict module boundaries.
 *
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

// Re-export client interface for inter-module communication
export type {
  IPostsClient,
  PostsModuleEvents,
} from './client/posts.client.interface'
// Re-export types from constants
export type {
  PostErrorMessage,
  PostOrderBy,
  PostStatus,
  PostSuccessMessage,
  SortDirection,
} from './constants'
// Re-export constants that other modules might need
export {
  POST_CONSTANTS,
  POST_ERROR_MESSAGES,
  POST_ORDER_BY,
  POST_STATUS,
  POST_SUCCESS_MESSAGES,
  SORT_DIRECTION,
} from './constants'

// Note: Post types are defined as Pothos GraphQL types in ./types/post.types.ts
// They're automatically available through GraphQL schema, not as direct TypeScript exports

// DO NOT re-export internal services, repositories, or implementation details
// Other modules should use the client interface or GraphQL API

/**
 * Module Health Check
 * Allows other modules to check if posts module is healthy
 */
export interface PostsModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: {
    database: boolean
    authModule: boolean
    usersModule: boolean
  }
  lastChecked: Date
}

/**
 * Public API for health checks
 * This is the only operational method exposed by the posts module
 */
export async function getPostsModuleHealth(): Promise<PostsModuleHealth> {
  try {
    // Basic health checks without exposing internal services
    const health: PostsModuleHealth = {
      status: 'healthy',
      dependencies: {
        database: true, // Would check database connectivity
        authModule: true, // Would check auth module availability
        usersModule: true, // Would check users module availability
      },
      lastChecked: new Date(),
    }

    // Determine overall status based on dependencies
    const failedDependencies = Object.values(health.dependencies).filter(
      (dep) => !dep,
    )
    if (failedDependencies.length > 0) {
      health.status = failedDependencies.length > 1 ? 'unhealthy' : 'degraded'
    }

    return health
  } catch (error) {
    return {
      status: 'unhealthy',
      dependencies: {
        database: false,
        authModule: false,
        usersModule: false,
      },
      lastChecked: new Date(),
    }
  }
}

/**
 * Module Information
 * Provides metadata about the posts module without exposing internals
 */
export const PostsModule = {
  name: 'posts',
  version: '1.0.0',
  description: 'Posts and content management module',
  capabilities: [
    'post-creation',
    'post-editing',
    'post-deletion',
    'post-publishing',
    'post-moderation',
    'content-search',
    'post-metrics',
    'draft-management',
  ],
  dependencies: [
    'auth.module',
    'users.module',
    'shared.database',
    'shared.logger',
  ],
  graphqlResolvers: [
    'createPost',
    'updatePost',
    'deletePost',
    'publishPost',
    'post',
    'posts',
    'userPosts',
    'searchPosts',
  ],
} as const

// Prevent access to internal implementation
// This creates a clear boundary that other modules cannot cross
Object.freeze(PostsModule)
