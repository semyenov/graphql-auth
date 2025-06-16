/**
 * Post DTOs (Data Transfer Objects)
 */

export interface PostDto {
  id: number
  title: string
  content: string | null
  published: boolean
  viewCount: number
  authorId: number | null
  createdAt: Date
  updatedAt: Date
}

export interface PostWithAuthorDto extends PostDto {
  author: {
    id: number
    email: string
    name: string | null
  }
}

export interface CreatePostDto {
  title: string
  content: string | null
  authorId: number
}

export interface UpdatePostDto {
  title?: string
  content?: string | null
  published?: boolean
}