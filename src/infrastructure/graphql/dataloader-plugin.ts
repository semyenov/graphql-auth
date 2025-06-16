/**
 * DataLoader Plugin Configuration for Pothos
 * 
 * Configures the DataLoader plugin to work with our enhanced context
 */

import type { EnhancedContext } from '../../context/enhanced-context-direct';
import { builder } from '../../schema/builder';

// Configure DataLoader plugin
builder.dataloader<keyof EnhancedContext['loaders']>((loaderName, context: EnhancedContext) => {
    // Return the specific loader from context
    return context.loaders[loaderName] as any;
});

// Example of using loadableNode for efficient node loading
export function createLoadableNode<T extends { id: number }>(
    typeName: string,
    loaderName: keyof EnhancedContext['loaders']
) {
    return builder.loadableNode(typeName, {
        id: {
            resolve: (parent: T) => parent.id,
        },
        load: (ids: number[], context: EnhancedContext) => {
            const loader = context.loaders[loaderName] as any;
            return loader.loadMany(ids);
        },
    });
}