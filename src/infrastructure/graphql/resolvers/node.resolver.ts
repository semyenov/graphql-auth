/**
 * Node GraphQL Resolvers
 *
 * Handles Relay Node interface queries for fetching objects by global ID.
 */

// import { builder } from '../../../schema/builder'

// // Node query for fetching any object by global ID
// builder.queryField('node', (t) =>
//     t.node({
//         id: t.arg.id({ required: true }),
//     })
// )

// // Nodes query for fetching multiple objects by global IDs
// builder.queryField('nodes', (t) =>
//     t.nodeList({
//         ids: t.arg.idList({ required: true }),
//     })
// )