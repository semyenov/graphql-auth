# Logger Implementation

This directory contains the logger implementation following clean architecture principles.

## Overview

The logging system is designed to be:
- **Swappable**: Easy to change logger implementations
- **Testable**: Can use NoopLogger in tests
- **Structured**: Supports context-based logging
- **Configurable**: Different log levels and outputs

## Components

### Core Interface

- **ILogger** (`src/core/services/logger.interface.ts`): The core logger interface that all implementations must follow

### Implementations

- **ConsoleLogger**: Logs to console with readable format in development, JSON in production
- **FileLogger**: Logs to files in JSON format
- **NoopLogger**: Does nothing, useful for testing

### Factory

- **LoggerFactory**: Creates logger instances based on configuration

## Usage

### In Use Cases

```typescript
@injectable()
export class MyUseCase {
  private logger: ILogger

  constructor(
    @inject('ILogger') logger: ILogger,
  ) {
    // Create a child logger with context
    this.logger = logger.child({ useCase: 'MyUseCase' })
  }

  async execute(command: Command): Promise<Result> {
    this.logger.info('Starting operation', { commandData: command })
    
    try {
      // Business logic
      const result = await doSomething()
      
      this.logger.debug('Operation successful', { result })
      return result
    } catch (error) {
      this.logger.error('Operation failed', error as Error, { command })
      throw error
    }
  }
}
```

### Configuration

The logger can be configured via environment variables:

```bash
# Logger type: console (default), file, noop
LOGGER_TYPE=console

# Log level: debug, info (default), warn, error
LOG_LEVEL=info

# For file logger
LOG_FILE_PATH=/var/log/app.log
```

### Swapping Implementations

To use a different logger implementation:

1. **For all environments**: Update the factory in `container.ts`
2. **For specific environment**: Set environment variables
3. **For testing**: Register NoopLogger in test setup

```typescript
// Example: Using NoopLogger in tests
container.registerInstance<ILogger>('ILogger', new NoopLogger())

// Example: Using FileLogger in production
if (process.env.NODE_ENV === 'production') {
  const logger = new FileLogger('/var/log/app.log')
  container.registerInstance<ILogger>('ILogger', logger)
}
```

## Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General informational messages
- **WARN**: Warning messages
- **ERROR**: Error messages with stack traces

## Structured Logging

All loggers support structured logging with context:

```typescript
logger.info('User action', {
  userId: 123,
  action: 'login',
  timestamp: new Date().toISOString()
})
```

## Best Practices

1. **Use child loggers**: Create child loggers with context in constructors
2. **Log at appropriate levels**: Use debug for details, info for flow, warn for issues, error for failures
3. **Include context**: Always include relevant context (IDs, actions, etc.)
4. **Avoid logging sensitive data**: Never log passwords, tokens, or personal data
5. **Handle errors properly**: Use the error parameter in error() method