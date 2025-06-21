/**
 * Logger Implementations Export
 * 
 * Centralizes all logger implementations.
 */

export { ConsoleLogger } from './console-logger'
export { FileLogger } from './file-logger'
export { NoopLogger } from './noop-logger'
export type { ILogger, LogContext } from '../../core/services/logger.interface'
export { LogLevel } from '../../core/services/logger.interface'
export { LoggerFactory, LoggerType } from './logger-factory'

// Import necessary types and classes for createLogger
import { LoggerFactory as LF, LoggerType as LT } from './logger-factory'
import { LogLevel as LL } from '../../core/services/logger.interface'
import type { ILogger as IL } from '../../core/services/logger.interface'

// Create logger convenience function
export function createLogger(context?: string | Record<string, any>): IL {
  const contextObj = typeof context === 'string' ? { module: context } : context
  return LF.create({
    type: LT.CONSOLE,
    level: LL.INFO,
    context: contextObj
  })
}