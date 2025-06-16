/**
 * Posts feature barrel export
 */

// Domain exports
export * from './domain/types'
export * from './domain/services/post-authorization.service'

// Application exports
export * from './application/use-cases/create-post.use-case'
export * from './application/use-cases/delete-post.use-case'

// Infrastructure exports
export * from './infrastructure/repositories/post.repository'