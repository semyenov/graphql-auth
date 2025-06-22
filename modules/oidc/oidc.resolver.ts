import { container } from 'tsyringe'
import { isAdmin } from '../../src/graphql/rules/common.rules'
import { builder } from '../../src/graphql/schema/builder'
import { prisma } from '../../src/prisma'
import { OidcClientInput, OidcClientUpdateInput } from './oidc.types'
import type { IOidcProviderService } from './services/oidc-provider.service'

const oidcService = container.resolve<IOidcProviderService>(
  'IOidcProviderService',
)

builder.queryFields((t) => ({
  oidcClients: t.prismaField({
    type: ['OidcClient'],
    grantScopes: ['authenticated'],
    shield: isAdmin,
    resolve: async (_query, _parent, _args, _context) => {
      return oidcService.listClients()
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
      return oidcService.getClient(args.clientId)
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
      return oidcService.createClient(args.input)
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
      return oidcService.updateClient(args.clientId, args.input)
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
      await oidcService.deleteClient(args.clientId)
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
      await oidcService.revokeUserSession(context.userId.value, args.sessionId)
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
      await oidcService.revokeAllUserSessions(context.userId.value)
      return true
    },
  }),
}))
