/**
 * Logger Factory
 *
 * Creates appropriate logger instances based on configuration.
 */

import type { ILogger } from '../../core/services/logger.interface'
import { LogLevel } from '../../core/services/logger.interface'
import { ConsoleLogger } from './console-logger'
import { FileLogger } from './file-logger'
import { NoopLogger } from './noop-logger'

export enum LoggerType {
  CONSOLE = 'console',
  FILE = 'file',
  NOOP = 'noop',
}

export interface LoggerConfig {
  type: LoggerType
  level: LogLevel
  filePath?: string
  context?: Record<string, unknown>
}

export function createLogger(config: LoggerConfig): ILogger {
  let logger: ILogger

  switch (config.type) {
    case LoggerType.FILE:
      if (!config.filePath) {
        throw new Error('File path is required for file logger')
      }
      logger = new FileLogger(config.filePath, config.context)
      break
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
  const filePath = process.env.LOG_FILE_PATH

  return createLogger({
    type: config?.type || type,
    level: config?.level || level,
    filePath: config?.filePath || filePath,
    context: config?.context || {
      service: 'graphql-auth',
      environment: process.env.NODE_ENV || 'development',
    },
  })
}
