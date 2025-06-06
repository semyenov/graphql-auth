import {
  GetMeQuery,
  GetFeedQuery,
  LoginMutation,
  SignupMutation,
  CreateDraftMutation,
  executeGraphQL,
  type GetFeedVariables,
  type GetFeedResult,
  type LoginVariables,
  type SignupVariables,
  type CreateDraftVariables
} from './context'
import { print } from 'graphql'

// Example: Type-safe GraphQL client using GraphQL Tada

export class TypedGraphQLClient {
  constructor(private baseUrl: string = '/graphql') { }

  // Get current user with full type safety
  async getMe(token?: string) {
    const result = await executeGraphQL(
      print(GetMeQuery),
      undefined, // No variables needed
      token ? { authorization: `Bearer ${token}` } : undefined
    )

    // result.data is fully typed as GetMeResult
    if (result.data?.me) {
      console.log(`Welcome ${result.data.me.name}!`)
      console.log(`You have ${result.data.me.posts.length} posts`)
    }

    return result
  }

  // Get feed with typed variables and response
  async getFeed(variables?: GetFeedVariables, token?: string) {
    const result = await executeGraphQL(
      print(GetFeedQuery),
      variables, // Fully typed variables
      token ? { authorization: `Bearer ${token}` } : undefined
    )

    // result.data.feed is fully typed
    if (result.data?.feed) {
      result.data.feed.forEach((post: NonNullable<GetFeedResult['feed']>[0]) => {
        console.log(`Post: ${post.title} by ${post.author?.name}`)
        console.log(`Views: ${post.viewCount}, Published: ${post.published}`)
      })
    }

    return result
  }

  // Login with typed credentials
  async login(variables: LoginVariables) {
    const result = await executeGraphQL(
      print(LoginMutation),
      variables // TypeScript ensures email and password are provided
    )

    // result.data.login is fully typed
    if (result.data?.login?.token) {
      console.log('Login successful!')
      console.log(`Token: ${result.data.login.token}`)
      console.log(`User: ${result.data.login.user.email}`)
    }

    return result
  }

  // Signup with typed user data
  async signup(variables: SignupVariables) {
    const result = await executeGraphQL(
      print(SignupMutation),
      variables // TypeScript ensures required fields are provided
    )

    if (result.data?.signup?.token) {
      console.log('Signup successful!')
      console.log(`Welcome ${result.data.signup.user.name || variables.email}!`)
    }

    return result
  }

  // Create draft with typed post data
  async createDraft(variables: CreateDraftVariables, token: string) {
    const result = await executeGraphQL(
      print(CreateDraftMutation),
      variables, // TypeScript ensures PostCreateInput structure
      { authorization: `Bearer ${token}` }
    )

    if (result.data?.createDraft) {
      console.log(`Draft created: ${result.data.createDraft.title}`)
      console.log(`Author: ${result.data.createDraft.author?.name}`)
    }

    return result
  }
}

// Usage examples with full type safety
export async function examples() {
  const client = new TypedGraphQLClient()

  try {
    // Login - TypeScript ensures correct shape
    const loginResult = await client.login({
      email: "user@example.com",
      password: "password123"
    })

    const token = loginResult.data?.login?.token
    if (!token) throw new Error('Login failed')

    // Get current user info
    await client.getMe(token)

    // Get feed with typed parameters
    await client.getFeed({
      take: 10,
      skip: 0,
      orderBy: { updatedAt: 'desc' }
    }, token)

    // Create a new draft
    await client.createDraft({
      data: {
        title: "My New Post",
        content: "This is the content of my new post"
      }
    }, token)

    // Signup new user
    await client.signup({
      email: "newuser@example.com",
      password: "newpassword123",
      name: "New User"
    })

  } catch (error) {
    console.error('GraphQL operation failed:', error)
  }
}

// Export for use in other files
export default TypedGraphQLClient 