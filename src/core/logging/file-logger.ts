/**
 * File Logger Implementation (Example)
 *
 * Example of an alternative logger implementation that writes to files.
 * This demonstrates how easy it is to swap logger implementations.
 */

import { appendFileSync } from 'fs'
import { join } from 'path'
import { injectable } from 'tsyringe'
import type { ILogger, LogContext } from '../../core/services/logger.interface'
import { LogLevel } from '../../core/services/logger.interface'

@injectable()
export class FileLogger implements ILogger {
  private minLevel: LogLevel = LogLevel.INFO
  private context: LogContext = {}
  private logFilePath: string

  constructor(logFilePath?: string, context: LogContext = {}) {
    this.logFilePath = logFilePath || join(process.cwd(), 'logs', 'app.log')
    this.context = context
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog(LogLevel.DEBUG, message, context)
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog(LogLevel.INFO, message, context)
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog(LogLevel.WARN, message, context)
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }
        : {}

      this.writeLog(LogLevel.ERROR, message, { ...errorContext, ...context })
    }
  }

  child(context: LogContext): ILogger {
    return new FileLogger(this.logFilePath, { ...this.context, ...context })
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ]
    const currentLevelIndex = levels.indexOf(this.minLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private writeLog(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): void {
    const timestamp = new Date().toISOString()
    const mergedContext = { ...this.context, ...context }

    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(Object.keys(mergedContext).length > 0
        ? { context: mergedContext }
        : {}),
    }

    try {
      appendFileSync(this.logFilePath, `${JSON.stringify(logEntry)}\n`)
    } catch (error) {
      // Fallback to console if file writing fails
      console.error('Failed to write to log file:', error)
      console.log(JSON.stringify(logEntry))
    }
  }
}
