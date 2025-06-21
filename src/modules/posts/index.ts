/**
 * Posts Module Public API
 *
 * Exports all public interfaces and classes from the posts module.
 */

export * from './application/dtos/create-post.dto'
export * from './application/dtos/post-response.dto'
export * from './application/dtos/update-post.dto'
// Application exports
export * from './application/use-cases/create-post.use-case'
export * from './application/use-cases/delete-post.use-case'
export * from './application/use-cases/get-posts-by-author.use-case'
export * from './application/use-cases/get-published-posts.use-case'
export * from './application/use-cases/update-post.use-case'
// Module configuration
export * from './config/posts.module'
// Domain exports
export * from './domain/entities/post.entity'
export * from './domain/errors/post.errors'
export * from './domain/repositories/post.repository.interface'
export * from './domain/services/post-authorization.service'
export * from './domain/value-objects/post-id.vo'

// Legacy exports (for backward compatibility)
export * from './resolvers'
export * from './types'

// Import resolvers to register them
import './presentation/graphql/resolvers/posts.resolver'
