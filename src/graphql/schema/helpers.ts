/**
 * Pothos GraphQL Helper Functions
 * 
 * Provides reusable patterns and utilities for Pothos schema building
 */

import { z } from 'zod';

/**
 * Validation schemas for common patterns
 */
export const commonValidations = {
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    content: z.string().max(10000, 'Content too long').optional(),
    id: z.string().regex(/^[A-Za-z0-9+/=]+$/, 'Invalid ID format'),
    pagination: {
        first: z.number().min(1).max(100).optional(),
        last: z.number().min(1).max(100).optional(),
        after: z.string().optional(),
        before: z.string().optional(),
    },
};
