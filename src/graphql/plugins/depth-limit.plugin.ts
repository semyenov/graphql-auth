/**
 * GraphQL Depth Limit Plugin
 *
 * Prevents deeply nested queries that could cause DoS attacks
 */

import type {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from '@apollo/server'
import type {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  InlineFragmentNode,
  SelectionNode,
} from 'graphql'
import { GraphQLError } from 'graphql'

export interface DepthLimitOptions {
  maxDepth: number
  skipIntrospection?: boolean
}

/**
 * Calculate the depth of a GraphQL query
 */
function calculateDepth(
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  fragments: Record<string, FragmentDefinitionNode>,
  depthSoFar: number,
  maxDepth: number,
  context: { operationName?: string },
): number {
  if (depthSoFar > maxDepth) {
    return depthSoFar
  }

  if ('selectionSet' in node && node.selectionSet) {
    return Math.max(
      ...node.selectionSet.selections.map((selection) =>
        determineDepth(selection, fragments, depthSoFar, maxDepth, context),
      ),
    )
  }

  return depthSoFar
}

/**
 * Determine depth for different selection types
 */
function determineDepth(
  selection: SelectionNode,
  fragments: Record<string, FragmentDefinitionNode>,
  depthSoFar: number,
  maxDepth: number,
  context: { operationName?: string },
): number {
  switch (selection.kind) {
    case 'Field':
      // Skip introspection fields
      if (selection.name.value.startsWith('__')) {
        return depthSoFar
      }
      return calculateDepth(
        selection,
        fragments,
        depthSoFar + 1,
        maxDepth,
        context,
      )

    case 'InlineFragment':
      return calculateDepth(selection, fragments, depthSoFar, maxDepth, context)

    case 'FragmentSpread': {
      const fragment = fragments[selection.name.value]
      if (fragment) {
        return calculateDepth(
          fragment,
          fragments,
          depthSoFar,
          maxDepth,
          context,
        )
      }
      return depthSoFar
    }

    default:
      return depthSoFar
  }
}

/**
 * Get fragment definitions from document
 */
function getFragments(
  document: DocumentNode,
): Record<string, FragmentDefinitionNode> {
  const fragments: Record<string, FragmentDefinitionNode> = {}

  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      fragments[definition.name.value] = definition
    }
  }

  return fragments
}

/**
 * Create depth limit plugin
 */
export function createDepthLimitPlugin(
  options: DepthLimitOptions = { maxDepth: 10 },
): ApolloServerPlugin<BaseContext> {
  const { maxDepth, skipIntrospection = true } = options

  return {
    async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
      return {
        async didResolveOperation(requestContext) {
          const { document, operationName, operation } = requestContext

          // Skip introspection queries if configured
          if (skipIntrospection && operationName === 'IntrospectionQuery') {
            return
          }

          if (!(document && operation)) {
            return
          }

          const fragments = getFragments(document)
          const context = { operationName: operationName || undefined }

          // Calculate query depth
          const depth = operation.selectionSet.selections.reduce(
            (max, selection) => {
              const currentDepth = determineDepth(
                selection,
                fragments,
                0,
                maxDepth,
                context,
              )
              return Math.max(max, currentDepth)
            },
            0,
          )

          // Throw error if depth exceeds limit
          if (depth > maxDepth) {
            throw new GraphQLError(
              `Query depth of ${depth} exceeds maximum allowed depth of ${maxDepth}`,
              {
                extensions: {
                  code: 'DEPTH_LIMIT_EXCEEDED',
                  depth,
                  maxDepth,
                },
              },
            )
          }
        },
      }
    },
  }
}

/**
 * Create query complexity plugin
 * This is a simplified version - in production, you'd calculate based on field complexity
 */
export function createComplexityLimitPlugin(
  maxComplexity = 1000,
): ApolloServerPlugin<BaseContext> {
  return {
    async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
      return {
        async didResolveOperation(requestContext) {
          const { document, operation } = requestContext

          if (!(document && operation)) {
            return
          }

          // Simple complexity calculation based on field count
          let complexity = 0
          const countFields = (
            selections: readonly SelectionNode[],
          ): number => {
            return selections.reduce((count, selection) => {
              if (selection.kind === 'Field') {
                count++
                if (selection.selectionSet) {
                  count += countFields(selection.selectionSet.selections)
                }
              } else if (
                selection.kind === 'InlineFragment' &&
                selection.selectionSet
              ) {
                count += countFields(selection.selectionSet.selections)
              }
              return count
            }, 0)
          }

          complexity = countFields(operation.selectionSet.selections)

          if (complexity > maxComplexity) {
            throw new GraphQLError(
              `Query complexity of ${complexity} exceeds maximum allowed complexity of ${maxComplexity}`,
              {
                extensions: {
                  code: 'COMPLEXITY_LIMIT_EXCEEDED',
                  complexity,
                  maxComplexity,
                },
              },
            )
          }
        },
      }
    },
  }
}
