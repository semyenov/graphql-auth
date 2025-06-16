/**
 * Post Type Definition (Enhanced)
 * 
 * Enhanced Post object type using advanced Pothos patterns
 */

import { type EnhancedContext } from '../../context/enhanced-context-direct';
import { builder } from '../builder';
import { createDateField, createComputedField, withFieldAuth } from '../../infrastructure/graphql/pothos-helpers';

// Define Post object type using Relay Node pattern with enhanced features
export const PostNode = builder.prismaNode('Post', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    // Implement interfaces
    interfaces: [],
    // Add authorization at type level (optional - can be overridden per field)
    authScopes: {
        public: true, // Posts are public by default
    },
    fields: (t) => ({
        // Core fields with descriptions
        title: t.exposeString('title', {
            description: 'The title of the post',
        }),
        content: t.exposeString('content', {
            nullable: true,
            description: 'The content/body of the post',
        }),
        published: t.exposeBoolean('published', {
            description: 'Whether the post is published and visible to the public',
        }),
        viewCount: t.exposeInt('viewCount', {
            description: 'Number of times this post has been viewed',
        }),
        
        // Relation with smart loading
        author: t.relation('author', {
            description: 'The user who created this post',
            // Could add query options here for optimization
        }),
        
        // Date fields using helper
        ...createDateField('createdAt', {
            description: 'When the post was first created',
        })(t),
        ...createDateField('updatedAt', {
            description: 'When the post was last modified',
        })(t),
        
        // Computed fields using helpers
        ...createComputedField<any, string | null>('excerpt', {
            type: 'String',
            nullable: true,
            description: 'A short excerpt from the post content (first 150 characters)',
            resolve: (post) => {
                if (!post.content) return null;
                return post.content.length > 150
                    ? post.content.substring(0, 150) + '...'
                    : post.content;
            },
        })(t),
        
        ...createComputedField<any, number>('wordCount', {
            type: 'Int',
            description: 'Approximate word count of the post content',
            resolve: (post) => {
                if (!post.content) return 0;
                return post.content.trim().split(/\s+/).length;
            },
        })(t),
        
        ...createComputedField<any, number>('readingTimeMinutes', {
            type: 'Int',
            description: 'Estimated reading time in minutes (assuming 200 words per minute)',
            resolve: (post) => {
                if (!post.content) return 0;
                const wordCount = post.content.trim().split(/\s+/).length;
                return Math.ceil(wordCount / 200);
            },
        })(t),
        
        // Authorization-based field
        isOwner: t.boolean({
            description: 'Whether the current user is the owner of this post',
            resolve: (post, _args, context: EnhancedContext) => {
                return context.userId?.value === post.authorId;
            },
        }),
        
        // Field with authorization (example - could be used for draft notes)
        ...withFieldAuth<any, string | null>(
            async (post, context) => {
                // Only owner can see draft notes
                return context.userId?.value === post.authorId;
            },
            {
                type: 'String',
                nullable: true,
                description: 'Private notes about the post (only visible to owner)',
                resolve: async (post, context) => {
                    // This could fetch from a separate table or field
                    return null; // Placeholder
                },
            }
        )(t),
        
        // Stats fields with DataLoader potential
        totalRevisions: t.int({
            description: 'Total number of times this post has been edited',
            resolve: async (post, _args, context) => {
                // This could use DataLoader to batch queries
                // For now, return a calculated value
                return 1; // Placeholder
            },
        }),
        
        // Related data with smart loading
        relatedPosts: t.field({
            type: ['Post'],
            description: 'Posts related to this one by tags or content',
            nullable: true,
            args: {
                limit: t.arg.int({ 
                    defaultValue: 3,
                    validate: {
                        min: 1,
                        max: 10,
                    }
                }),
            },
            resolve: async (post, args, context) => {
                // This could use more sophisticated matching
                return context.prisma.post.findMany({
                    where: {
                        id: { not: post.id },
                        published: true,
                        authorId: post.authorId, // For now, just same author
                    },
                    take: args.limit,
                    orderBy: { createdAt: 'desc' },
                });
            },
        }),
        
        // Conditional fields based on post state
        publishedAt: t.expose('createdAt', {
            type: 'DateTime',
            nullable: true,
            description: 'When the post was published (null if draft)',
            resolve: (post) => {
                return post.published ? post.createdAt : null;
            },
        }),
        
        // Engagement metrics
        engagementScore: t.float({
            description: 'Calculated engagement score based on views and other factors',
            resolve: (post) => {
                // Simple algorithm for now
                const baseScore = Math.log10(post.viewCount + 1);
                const ageInDays = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                const ageFactor = Math.max(0, 1 - (ageInDays / 365));
                return Math.round((baseScore * ageFactor) * 100) / 100;
            },
        }),
    }),
});

// Export type reference for use in other parts of the schema
export type PostType = typeof PostNode;

// Add custom methods to Post type (could be used for complex operations)
export const PostHelpers = {
    canUserEdit: (post: any, userId: number | undefined): boolean => {
        return userId === post.authorId;
    },
    
    canUserDelete: (post: any, userId: number | undefined): boolean => {
        return userId === post.authorId;
    },
    
    isVisible: (post: any, userId: number | undefined): boolean => {
        return post.published || userId === post.authorId;
    },
};