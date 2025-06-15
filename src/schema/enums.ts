import { builder } from './builder';

// Define enums
export const SortOrder = builder.enumType('SortOrder', {
    values: ['asc', 'desc'] as const,
}); 