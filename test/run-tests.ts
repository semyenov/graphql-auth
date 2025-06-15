#!/usr/bin/env bun
import { spawn } from 'child_process'
// Import test environment to ensure proper database configuration
import './test-env'

// Run vitest with the test environment
const vitest = spawn('bunx', ['vitest', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env
})

vitest.on('exit', (code) => {
  process.exit(code || 0)
})