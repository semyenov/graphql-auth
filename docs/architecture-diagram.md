# Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        C[GraphQL Client]
    end
    
    subgraph "HTTP Layer"
        H[H3 Server]
        MW[Middleware<br/>- CORS<br/>- Security Headers<br/>- Rate Limiting]
    end
    
    subgraph "GraphQL Layer"
        AS[Apollo Server]
        CTX[Context Factory]
        SCH[Pothos Schema]
        
        subgraph "Authorization"
            SA[Scope Auth Plugin]
            SH[Shield Plugin]
        end
    end
    
    subgraph "Module Layer"
        subgraph "Auth Module"
            AR[Auth Resolvers]
            ASV[Auth Services]
            AV[Auth Validation]
        end
        
        subgraph "Posts Module"
            PR[Posts Resolvers]
            PSV[Posts Service]
            PV[Posts Validation]
        end
        
        subgraph "Users Module"
            UR[Users Resolvers]
            USV[Users Service]
            UV[Users Validation]
        end
    end
    
    subgraph "Infrastructure"
        DI[TSyringe Container]
        ERR[Error Handling]
        LOG[Logging]
        DL[DataLoaders]
    end
    
    subgraph "Data Layer"
        P[Prisma Client]
        DB[(Database)]
    end
    
    C -->|HTTP Request| H
    H --> MW
    MW --> AS
    AS --> CTX
    CTX --> SCH
    SCH --> SA
    SCH --> SH
    
    AR --> DI
    PR --> DI
    UR --> DI
    
    ASV --> P
    PSV --> P
    USV --> P
    
    CTX --> DL
    DL --> P
    
    P --> DB
    
    style C fill:#e1f5fe
    style H fill:#fff3e0
    style AS fill:#f3e5f5
    style P fill:#e8f5e9
    style DB fill:#e0f2f1
```

## Request Flow Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant H as HTTP Server
    participant MW as Middleware
    participant AS as Apollo Server
    participant CTX as Context
    participant R as Resolver
    participant S as Service
    participant P as Prisma
    participant DB as Database
    
    C->>H: GraphQL Request
    H->>MW: Apply Middleware
    MW->>MW: CORS Check
    MW->>MW: Rate Limiting
    MW->>MW: Security Headers
    MW->>AS: Forward Request
    AS->>CTX: Create Context
    CTX->>CTX: Extract JWT
    CTX->>CTX: Create DataLoaders
    AS->>R: Execute Resolver
    R->>R: Check Scopes (Pothos)
    R->>R: Check Shield Rules
    R->>S: Call Service (if complex)
    S->>P: Database Query
    P->>DB: SQL Query
    DB-->>P: Result
    P-->>S: Model Instance
    S-->>R: Business Result
    R-->>AS: GraphQL Response
    AS-->>C: HTTP Response
```

## Module Structure

```mermaid
graph LR
    subgraph "Feature Module"
        SCHEMA[module.schema.ts<br/>GraphQL Types]
        PERM[module.permissions.ts<br/>Auth Rules]
        VAL[module.validation.ts<br/>Input Validation]
        
        subgraph "Resolvers"
            RES[module.resolver.ts<br/>GraphQL Operations]
        end
        
        subgraph "Services"
            SVC[module.service.ts<br/>Business Logic]
        end
        
        subgraph "Types"
            TYP[module.types.ts<br/>TypeScript Types]
        end
    end
    
    SCHEMA --> RES
    PERM --> RES
    VAL --> RES
    RES --> SVC
    SVC --> TYP
    
    style SCHEMA fill:#f3e5f5
    style RES fill:#e3f2fd
    style SVC fill:#e8f5e9
```

## Authorization Flow

```mermaid
graph TD
    REQ[GraphQL Request] --> AUTH{Has Token?}
    AUTH -->|No| PUB{Public Operation?}
    AUTH -->|Yes| VER[Verify JWT]
    
    PUB -->|No| DENY1[Deny Access]
    PUB -->|Yes| EXEC1[Execute]
    
    VER --> SCOPE{Check Scopes}
    SCOPE -->|Fail| DENY2[Deny Access]
    SCOPE -->|Pass| SHIELD{Check Shield Rules}
    
    SHIELD -->|Fail| DENY3[Deny Access]
    SHIELD -->|Pass| EXEC2[Execute Resolver]
    
    style DENY1 fill:#ffcdd2
    style DENY2 fill:#ffcdd2
    style DENY3 fill:#ffcdd2
    style EXEC1 fill:#c8e6c9
    style EXEC2 fill:#c8e6c9
```

## Data Access Pattern

```mermaid
graph LR
    subgraph "Resolver"
        RES[Resolver Logic]
        IMP[import prisma]
    end
    
    subgraph "Service"
        SVC[Service Logic]
        IMP2[import prisma]
    end
    
    subgraph "Direct Access"
        PRISMA[Prisma Client]
    end
    
    subgraph "Database"
        DB[(PostgreSQL/SQLite)]
    end
    
    RES --> IMP
    SVC --> IMP2
    IMP --> PRISMA
    IMP2 --> PRISMA
    PRISMA --> DB
    
    style IMP fill:#e8f5e9
    style IMP2 fill:#e8f5e9
```

## Dependency Injection

```mermaid
graph TD
    subgraph "Container Setup"
        REG[Register Interfaces]
        IMPL[Register Implementations]
    end
    
    subgraph "Runtime"
        RES[Resolver]
        CON[container.resolve]
        SVC[Service Instance]
    end
    
    REG --> IMPL
    RES --> CON
    CON --> SVC
    IMPL -.-> SVC
    
    style REG fill:#e3f2fd
    style CON fill:#fff3e0
```

## Error Handling Flow

```mermaid
graph TD
    OP[Operation] --> TRY{Try Block}
    TRY -->|Success| RET[Return Result]
    TRY -->|Error| CATCH[Catch Block]
    
    CATCH --> NORM[normalizeError]
    NORM --> TYPE{Error Type?}
    
    TYPE -->|Known| KNOWN[BaseError Subclass]
    TYPE -->|Unknown| UNKNOWN[Create BaseError]
    
    KNOWN --> FORMAT[Format Response]
    UNKNOWN --> FORMAT
    
    FORMAT --> CLIENT[Return to Client]
    
    style NORM fill:#fff3e0
    style FORMAT fill:#f3e5f5
```

These diagrams illustrate the key architectural patterns and data flows in the GraphQL authentication service.