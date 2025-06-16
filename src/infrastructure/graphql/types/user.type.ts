/**
 * User GraphQL Type
 * 
 * Defines the User type in GraphQL schema.
 */

import { builder } from '../schema/builder'

export const UserType = builder.objectType('User', {
  description: 'A user in the system',
  fields: (t) => ({
    id: t.id({
      resolve: (user) => user.id,
    }),
    email: t.string({
      resolve: (user) => user.email,
    }),
    name: t.string({
      nullable: true,
      resolve: (user) => user.name,
    }),
    createdAt: t.field({
      type: 'DateTime',
      nullable: true,
      resolve: (user) => user.createdAt,
    }),
    updatedAt: t.field({
      type: 'DateTime',
      nullable: true,
      resolve: (user) => user.updatedAt,
    }),
  }),
})

// Current user query
builder.queryField('me', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    description: 'Get the currently authenticated user',
    resolve: async (_parent, _args, context) => {
      if (!context.userId) {
        return null
      }

      const userRepository = context.container.resolve<IUserRepository>('IUserRepository')
      const user = await userRepository.findById(context.userId)

      return user ? UserMapper.toDto(user) : null
    },
  })
)