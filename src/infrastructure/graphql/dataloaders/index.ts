/**
 * DataLoader Implementations
 * 
 * Provides batch loading functions to prevent N+1 queries
 */

import type { Post, User } from '@prisma/client';
import DataLoader from 'dataloader';
import type { EnhancedContext } from '../../../context/enhanced-context';
import { prisma } from '../../../prisma';

/**
 * Creates DataLoaders for the context
 */
export function createDataLoaders(context: EnhancedContext) {
    return {
        // User loader by ID
        userById: new DataLoader<number, User | null>(
            async (userIds) => {
                const users = await prisma.user.findMany({
                    where: { id: { in: [...userIds] } },
                });

                const userMap = new Map(users.map(user => [user.id, user]));
                return userIds.map(id => userMap.get(id) || null);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Posts by author ID loader
        postsByAuthorId: new DataLoader<number, Post[]>(
            async (authorIds) => {
                const posts = await prisma.post.findMany({
                    where: { authorId: { in: [...authorIds] } },
                    orderBy: { createdAt: 'desc' },
                });

                const postsByAuthor = new Map<number, Post[]>();
                for (const post of posts) {
                    const authorPosts = postsByAuthor.get(post.authorId!) || [];
                    authorPosts.push(post);
                    postsByAuthor.set(post.authorId!, authorPosts);
                }

                return authorIds.map(id => postsByAuthor.get(id) || []);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Published posts count by author
        publishedPostsCountByAuthor: new DataLoader<number, number>(
            async (authorIds) => {
                const counts = await prisma.post.groupBy({
                    by: ['authorId'],
                    where: {
                        authorId: { in: [...authorIds] },
                        published: true,
                    },
                    _count: true,
                });

                const countMap = new Map(
                    counts.map(({ authorId, _count }) => [authorId, _count])
                );

                return authorIds.map(id => countMap.get(id) || 0);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Draft posts count by author
        draftPostsCountByAuthor: new DataLoader<number, number>(
            async (authorIds) => {
                const counts = await prisma.post.groupBy({
                    by: ['authorId'],
                    where: {
                        authorId: { in: [...authorIds] },
                        published: false,
                    },
                    _count: true,
                });

                const countMap = new Map(
                    counts.map(({ authorId, _count }) => [authorId, _count])
                );

                return authorIds.map(id => countMap.get(id) || 0);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Total views for all posts by author
        totalViewsByAuthor: new DataLoader<number, number>(
            async (authorIds) => {
                const results = await prisma.post.groupBy({
                    by: ['authorId'],
                    where: {
                        authorId: { in: [...authorIds] },
                    },
                    _sum: {
                        viewCount: true,
                    },
                });

                const viewsMap = new Map(
                    results.map(({ authorId, _sum }) => [
                        authorId,
                        _sum.viewCount || 0
                    ])
                );

                return authorIds.map(id => viewsMap.get(id) || 0);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Check if a user has any posts
        hasPostsByAuthor: new DataLoader<number, boolean>(
            async (authorIds) => {
                const authors = await prisma.post.findMany({
                    where: { authorId: { in: [...authorIds] } },
                    select: { authorId: true },
                    distinct: ['authorId'],
                });

                const hasPostsSet = new Set(authors.map(a => a.authorId));
                return authorIds.map(id => hasPostsSet.has(id));
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),

        // Latest post by author
        latestPostByAuthor: new DataLoader<number, Post | null>(
            async (authorIds) => {
                // Get the latest post for each author in a single query
                const latestPosts = await Promise.all(
                    [...new Set(authorIds)].map(async (authorId) => {
                        const post = await prisma.post.findFirst({
                            where: { authorId },
                            orderBy: { createdAt: 'desc' },
                        });
                        return { authorId, post };
                    })
                );

                const postMap = new Map(
                    latestPosts.map(({ authorId, post }) => [authorId, post])
                );

                return authorIds.map(id => postMap.get(id) || null);
            },
            {
                cacheKeyFn: (key) => key,
            }
        ),
    };
}

export type DataLoaders = ReturnType<typeof createDataLoaders>;