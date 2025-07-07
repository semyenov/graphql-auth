import { Services } from '@/app/config/service-registry'
import { builder } from '@/graphql/schema/builder'
import { prisma } from '@/modules/shared/database'
import { isAdmin } from '@/modules/shared/rules/common.rules'
import { OidcClientInput, OidcClientUpdateInput } from './oidc.types'

builder.queryFields((t) => ({
  oidcClients: t.prismaField({
    type: ['OidcClient'],
    grantScopes: ['authenticated'],
    shield: isAdmin,
    resolve: async (_query, _parent, _args, _context) => {
      return Services.oidcProvider.listClients()
    },
  }),

  oidcClient: t.prismaField({
    type: 'OidcClient',
    grantScopes: ['authenticated'],
    shield: isAdmin,
    args: {
      clientId: t.arg.string({ required: true }),
    },
    resolve: async (_query, _parent, args, _context) => {
      return Services.oidcProvider.getClient(args.clientId)
    },
  }),

  myOidcSessions: t.prismaField({
    type: ['OidcSession'],
    grantScopes: ['authenticated'],
    resolve: async (query, _parent, _args, context) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }
      return prisma.oidcSession.findMany({
        ...query,
        where: { userId: context.userId.value },
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
}))

builder.mutationFields((t) => ({
  createOidcClient: t.prismaField({
    type: 'OidcClient',
    grantScopes: ['authenticated'],
    shield: isAdmin,
    args: {
      input: t.arg({ type: OidcClientInput, required: true }),
    },
    resolve: async (_query, _parent, args, _context) => {
      return Services.oidcProvider.createClient({
        clientName: args.input.clientName,
        clientId: args.input.clientId,
        clientSecret: args.input.clientSecret ?? undefined,
        redirectUris: args.input.redirectUris,
      })
    },
  }),

  updateOidcClient: t.prismaField({
    type: 'OidcClient',
    grantScopes: ['authenticated'],
    shield: isAdmin,
    args: {
      clientId: t.arg.string({ required: true }),
      input: t.arg({ type: OidcClientUpdateInput, required: true }),
    },
    resolve: async (_query, _parent, args, _context) => {
      return Services.oidcProvider.updateClient(args.clientId, {
        clientName: args.input.clientName ?? undefined,
        redirectUris: args.input.redirectUris ?? undefined,
        postLogoutRedirectUris: args.input.postLogoutRedirectUris ?? undefined,
        scope: args.input.scope ?? undefined,
        grantTypes: args.input.grantTypes ?? undefined,
      })
    },
  }),

  deleteOidcClient: t.field({
    type: 'Boolean',
    grantScopes: ['authenticated'],
    shield: isAdmin,
    args: {
      clientId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, _context) => {
      await Services.oidcProvider.deleteClient(args.clientId)
      return true
    },
  }),

  revokeOidcSession: t.field({
    type: 'Boolean',
    grantScopes: ['authenticated'],
    args: {
      sessionId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }
      await Services.oidcProvider.revokeUserSession(
        context.userId.value,
        args.sessionId,
      )
      return true
    },
  }),

  revokeAllOidcSessions: t.field({
    type: 'Boolean',
    grantScopes: ['authenticated'],
    resolve: async (_parent, _args, context) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }
      await Services.oidcProvider.revokeAllUserSessions(context.userId.value)
      return true
    },
  }),
}))
