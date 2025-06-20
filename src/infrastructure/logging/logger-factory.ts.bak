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
  NOOP = 'noop'
}

export interface LoggerConfig {
  type: LoggerType
  level: LogLevel
  filePath?: string
  context?: Record<string, any>
}

export class LoggerFactory {
  static create(config: LoggerConfig): ILogger {
    let logger: ILogger

    switch (config.type) {
      case LoggerType.FILE:
        logger = new FileLogger(config.filePath, config.context)
        break
      case LoggerType.NOOP:
        logger = new NoopLogger()
        break
      case LoggerType.CONSOLE:
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
  static createFromEnv(): ILogger {
    const type = (process.env.LOGGER_TYPE as LoggerType) || LoggerType.CONSOLE
    const level = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO
    const filePath = process.env.LOG_FILE_PATH
    
    return this.create({
      type,
      level,
      filePath,
      context: {
        service: 'graphql-auth',
        environment: process.env.NODE_ENV || 'development'
      }
    })
  }
}