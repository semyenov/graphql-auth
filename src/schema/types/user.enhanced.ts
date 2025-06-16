/**
 * User Type Definition with DataLoader Integration
 * 
 * Enhanced User object type using DataLoaders for efficient data fetching
 */

import type { EnhancedContext } from '../../context/enhanced-context';
import { builder } from '../builder';

// Define User object type using Relay Node pattern with DataLoader optimizations
builder.prismaNode('User', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    fields: (t) => ({
        name: t.exposeString('name', { nullable: true }),
        email: t.exposeString('email'),
        
        // Enhanced posts connection with cursor-based pagination
        posts: t.relatedConnection('posts', {
            cursor: 'id',
            // Enable total count for better UX
            totalCount: true,
            // Configure query options
            query: (args, _context) => ({
                // Add default ordering by creation date (newest first)
                orderBy: { createdAt: 'desc' },
                // Allow filtering by published status
                where: args.published !== undefined
                    ? { published: args.published ?? false }
                    : undefined,
            }),
            // Add additional connection arguments
            args: {
                published: t.arg.boolean({
                    description: 'Filter posts by published status',
                }),
            },
        }),
        
        // Use DataLoader for drafts count
        draftsCount: t.int({
            description: 'Number of unpublished posts by this user',
            resolve: async (user, _args, context: EnhancedContext) => {
                return context.loaders.draftPostsCountByAuthor.load(user.id);
            },
        }),
        
        // Use DataLoader for published posts count
        publishedPostsCount: t.int({
            description: 'Number of published posts by this user',
            resolve: async (user, _args, context: EnhancedContext) => {
                return context.loaders.publishedPostsCountByAuthor.load(user.id);
            },
        }),
        
        // Total views across all posts (DataLoader)
        totalPostViews: t.int({
            description: 'Total number of views across all posts by this user',
            resolve: async (user, _args, context: EnhancedContext) => {
                return context.loaders.totalViewsByAuthor.load(user.id);
            },
        }),
        
        // Check if user has any posts (DataLoader)
        hasPosts: t.boolean({
            description: 'Whether this user has created any posts',
            resolve: async (user, _args, context: EnhancedContext) => {
                return context.loaders.hasPostsByAuthor.load(user.id);
            },
        }),
        
        // Latest post (DataLoader)
        latestPost: t.field({
            type: 'Post',
            nullable: true,
            description: 'The most recent post by this user',
            resolve: async (user, _args, context: EnhancedContext) => {
                return context.loaders.latestPostByAuthor.load(user.id);
            },
        }),
        
        // Account age
        accountAge: t.string({
            description: 'How long this account has been active',
            resolve: (user) => {
                const now = new Date();
                const created = new Date(user.createdAt);
                const diffMs = now.getTime() - created.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                
                if (diffDays === 0) return 'Today';
                if (diffDays === 1) return '1 day';
                if (diffDays < 30) return `${diffDays} days`;
                if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
                return `${Math.floor(diffDays / 365)} years`;
            },
        }),
        
        // Profile completeness
        profileCompleteness: t.int({
            description: 'Percentage of profile completion (0-100)',
            resolve: (user) => {
                let score = 0;
                if (user.email) score += 40;
                if (user.name) score += 30;
                if (user.createdAt) score += 30;
                return score;
            },
        }),
        
        // Activity level based on posts
        activityLevel: t.string({
            description: 'User activity level based on posting frequency',
            resolve: async (user, _args, context: EnhancedContext) => {
                const postsCount = await context.loaders.publishedPostsCountByAuthor.load(user.id);
                
                if (postsCount === 0) return 'New';
                if (postsCount < 5) return 'Beginner';
                if (postsCount < 20) return 'Active';
                if (postsCount < 50) return 'Contributor';
                return 'Expert';
            },
        }),
    }),
});

// Export type reference for use in other parts of the schema
export type UserType = typeof builder.prismaNode;