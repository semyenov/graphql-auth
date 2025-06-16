/**
 * Authentication GraphQL Resolvers
 * 
 * Handles authentication-related GraphQL operations.
 */

import { GraphQLContext } from '../context/graphql-context'
import { normalizeGraphQLError } from '../errors/graphql-error-handler'
import { builder } from '../schema/builder'

// Signup mutation
builder.mutationField('signup', (t) =>
  t.string({
    description: 'Create a new user account',
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context: GraphQLContext) => {
      try {
        const result = await context.useCases.auth.signup.execute({
          email: args.email,
          password: args.password,
          name: args.name || null,
        })
        return result.token
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Login mutation
builder.mutationField('login', (t) =>
  t.string({
    description: 'Authenticate and receive a token',
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context: GraphQLContext) => {
      try {
        const result = await context.useCases.auth.login.execute({
          email: args.email,
          password: args.password,
        })
        return result.token
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)