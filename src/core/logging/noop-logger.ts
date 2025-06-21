/**
 * No-op Logger Implementation
 *
 * A logger that does nothing - useful for testing or when logging is disabled.
 */

import { injectable } from 'tsyringe'
import type {
  ILogger,
  LogContext,
  LogLevel,
} from '../../core/services/logger.interface'

@injectable()
export class NoopLogger implements ILogger {
  debug(_message: string, _context?: LogContext): void {
    // No operation
  }

  info(_message: string, _context?: LogContext): void {
    // No operation
  }

  warn(_message: string, _context?: LogContext): void {
    // No operation
  }

  error(_message: string, _error?: Error, _context?: LogContext): void {
    // No operation
  }

  child(_context: LogContext): ILogger {
    return new NoopLogger()
  }

  setLevel(_level: LogLevel): void {
    // No operation
  }
}
