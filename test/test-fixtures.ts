/**
 * Test fixtures for common testing scenarios
 */

import type { Post, User } from '@prisma/client'
import { prisma } from './setup'
import { createTestUser, createTestPost } from './test-data'

/**
 * Create a complete blog scenario with multiple users and posts
 */
export async function createBlogScenario(): Promise<{
  authors: User[]
  posts: Post[]
  readers: User[]
}> {
  // Create authors with different post counts
  const alice = await createTestUser({
    email: 'alice@blog.com',
    name: 'Alice Author',
  })
  
  const bob = await createTestUser({
    email: 'bob@blog.com',
    name: 'Bob Blogger',
  })
  
  const charlie = await createTestUser({
    email: 'charlie@blog.com',
    name: 'Charlie Contributor',
  })
  
  // Create readers (users without posts)
  const readers = await Promise.all([
    createTestUser({ email: 'reader1@blog.com', name: 'Reader One' }),
    createTestUser({ email: 'reader2@blog.com', name: 'Reader Two' }),
  ])
  
  // Create posts with various states
  const posts = await Promise.all([
    // Alice's posts - mix of published and drafts
    createTestPost({
      authorId: alice.id,
      title: 'Getting Started with GraphQL',
      content: 'GraphQL is a query language for APIs...',
      published: true,
      viewCount: 150,
    }),
    createTestPost({
      authorId: alice.id,
      title: 'Advanced GraphQL Patterns',
      content: 'In this post, we explore advanced patterns...',
      published: true,
      viewCount: 89,
    }),
    createTestPost({
      authorId: alice.id,
      title: 'Draft: GraphQL Best Practices',
      content: 'Work in progress...',
      published: false,
    }),
    
    // Bob's posts - all published
    createTestPost({
      authorId: bob.id,
      title: 'Introduction to TypeScript',
      content: 'TypeScript adds static typing to JavaScript...',
      published: true,
      viewCount: 200,
    }),
    createTestPost({
      authorId: bob.id,
      title: 'Building REST APIs with Node.js',
      content: 'Learn how to build RESTful APIs...',
      published: true,
      viewCount: 175,
    }),
    
    // Charlie's posts - all drafts
    createTestPost({
      authorId: charlie.id,
      title: 'Draft: My First Post',
      content: 'Just getting started...',
      published: false,
    }),
    createTestPost({
      authorId: charlie.id,
      title: 'Draft: Another Idea',
      content: 'Still thinking about this one...',
      published: false,
    }),
  ])
  
  return {
    authors: [alice, bob, charlie],
    posts,
    readers,
  }
}

/**
 * Create a permission testing scenario with users having different roles
 */
export async function createPermissionScenario(): Promise<{
  admin: User
  moderator: User
  regularUser: User
  posts: {
    adminPost: Post
    moderatorPost: Post
    userPost: Post
  }
}> {
  const [admin, moderator, regularUser] = await Promise.all([
    createTestUser({
      email: 'admin@permissions.test',
      name: 'Admin User',
    }),
    createTestUser({
      email: 'moderator@permissions.test',
      name: 'Moderator User',
    }),
    createTestUser({
      email: 'user@permissions.test',
      name: 'Regular User',
    }),
  ])
  
  // In a real scenario, you'd set roles here
  // For now, we'll just create posts for each user
  const [adminPost, moderatorPost, userPost] = await Promise.all([
    createTestPost({
      authorId: admin.id,
      title: 'Admin Announcement',
      content: 'Important system update...',
      published: true,
    }),
    createTestPost({
      authorId: moderator.id,
      title: 'Community Guidelines Update',
      content: 'Please review the new guidelines...',
      published: true,
    }),
    createTestPost({
      authorId: regularUser.id,
      title: 'My First Blog Post',
      content: 'Hello world!',
      published: false,
    }),
  ])
  
  return {
    admin,
    moderator,
    regularUser,
    posts: {
      adminPost,
      moderatorPost,
      userPost,
    },
  }
}

/**
 * Create a social interaction scenario
 */
