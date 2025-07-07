import { lexicographicSortSchema } from 'graphql'
import { builder } from './builder'

// Import all schema components to register them with the builder
// Order matters: scalars/enums → types → inputs → error types → resolvers
import './enums'
import './scalars'

// Import types BEFORE inputs (as inputs might reference types)
import '../../modules/auth/auth.resolver'

import '../../../modules/oidc/oidc.resolver'
import '../../../modules/oidc/oidc.types'

import '../../modules/posts/post.resolver'
import '../../modules/posts/types/post.types'

import '../../modules/users/user.resolver'
import '../../modules/users/user.types'

// Import inputs after types
import './inputs'

// Import error types for Pothos Errors plugin
import './error-types'

// Lazy load schema to ensure all types are registered first
let _schema: ReturnType<typeof builder.toSchema> | null = null

export function buildSchema() {
  if (!_schema) {
    builder.queryType({ description: 'The root query type' })
    builder.mutationType({ description: 'The root mutation type' })
    const schema = builder.toSchema()
    _schema = lexicographicSortSchema(schema)
  }
  return _schema
}

export function resetSchemaCache() {
  _schema = null
}
