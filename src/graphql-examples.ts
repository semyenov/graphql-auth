import { readFragment } from 'gql.tada'
import { print } from 'graphql'
import * as gql from './gql'

import {
  GraphQLCache,
  GraphQLResponseError,
  QueryBuilder,
  ResponseTransformer,
  devTools,
  schemaUtils,
} from './graphql-utils'

// =============================================================================
// BASIC USAGE EXAMPLES
// =============================================================================

/**
 * Example: Simple query execution
 */
export async function exampleSimpleQuery() {
  console.log('🔍 Simple Query Example')

  try {
    // Using convenience function
    const result = await gql.queryMe()

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors)
      return
    }

    const user = result.data?.me
    if (user) {
      // Use readFragment to access fragment fields safely
      const userInfo = readFragment(gql.UserInfoFragment, user)
      console.log('Current user:', userInfo)
    }
  } catch (error) {
    console.error('Query failed:', error)
  }
}

/**
 * Example: Query with variables
 */
export async function exampleQueryWithVariables() {
  console.log('🔍 Query with Variables Example')

  const variables: gql.GetFeedVariables = {
    first: 10,
    after: '0',
    searchString: 'GraphQL',
  }

  try {
    const result = await gql.queryFeed(variables)

    const posts = result.data?.feed
    if (posts && posts.edges && posts.edges.length > 0) {
      console.log(`Found ${posts.edges.length} posts`)
      console.log('Posts loaded successfully with fragments')
    }
  } catch (error) {
    console.error('Feed query failed:', error)
  }
}

/**
 * Example: Mutation execution
 */
