import { ApolloServer } from 'apollo-server'
// import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { context } from './context'

import { schema } from './schema'
export const server = new ApolloServer({
  schema,
  context
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

const port = 3100
server.listen({ port }).then(({ url, subscriptionsUrl }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`)
  console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`)
})
