import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import { startStandaloneServer } from '@apollo/server/standalone'
import consola from 'consola'
import { Context, createContext, TypedRequest } from './context'
import { schema } from './schema'

// Create Apollo Server
startStandaloneServer(new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginInlineTrace()],
    introspection: true,
    allowBatchedHttpRequests: true,
    logger: consola.withTag('apollo'),
    formatError: (error) => {
        consola.error(error)
        return error
    },
}), {
    listen: { port: 4000 },
    context: ({ req }) => {
        console.log(req)
        return createContext({ req: req as unknown as TypedRequest })
    },
}).then(({ url }) => {
    console.log(`🚀 H3 + GraphQL Server ready at: ${url}`)
    console.log(`📊 GraphQL endpoint: ${url}/graphql`)
    console.log(`🚀 Server ready at: ${url}`)
    console.log(`⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`)
})