export async function exampleMutation() {
  console.log('✏️ Mutation Example')

  const loginData: gql.LoginVariables = {
    email: 'user@example.com',
    password: 'securePassword123',
  }

  try {
    const result = await gql.mutateLogin(loginData)

    const token = result.data
    if (token) {
      console.log('Login successful, token received')

      // Use the token for subsequent requests
      const userResult = await gql.queryMe({
        authorization: `Bearer ${token}`,
      })

      const user = userResult.data?.me
      if (user) {
        const userInfo = readFragment(gql.UserInfoFragment, user)
        console.log('User info:', userInfo)
      }
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// =============================================================================
// ADVANCED USAGE EXAMPLES
// =============================================================================

/**
 * Example: Using GraphQL Client directly
 */
export async function exampleGraphQLClient() {
  console.log('🚀 GraphQL Client Example')

  const client = new gql.GraphQLClient('/graphql', {
    authorization: 'Bearer your-token-here',
  })

  try {
    // Execute query with client
    const result = await client.query<gql.GetMeResult>(print(gql.GetMeQuery))

    const user = result.data?.me
    if (user) {
      const userInfo = readFragment(gql.UserInfoFragment, user)
      console.log('Client result:', userInfo)
    }
  } catch (error) {
    console.error('Client query failed:', error)
  }
}

/**
 * Example: Using fragments in custom queries
 */
export async function exampleFragments() {
  console.log('🧩 Fragments Example')

  // Print fragment for inspection
  console.log('User Fragment:')
  console.log(print(gql.UserInfoFragment))

  console.log('Post with Author Fragment:')
  console.log(print(gql.PostInfoFragment))

  // Use fragment-based query
  const result = await gql.executeGraphQL<gql.GetFeedVariables, gql.GetFeedResult>(
    print(gql.GetFeedQuery),
    { first: 5 },
  )

  const posts = result.data?.feed
  if (posts && posts.edges && posts.edges.length > 0) {
    console.log(`Loaded ${posts.edges.length} posts with fragment-based typing`)
  }
}

/**
 * Example: Dynamic query building
 */
export async function exampleQueryBuilder() {
  console.log('🏗️ Query Builder Example')

  const builder = new QueryBuilder()

  const dynamicQuery = builder
    .variable('userId', 'Int!')
    .field('postById(id: $userId) { id title content published }')
    .build('query', 'GetPostBasics')

  console.log('Built query:')
  console.log(dynamicQuery)

  // Execute the dynamic query
  try {
    const result = await gql.executeGraphQL(dynamicQuery, { userId: 1 })
    console.log('Dynamic query result:', result.data)
  } catch (error) {
    console.error('Dynamic query failed:', error)
  }
}

/**
 * Example: Response transformation
 */
export async function exampleResponseTransformation() {
  console.log('🔄 Response Transformation Example')

  try {
    const result = await gql.queryFeed({ first: 3 })

    // Transform response to count posts
    const postsCount = result.data?.feed?.edges?.length || 0
    console.log('Posts count:', postsCount)

    // Safely unwrap data (throws on errors)
    const safeData = ResponseTransformer.unwrap(result)
    console.log('Safe data access:', safeData.feed?.edges?.length, 'posts')
  } catch (error) {
    if (error instanceof GraphQLResponseError) {
      console.error('GraphQL Error:', error.firstError?.message)
    } else {
      console.error('Other error:', error)
    }
  }
}

/**
 * Example: Caching
 */
export async function exampleCaching() {
  console.log('💾 Caching Example')

  const cache = new GraphQLCache()
  const queryString = print(gql.GetMeQuery)

  // Check cache first
  let cachedResult = cache.get<gql.GetMeResult>(queryString)
  if (cachedResult) {
    console.log('Cache hit for user')
    return
  }

  // Execute query
  const result = await gql.queryMe()

  if (result.data) {
    // Cache the result for 2 minutes
    cache.set(queryString, result.data, undefined, 2 * 60 * 1000)

    const user = result.data.me
    if (user) {
      const userInfo = readFragment(gql.UserInfoFragment, user)
      console.log('Result cached:', userInfo.email)
    }
  }

  // Next call will use cache
  cachedResult = cache.get<gql.GetMeResult>(queryString)
  if (cachedResult?.me) {
    const userInfo = readFragment(gql.UserInfoFragment, cachedResult.me)
    console.log('Cached result:', userInfo.email)
  }
}

/**
 * Example: Development utilities
 */
export async function exampleDevTools() {
  console.log('🛠️ Development Tools Example')

  // Pretty print query
  const prettyQuery = devTools.prettyPrint(gql.GetFeedQuery)
  console.log('Pretty printed query:')
  console.log(prettyQuery)

  // Analyze query
  const analysis = devTools.analyzeQuery(print(gql.GetFeedQuery))
  console.log('Query analysis:', analysis)

  // Timed operation
  await devTools.logOperation('GetFeed', async () => {
    return await gql.queryFeed({ first: 5 })
  })

  console.log('Query completed with timing')
}

/**
 * Example: Error handling patterns
 */
export async function exampleErrorHandling() {
  console.log('❌ Error Handling Example')

  try {
    // Intentionally cause an error with invalid variables
    const result = await gql.executeGraphQL(print(gql.GetPostQuery), { id: 'Post:1' })

    if (result.errors && result.errors.length > 0) {
      console.log('GraphQL errors detected:')
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message}`)
        if (error.path) {
          console.log(`     Path: ${error.path.join(' -> ')}`)
        }
      })
    }

    // Use dev utils to validate response
    try {
      const validatedData = gql.devUtils.validateResponse(result)
      console.log('Validated data:', validatedData)
    } catch (validationError) {
      console.log('Validation failed:', validationError)
    }
  } catch (error) {
    console.error('Request failed completely:', error)
  }
}

/**
 * Example: Type-safe field selection
 */
export async function exampleTypeSafeFields() {
  console.log('🎯 Type-safe Field Selection Example')

  // Using schema utils for field selection
  const userFields = schemaUtils.selectFields(['id', 'email', 'name'])
  console.log('User fields:', userFields)

  const nestedSelection = schemaUtils.selectNested('posts', [
    'id',
    'title',
    'published',
  ])
  console.log('Nested selection:', nestedSelection)

  const withFragments = schemaUtils.withFragments(
    ['id', 'email'],
    ['UserProfile', 'UserStats'],
  )
  console.log('With fragments:', withFragments)
}

/**
 * Example: Complete workflow
 */
export async function exampleCompleteWorkflow() {
  console.log('🔄 Complete Workflow Example')

  try {
    // 1. Login
    const loginResult = await gql.mutateLogin({
      email: 'demo@example.com',
      password: 'demoPassword',
    })

    const token = loginResult.data
    if (!token) {
      throw new Error('Login failed')
    }

    const authHeaders = { authorization: `Bearer ${token}` }

    // 2. Get current user
    const userResult = await gql.queryMe(authHeaders)
    const user = userResult.data?.me
    if (user) {
      const userInfo = readFragment(gql.UserInfoFragment, user)
      console.log('Logged in as:', userInfo.email)
    }

    // 3. Create a draft post
    const createResult = await gql.mutateCreateDraft(
      {
        data: {
          title: 'My New Post',
          content: 'This is a sample post created with gql.tada!',
        },
      },
      authHeaders,
    )

    const createdPost = createResult.data?.createDraft
    if (createdPost) {
      console.log('Created post successfully')

      // 4. Get updated feed
      const feedResult = await gql.queryFeed({ first: 5 }, authHeaders)
      console.log(`Feed now has ${feedResult.data?.feed?.edges?.length} posts`)
    }
  } catch (error) {
    console.error('Workflow failed:', error)
  }
}

// =============================================================================
// EXPORT ALL EXAMPLES
// =============================================================================

export const examples = {
  // Basic examples
  simpleQuery: exampleSimpleQuery,
  queryWithVariables: exampleQueryWithVariables,
  mutation: exampleMutation,

  // Advanced examples
  graphqlClient: exampleGraphQLClient,
  fragments: exampleFragments,
  queryBuilder: exampleQueryBuilder,
  responseTransformation: exampleResponseTransformation,
  caching: exampleCaching,
  devTools: exampleDevTools,
  errorHandling: exampleErrorHandling,
  typeSafeFields: exampleTypeSafeFields,
  completeWorkflow: exampleCompleteWorkflow,
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running all gql.tada integration examples...\n')

  for (const [name, example] of Object.entries(examples)) {
    try {
      console.log(`\n--- ${name.toUpperCase()} ---`)
      await example()
    } catch (error) {
      console.error(`Example ${name} failed:`, error)
    }
  }

  console.log('\n✅ All examples completed!')
}

// Export for easy testing
export default examples
