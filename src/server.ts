import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import { startStandaloneServer } from '@apollo/server/standalone'
import consola from 'consola'
import { type Context, createContext } from './context'
import { schema } from './schema'

// Create Apollo Server
const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginInlineTrace()],
    introspection: true,
    allowBatchedHttpRequests: true,
    logger: consola.withTag('apollo'),
    formatError: (error) => {
        consola.error(error)
        return error
    }
})

startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 }
}).then(({ url }) => {
    console.log(`\  
    🚀 Server ready at: ${url}
    ⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
    );
})

// console.log(`🚀 H3 + GraphQL Server ready at: http://localhost:${server.port}`)
// console.log(`📊 GraphQL endpoint: http://localhost:${server.port}/graphql`)
