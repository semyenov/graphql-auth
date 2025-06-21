/**
 * Server with New Modular Architecture
 *
 * Demonstrates how to use the new DDD modules alongside existing code.
 */

import 'reflect-metadata'
import { configureContainer } from './app/config/container'
import { AuthModule } from './modules/auth'
import { PostsModule } from './modules/posts'

// Initialize the application
async function bootstrap() {
  console.log('🚀 Starting server with new modular architecture...')

  // Configure legacy container (for backward compatibility)
  configureContainer()

  // Register new modules
  const authModule = new AuthModule()
  authModule.register()
  console.log('✅ Auth module registered')

  const postsModule = new PostsModule()
  postsModule.register()
  console.log('✅ Posts module registered')

  // Import the existing server setup
  const { startServer } = await import('./server')

  // Start the server
  const server = await startServer()

  console.log(`
🎉 Server is running with new modular architecture!
📊 GraphQL endpoint: http://localhost:4000/graphql

📚 New Architecture Features:
   ✅ Domain-Driven Design (DDD)
   ✅ Clean Architecture with separated layers
   ✅ Use Case pattern for business logic
   ✅ Repository pattern for data access
   ✅ Value Objects for type safety
   ✅ Dependency Injection with TSyringe

🔧 Available Modules:
   • Auth Module - Authentication and user management
   • Posts Module - Blog post management

💡 Example GraphQL Operations:

  # Sign up a new user
  mutation SignUp {
    signUp(input: { 
      email: "user@example.com", 
      password: "securepass123",
      name: "John Doe"
    }) {
      user { id email name emailVerified }
      accessToken
      refreshToken
    }
  }

  # Create a post (requires authentication)
  mutation CreatePost {
    createPost(input: {
      title: "My First Post"
      content: "This is the content"
      published: true
    }) {
      id
      title
      content
      published
      author { name email }
    }
  }

  # Get published posts
  query Feed {
    feed(first: 10) {
      edges {
        node {
          id
          title
          content
          published
          viewCount
          author { name }
        }
      }
    }
  }
  `)

  return server
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
