import { normalizeError } from '../../../../errors'
import { builder } from '../../../../schema/builder'
import { container } from '../../../../shared/infrastructure/container'

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
    resolve: async (_parent, args) => {
      try {
        const token = await container.signupUseCase.execute({
          email: args.email,
          password: args.password,
          name: args.name ?? null,
        })
        return token
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
    resolve: async (_parent, args) => {
      try {
        const token = await container.loginUseCase.execute({
          email: args.email,
          password: args.password,
        })
        return token
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)