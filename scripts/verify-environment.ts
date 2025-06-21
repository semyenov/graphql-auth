#!/usr/bin/env bun

import { env, isDevelopment, isProduction, isTest } from '../src/environment'

console.log('🔧 Environment Configuration Verification')
console.log('='.repeat(50))
console.log()

console.log('📊 Environment Variables:')
console.log(`  NODE_ENV: ${env.NODE_ENV}`)
console.log(`  PORT: ${env.PORT}`)
console.log(`  HOST: ${env.HOST}`)
console.log(`  DATABASE_URL: ${env.DATABASE_URL}`)
console.log(`  APP_SECRET: ${env.APP_SECRET.slice(0, 8)}...*** (masked)`)
console.log(`  CORS_ORIGIN: ${env.CORS_ORIGIN || 'not set'}`)
console.log(`  LOG_LEVEL: ${env.LOG_LEVEL}`)
console.log()

console.log('🚦 Environment Flags:')
console.log(`  isDevelopment: ${isDevelopment}`)
console.log(`  isProduction: ${isProduction}`)
console.log(`  isTest: ${isTest}`)
console.log()

console.log('✅ Environment configuration loaded successfully!')
console.log('🎯 All environment variables are validated and type-safe.')
