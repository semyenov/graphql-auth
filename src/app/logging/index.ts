/**
 * Logger Implementations Export
 *
 * Centralizes all logger implementations.
 */

import type { ILogger as IL } from '../services/logger.interface'
import { LogLevel as LL } from '../services/logger.interface'
import { createLoggerFromEnv, LoggerType as LT } from './logger-factory'

export type {
  ILogger,
  LogContext,
  LogLevel,
} from '../services/logger.interface'
export { ConsoleLogger } from './console-logger'
export { createLoggerFromEnv, LoggerType } from './logger-factory'
export { NoopLogger } from './noop-logger'

export function createLogger(context?: string | Record<string, unknown>): IL {
  const contextObj = typeof context === 'string' ? { module: context } : context
  return createLoggerFromEnv({
    type: LT.CONSOLE,
    level: LL.INFO,
    context: contextObj,
  })
}
