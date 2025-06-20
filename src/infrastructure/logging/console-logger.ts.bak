/**
 * Console Logger Implementation
 * 
 * Implements the ILogger interface using console output.
 * Supports structured logging with context and configurable log levels.
 */

import { injectable } from 'tsyringe'
import type { ILogger, LogContext } from '../../core/services/logger.interface'
import { LogLevel } from '../../core/services/logger.interface'

@injectable()
export class ConsoleLogger implements ILogger {
  private minLevel: LogLevel = LogLevel.INFO
  private context: LogContext = {}

  constructor(context: LogContext = {}) {
    this.context = context
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context))
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error ? { 
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      } : {}
      
      console.error(this.formatMessage(
        LogLevel.ERROR, 
        message, 
        { ...errorContext, ...context }
      ))
    }
  }

  child(context: LogContext): ILogger {
    return new ConsoleLogger({ ...this.context, ...context })
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const currentLevelIndex = levels.indexOf(this.minLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const mergedContext = { ...this.context, ...context }
    
    const logObject = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(Object.keys(mergedContext).length > 0 ? { context: mergedContext } : {})
    }

    if (process.env.NODE_ENV === 'production') {
      // In production, use JSON format for better parsing
      return JSON.stringify(logObject)
    } else {
      // In development, use a more readable format
      const contextStr = Object.keys(mergedContext).length > 0 
        ? ` | ${JSON.stringify(mergedContext)}` 
        : ''
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
    }
  }
}