import SchemaBuilder from '@pothos/core'
import DataloaderPlugin from '@pothos/plugin-dataloader'
import ErrorsPlugin from '@pothos/plugin-errors'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import RelayPlugin from '@pothos/plugin-relay'
import AuthScopePlugin from '@pothos/plugin-scope-auth'
import ValidationPlugin from '@pothos/plugin-validation'
import type { ZodError } from 'zod'
import { isProduction } from '@/app/config/environment'
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '@/app/errors/types'
import { decodeGlobalId, encodeGlobalId } from '@/modules/shared/connections'
import { prisma } from '@/modules/shared/database'
import type { DefaultContext } from '../context/context.types'
import ShieldPlugin from './plugins/shield'

export const builder = new SchemaBuilder<{
  Context: DefaultContext
  PrismaTypes: PrismaTypes
  AuthScopes: {
    public: boolean
  }
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
    JSON: {
      Input: unknown
      Output: unknown
    }
    ObjectID: {
      Input: string
      Output: string
    }
    DID: {
      Input: string
      Output: string
    }
    UUID: {
      Input: string
      Output: string
    }
  }
  Errors: {
    ValidationError: typeof ValidationError
    AuthenticationError: typeof AuthenticationError
    AuthorizationError: typeof AuthorizationError
    NotFoundError: typeof NotFoundError
    ConflictError: typeof ConflictError
    RateLimitError: typeof RateLimitError
  }
}>({
  plugins: [
    PrismaPlugin,
    RelayPlugin,
    ErrorsPlugin,
    DataloaderPlugin,
    ValidationPlugin,
    AuthScopePlugin,
    ShieldPlugin,
  ],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: isProduction ? 'error' : 'warn',
  },
  relay: {
    clientMutationId: 'omit',
    cursorType: 'String',
    encodeGlobalID: (typename, id) => encodeGlobalId(typename, id as string),
    decodeGlobalID: (globalId) => decodeGlobalId(globalId),
  },
  errors: {
    defaultTypes: [
      ValidationError,
      AuthenticationError,
      AuthorizationError,
      NotFoundError,
      ConflictError,
      RateLimitError,
    ],
  },
  validationOptions: {
    validationError: (error: ZodError) => {
      return new ValidationError(
        Object.values(error.flatten().fieldErrors)
          .flat()
          .filter(Boolean) as string[],
        'Validation failed',
      )
    },
  },
  scopeAuth: {
    authScopes(_ctx) {
      return {
        public: true,
      }
    },
  },
})
