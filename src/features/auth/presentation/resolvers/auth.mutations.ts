import { normalizeError } from '../../../../errors'
import { builder } from '../../../../schema/builder'
import type { EnhancedContext } from '../../../../context/enhanced-context'

/**
 * User signup mutation
 */
builder.mutationField('signup', (t) =>
  t.string({
    description: 'Create a new user account and return authentication token',
    args: {
      email: t.arg.string({
        required: true,
        description: 'User email address',
      }),
      password: t.arg.string({
        required: true,
        description: 'User password',
      }),
      name: t.arg.string({
        required: false,
        description: 'User display name',
      }),
    },
    resolve: async (_parent, args, ctx: EnhancedContext) => {
      try {
        const result = await ctx.useCases.auth.signup.execute({
          email: args.email,
          password: args.password,
          name: args.name ?? null,
        })
        return result.token
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)

/**
 * User login mutation
 */
builder.mutationField('login', (t) =>
  t.string({
    description: 'Authenticate user and return authentication token',
    args: {
      email: t.arg.string({
        required: true,
        description: 'User email address',
      }),
      password: t.arg.string({
        required: true,
        description: 'User password',
      }),
    },
    resolve: async (_parent, args, ctx: EnhancedContext) => {
      try {
        const result = await ctx.useCases.auth.login.execute({
          email: args.email,
          password: args.password,
        })
        return result.token
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)