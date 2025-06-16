/**
 * User DTOs (Data Transfer Objects)
 * 
 * These are used to transfer data between layers without exposing domain entities.
 */

export interface UserDto {
  id: number
  email: string
  name: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateUserDto {
  email: string
  password: string
  name: string | null
}

export interface UpdateUserDto {
  name?: string | null
  email?: string
}

export interface AuthResponseDto {
  token: string
  user: UserDto
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  user: UserDto
}