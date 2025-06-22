import { builder } from '../../src/graphql/schema/builder'
import { prisma } from '../../src/prisma'

export const OidcClientType = builder.prismaObject('OidcClient', {
  fields: (t) => ({
    id: t.exposeID('id'),
    clientId: t.exposeString('clientId'),
    clientName: t.exposeString('clientName'),
    redirectUris: t.field({
      type: ['String'],
      resolve: (parent) => JSON.parse(parent.redirectUris),
    }),
    postLogoutRedirectUris: t.field({
      type: ['String'],
      nullable: true,
      resolve: (parent) =>
        parent.postLogoutRedirectUris
          ? JSON.parse(parent.postLogoutRedirectUris)
          : null,
    }),
    scope: t.exposeString('scope'),
    grantTypes: t.field({
      type: ['String'],
      resolve: (parent) => JSON.parse(parent.grantTypes),
    }),
    responseTypes: t.field({
      type: ['String'],
      resolve: (parent) => JSON.parse(parent.responseTypes),
    }),
    applicationType: t.exposeString('applicationType'),
    clientUri: t.exposeString('clientUri', { nullable: true }),
    logoUri: t.exposeString('logoUri', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})

export const OidcSessionType = builder.prismaObject('OidcSession', {
  fields: (t) => ({
    id: t.exposeID('id'),
    sessionId: t.exposeString('sessionId'),
    client: t.prismaField({
      type: OidcClientType,
      resolve: async (_query, parent, _args, _context) => {
        const client = await prisma.oidcClient.findUnique({
          where: { clientId: parent.clientId },
        })
        return client ?? null
      },
    }),
    scope: t.exposeString('scope'),
    authTime: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.authTime,
    }),
    expiresAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.expiresAt,
    }),
  }),
})

export const OidcClientInput = builder.inputType('OidcClientInput', {
  fields: (t) => ({
    clientId: t.string({ required: true }),
    clientSecret: t.string({ required: false }),
    clientName: t.string({ required: true }),
    redirectUris: t.stringList({ required: true }),
    postLogoutRedirectUris: t.stringList({ required: false }),
    scope: t.string({ required: false }),
    grantTypes: t.stringList({ required: false }),
    responseTypes: t.stringList({ required: false }),
    applicationType: t.string({ required: false }),
  }),
})

export const OidcClientUpdateInput = builder.inputType(
  'OidcClientUpdateInput',
  {
    fields: (t) => ({
      clientName: t.string({ required: false }),
      redirectUris: t.stringList({ required: false }),
      postLogoutRedirectUris: t.stringList({ required: false }),
      scope: t.string({ required: false }),
      grantTypes: t.stringList({ required: false }),
      responseTypes: t.stringList({ required: false }),
    }),
  },
)
