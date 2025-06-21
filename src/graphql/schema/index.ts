import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '../middleware'
import { builder } from './builder'

// Define root types first
builder.queryType({ description: 'The root query type' })
builder.mutationType({ description: 'The root mutation type' })

// Import all schema components to register them with the builder
// Order matters: scalars/enums → types → inputs → error types → resolvers
import './enums'
import './scalars'

// Import types BEFORE inputs (as inputs might reference types)
import '../../modules/posts/types/post.types'
import '../../modules/users/types/user.types'

// Import inputs after types
import './inputs'

// Import error types for Pothos Errors plugin
import './error-types'

import '../../modules/auth/resolvers/auth-tokens.resolver'
import '../../modules/auth/resolvers/auth.resolver'
import '../../modules/posts/resolvers/posts.resolver'
import '../../modules/users/resolvers/users.resolver'

// Lazy load schema to ensure all types are registered first
let _schema: ReturnType<typeof applyMiddleware> | null = null

export function getSchema() {
  if (!_schema) {
    // Build the schema
    const pothosSchema = builder.toSchema()
    // Apply permissions middleware
    _schema = applyMiddleware(pothosSchema, permissions)
  }
  return _schema
}
