import { print } from 'graphql'
import {
  GetMeQuery,
  GetFeedQuery,
  LoginMutation,
  executeGraphQL,
  type GetFeedVariables,
  type LoginVariables
} from './context'

// Demo script showing H3 + GraphQL + fetchdts + GraphQL Tada integration

const BASE_URL = 'http://localhost:3000'

// REST API client with type safety
class H3RestClient {
  constructor(private baseUrl: string = BASE_URL) { }

  // Test health endpoint
  async checkHealth() {
    const response = await fetch(`${this.baseUrl}/api/health`)
    const data = await response.json()
    console.log('🔍 Health Check:', data)
    return data
  }

  // Get all users via REST API
  async getUsers() {
    const response = await fetch(`${this.baseUrl}/api/users`)
    const data = await response.json()
    console.log('👥 Users via REST:', data)
    return data
  }

  // Get posts with pagination
  async getPosts(limit = 5, offset = 0, search?: string) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    if (search) {
      params.append('search', search)
    }

    const response = await fetch(`${this.baseUrl}/api/posts?${params}`)
    const data = await response.json()
    console.log('📄 Posts via REST:', data)
    return data
  }

  // Increment post view count
  async incrementViews(postId: number) {
    const response = await fetch(`${this.baseUrl}/api/posts/${postId}/view`, {
      method: 'POST'
    })
    const data = await response.json()
    console.log(`👀 Incremented views for post ${postId}:`, data)
    return data
  }

  // Test protected endpoint
  async getMe(token: string) {
    const response = await fetch(`${this.baseUrl}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    console.log('🔐 Protected endpoint:', data)
    return data
  }
}

// GraphQL client with full type safety
class H3GraphQLClient {
  constructor(private baseUrl: string = `${BASE_URL}/graphql`) { }

  // Login mutation with typed variables and response
  async login(variables: LoginVariables) {
    console.log('🔑 Logging in via GraphQL...')

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: print(LoginMutation),
        variables
      })
    })

    const result = await response.json()
    console.log('✅ Login result:', result)
    return result
  }

  // Get current user
  async getMe(token?: string) {
    console.log('👤 Getting current user via GraphQL...')

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        query: print(GetMeQuery)
      })
    })

    const result = await response.json()
    console.log('👤 Current user:', result)
    return result
  }

  // Get feed with typed variables
  async getFeed(variables?: GetFeedVariables, token?: string) {
    console.log('📰 Getting feed via GraphQL...')

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        query: print(GetFeedQuery),
        variables
      })
    })

    const result = await response.json()
    console.log('📰 Feed result:', result)
    return result
  }
}

// Demo function
export async function runDemo() {
  console.log('🚀 Starting H3 + GraphQL Demo\n')

  const restClient = new H3RestClient()
  const graphqlClient = new H3GraphQLClient()

  try {
    // Test REST endpoints
    console.log('=== REST API Demo ===')
    await restClient.checkHealth()
    await restClient.getUsers()
    await restClient.getPosts(3, 0)

    // Test protected endpoint (should work with any token for demo)
    await restClient.getMe('demo-token-123')

    console.log('\n=== GraphQL API Demo ===')

    // Test GraphQL endpoints
    await graphqlClient.getMe()

    await graphqlClient.getFeed({
      take: 5,
      orderBy: { updatedAt: 'desc' }
    })

    // Try login (will fail without valid credentials, but shows typed interface)
    try {
      await graphqlClient.login({
        email: 'demo@example.com',
        password: 'demo123'
      })
    } catch (error) {
      console.log('⚠️ Login failed (expected for demo):', error)
    }

    console.log('\n✅ Demo completed successfully!')
    console.log('🎯 All endpoints are fully typed with fetchdts + GraphQL Tada')

  } catch (error) {
    console.error('❌ Demo failed:', error)
  }
}

// Run demo if called directly
if (import.meta.main) {
  runDemo()
}

export { H3RestClient, H3GraphQLClient } 