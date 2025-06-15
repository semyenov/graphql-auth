#!/usr/bin/env bun
import { spawn } from 'child_process'
import path from 'path'

// Set test database URL
const testDbPath = path.join(__dirname, '../prisma/test.db')
process.env.DATABASE_URL = `file:${testDbPath}`

// Run vitest with the test environment
const vitest = spawn('bunx', ['vitest', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env
})

vitest.on('exit', (code) => {
  process.exit(code || 0)
})