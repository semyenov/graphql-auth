/**
 * Logger Service Interface
 *
 * Defines logging operations for the application.
 * Supports different log levels and structured logging with context.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  [key: string]: unknown
}

export interface ILogger {
  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: LogContext): void

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): ILogger

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void
}
