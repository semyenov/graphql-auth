/**
 * Logger Factory
 *
 * Creates appropriate logger instances based on configuration.
 */

import type { ILogger } from '../../core/services/logger.interface'
import { LogLevel } from '../../core/services/logger.interface'
import { ConsoleLogger } from './console-logger'
import { NoopLogger } from './noop-logger'

export enum LoggerType {
  CONSOLE = 'console',
  NOOP = 'noop',
}

export interface LoggerConfig {
  type: LoggerType
  level: LogLevel
  context?: Record<string, unknown>
}

export function createLogger(config: LoggerConfig): ILogger {
  let logger: ILogger

  switch (config.type) {
    case LoggerType.NOOP:
      logger = new NoopLogger()
      break
    default:
      logger = new ConsoleLogger(config.context)
      break
  }

  logger.setLevel(config.level)
  return logger
}

/**
 * Creates a logger based on environment variables
 */
export function createLoggerFromEnv(config?: Partial<LoggerConfig>): ILogger {
  const type = (process.env.LOGGER_TYPE as LoggerType) || LoggerType.CONSOLE
  const level = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO

  return createLogger({
    type: config?.type || type,
    level: config?.level || level,
    context: config?.context || {
      service: 'graphql-auth',
      environment: process.env.NODE_ENV || 'development',
    },
  })
}
