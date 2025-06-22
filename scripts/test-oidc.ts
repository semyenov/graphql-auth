#!/usr/bin/env bun

import { container } from 'tsyringe'
import 'reflect-metadata'
import type { IOidcProviderService } from '../modules/oidc/services/oidc-provider.service'
import { configureContainer } from '../src/app/config/container'
import { prisma } from '../src/prisma'

async function testOidcSetup() {
  try {
    console.log('🧪 Testing OIDC Setup...')

    // Configure DI container
    configureContainer()

    // Get OIDC service
    const oidcService = container.resolve<IOidcProviderService>(
      'IOidcProviderService',
    )
    console.log('✅ OIDC Service resolved')

    // Create a test client
    const testClient = await oidcService.createClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
      clientName: 'Test Client',
      redirectUris: ['http://localhost:3000/callback'],
      postLogoutRedirectUris: ['http://localhost:3000'],
      scope: 'openid profile email',
      grantTypes: ['authorization_code', 'refresh_token'],
      responseTypes: ['code'],
      applicationType: 'web',
    })

    console.log('✅ Test client created:', testClient.clientId)

    // List clients
    const clients = await oidcService.listClients()
    console.log(`✅ Found ${clients.length} OIDC clients`)

    // Clean up
    await oidcService.deleteClient('test-client')
    console.log('✅ Test client deleted')

    console.log('🎉 OIDC setup test completed successfully!')
  } catch (error) {
    console.error('❌ OIDC test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testOidcSetup()
