/**
 * Logger Utility
 *
 * Simple logger implementation for the application
 */

export interface LogLevel {
  error: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

class Logger implements LogLevel {
  private isDevelopment = process.env.NODE_ENV !== 'production'
  private isTest = process.env.NODE_ENV === 'test'

  error(...args: unknown[]) {
    if (!this.isTest) {
      console.error('[ERROR]', new Date().toISOString(), ...args)
    }
  }

  warn(...args: unknown[]) {
    if (!this.isTest) {
      console.warn('[WARN]', new Date().toISOString(), ...args)
    }
  }

  info(...args: unknown[]) {
    if (!this.isTest && this.isDevelopment) {
      console.info('[INFO]', new Date().toISOString(), ...args)
    }
  }

  debug(...args: unknown[]) {
    if (!this.isTest && this.isDevelopment && process.env.DEBUG) {
      console.debug('[DEBUG]', new Date().toISOString(), ...args)
    }
  }
}

export const logger = new Logger()
