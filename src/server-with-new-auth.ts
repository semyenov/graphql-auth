/**
 * Example Server with New Auth Module
 *
 * Demonstrates how to use the new modular architecture.
 */

import 'reflect-metadata'
import { configureContainer } from './app/config/container'
import { AuthModule } from './modules/auth'

// Initialize the application
async function bootstrap() {
  console.log('🚀 Starting server with new modular architecture...')

  // Configure legacy container (for backward compatibility)
  configureContainer()

  // Register new modules
  AuthModule.register()
  console.log('✅ Auth module registered')

  // Import the existing server setup
  const { startServer } = await import('./server')

  // Start the server
  const server = await startServer()

  console.log(`
🎉 Server is running with new modular architecture!
📊 GraphQL endpoint: http://localhost:4000/graphql
📚 New features:
   - Domain-Driven Design architecture
   - Use Case pattern for business logic
   - Repository pattern for data access
   - Value Objects for type safety
   - Clean dependency injection
  `)

  return server
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
