import SchemaBuilder, {
  BasePlugin,
  type FieldNullability,
  type InputFieldMap,
  type SchemaTypes,
  type TypeParam,
} from '@pothos/core'
import { type GraphQLSchema, isObjectType } from 'graphql'

import { applyMiddleware } from 'graphql-middleware'
import { type IRule, type IRules, shield } from 'graphql-shield'
import type { ILogicRule } from 'graphql-shield/typings/types'
import type { IContext } from '../../context/context.types'

export type ShieldRule = IRule | ILogicRule

declare global {
  export namespace PothosSchemaTypes {
    export interface Plugins<Types extends SchemaTypes> {
      shield?: ShieldPlugin<Types>
    }

    export interface ObjectTypeOptions<
      Types extends SchemaTypes = SchemaTypes,
      Shape = unknown,
    > {
      shield?: ShieldRule
    }

    export interface FieldOptions<
      Types extends SchemaTypes = SchemaTypes,
      ParentShape = unknown,
      Type extends TypeParam<Types> = TypeParam<Types>,
      Nullable extends FieldNullability<Type> = FieldNullability<Type>,
      Args extends InputFieldMap = InputFieldMap,
      ResolveShape = unknown,
      ResolveReturnShape = unknown,
    > {
      shield?: ShieldRule
    }

    export interface QueryFieldOptions<
      Types extends SchemaTypes,
      Type extends TypeParam<Types>,
      Nullable extends FieldNullability<Type>,
      Args extends InputFieldMap,
      ResolveReturnShape,
    > extends FieldOptions<
      Types,
      Types['Root'],
      Type,
      Nullable,
      Args,
      Types['Root'],
      ResolveReturnShape
    > {
      shield?: ShieldRule
    }

    export interface MutationFieldOptions<
      Types extends SchemaTypes,
      Type extends TypeParam<Types>,
      Nullable extends FieldNullability<Type>,
      Args extends InputFieldMap,
      ResolveReturnShape,
    > extends FieldOptions<
      Types,
      Types['Root'],
      Type,
      Nullable,
      Args,
      Types['Root'],
      ResolveReturnShape
    > {
      shield?: ShieldRule
    }
  }
}

const pluginName = 'shield' as const

export class ShieldPlugin<Types extends SchemaTypes> extends BasePlugin<Types> {
  override afterBuild(schema: GraphQLSchema): GraphQLSchema {
    const rules: IRules = {}

    const types = schema.getTypeMap()
    for (const typeName of Object.keys(types)) {
      const type = types[typeName]
      if (!isObjectType(type)) {
        continue
      }

      const typeOptions = type.extensions?.pothosOptions as
        | Record<string, unknown>
        | undefined
      const rule = typeOptions?.shield as ShieldRule | undefined
      const ruleMap: Record<string, ShieldRule> = rule ? { '*': rule } : {}

      rules[typeName] = ruleMap
      const fields = type.getFields()

      for (const fieldName of Object.keys(fields)) {
        const field = fields[fieldName]
        const fieldOptions = field?.extensions?.pothosOptions as
          | Record<string, unknown>
          | undefined
        const fieldRule = fieldOptions?.shield as ShieldRule | undefined

        if (fieldRule) {
          ruleMap[fieldName] = fieldRule
        }
      }
    }

    return applyMiddleware(
      schema,
      shield<Record<string, unknown>, IContext>(rules, {
        debug: process.env.NODE_ENV !== 'production',
        fallbackError: 'Not authorized',
        allowExternalErrors: true,
      }),
    )
  }
}

// Only register if not already registered
try {
  SchemaBuilder.registerPlugin(pluginName, ShieldPlugin)
} catch (_error: unknown) {
  // Plugin already registered, ignore
}

export default pluginName