export async function createSocialScenario(): Promise<{
  users: User[]
  connections: Array<{ follower: User; following: User }>
  posts: Post[]
}> {
  // Create a network of users
  const users = await Promise.all([
    createTestUser({ email: 'popular@social.test', name: 'Popular User' }),
    createTestUser({ email: 'active@social.test', name: 'Active User' }),
    createTestUser({ email: 'lurker@social.test', name: 'Lurker User' }),
    createTestUser({ email: 'newbie@social.test', name: 'New User' }),
  ])
  
  const [popular, active, lurker, newbie] = users
  
  // Create posts with different engagement levels
  const posts = await Promise.all([
    // Popular user's viral post
    createTestPost({
      authorId: popular.id,
      title: 'This Changed My Life',
      content: 'An inspiring story...',
      published: true,
      viewCount: 5000,
    }),
    // Active user's regular posts
    createTestPost({
      authorId: active.id,
      title: 'Daily Update #1',
      content: 'What I learned today...',
      published: true,
      viewCount: 50,
    }),
    createTestPost({
      authorId: active.id,
      title: 'Daily Update #2',
      content: 'Another day, another lesson...',
      published: true,
      viewCount: 45,
    }),
    // Lurker has no posts
    // Newbie's first attempt
    createTestPost({
      authorId: newbie.id,
      title: 'Hello Everyone!',
      content: 'Just joined this platform...',
      published: true,
      viewCount: 10,
    }),
  ])
  
  // Define follower relationships (would be implemented with a join table in real app)
  const connections = [
    { follower: active, following: popular },
    { follower: lurker, following: popular },
    { follower: newbie, following: popular },
    { follower: lurker, following: active },
    { follower: newbie, following: active },
  ]
  
  return {
    users,
    connections,
    posts,
  }
}

/**
 * Create a content moderation scenario
 */
export async function createModerationScenario(): Promise<{
  posts: {
    appropriate: Post[]
    flagged: Post[]
    deleted: Post[]
  }
  users: {
    goodUser: User
    spammer: User
    troll: User
  }
}> {
  // Create users with different behavior patterns
  const [goodUser, spammer, troll] = await Promise.all([
    createTestUser({ email: 'good@moderation.test', name: 'Good User' }),
    createTestUser({ email: 'spammer@moderation.test', name: 'Spammer' }),
    createTestUser({ email: 'troll@moderation.test', name: 'Troll User' }),
  ])
  
  // Create appropriate content
  const appropriate = await Promise.all([
    createTestPost({
      authorId: goodUser.id,
      title: 'Helpful Tutorial',
      content: 'Here\'s how to solve this common problem...',
      published: true,
    }),
    createTestPost({
      authorId: goodUser.id,
      title: 'Interesting Discussion',
      content: 'What are your thoughts on this topic?',
      published: true,
    }),
  ])
  
  // Create flagged content (in a real app, these would have moderation flags)
  const flagged = await Promise.all([
    createTestPost({
      authorId: spammer.id,
      title: 'BUY NOW!!! AMAZING DEAL!!!',
      content: 'Click here for unbelievable prices...',
      published: true,
    }),
    createTestPost({
      authorId: troll.id,
      title: 'Controversial Opinion',
      content: 'This will make everyone angry...',
      published: true,
    }),
  ])
  
  // These would be soft-deleted in a real app
  const deleted: Post[] = []
  
  return {
    posts: {
      appropriate,
      flagged,
      deleted,
    },
    users: {
      goodUser,
      spammer,
      troll,
    },
  }
}

/**
 * Create a pagination testing scenario
 */
export async function createPaginationScenario(): Promise<{
  user: User
  posts: Post[]
}> {
  const user = await createTestUser({
    email: 'prolific@pagination.test',
    name: 'Prolific Writer',
  })
  
  // Create many posts for pagination testing
  const posts = await Promise.all(
    Array.from({ length: 25 }, (_, i) =>
      createTestPost({
        authorId: user.id,
        title: `Post ${i + 1}: ${i % 2 === 0 ? 'Published' : 'Draft'}`,
        content: `Content for post ${i + 1}`,
        published: i % 2 === 0, // Every other post is published
        viewCount: Math.floor(Math.random() * 100),
      })
    )
  )
  
  return { user, posts }
}